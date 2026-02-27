from datetime import timedelta
import uuid

try:
    import razorpay
except (ImportError, ModuleNotFoundError):
    razorpay = None

from django.conf import settings
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PaymentOrder
from .serializers import PaymentOrderSerializer


class CreateOrderView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')
        amount = int(request.data.get('amount', 1))

        if amount < 1:
            return Response(
                {'detail': 'Amount must be at least 1.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Mock order if Razorpay keys not configured or library not available
        if not key_id or not key_secret or razorpay is None:
            mock_order_id = f'order_{uuid.uuid4().hex[:12]}'
            payment_order = PaymentOrder.objects.create(
                user=request.user,
                order_id=mock_order_id,
                amount=amount,
                currency='INR',
                status=PaymentOrder.STATUS_PENDING,
            )

            return Response({
                'order': PaymentOrderSerializer(payment_order).data,
                'razorpay_key_id': 'test_key_demo',
                'razorpay_order_id': mock_order_id,
                'amount': amount,
                'currency': 'INR',
                'is_demo_mode': True,
            }, status=status.HTTP_201_CREATED)

        # Real Razorpay order
        client = razorpay.Client(auth=(key_id, key_secret))
        order = client.order.create({
            'amount': amount * 100,
            'currency': 'INR',
            'receipt': f'premium-{request.user.id}-{timezone.now().timestamp()}',
            'payment_capture': 1,
        })

        payment_order = PaymentOrder.objects.create(
            user=request.user,
            order_id=order['id'],
            amount=amount,
            currency=order.get('currency', 'INR'),
            status=PaymentOrder.STATUS_PENDING,
        )

        data = {
            'order': PaymentOrderSerializer(payment_order).data,
            'razorpay_key_id': key_id,
            'razorpay_order_id': order['id'],
            'amount': amount,
            'currency': order.get('currency', 'INR'),
        }
        return Response(data, status=status.HTTP_201_CREATED)


class VerifyPaymentView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get('razorpay_order_id')
        payment_id = request.data.get('razorpay_payment_id')
        signature = request.data.get('razorpay_signature')

        if not order_id or not payment_id or not signature:
            return Response(
                {'detail': 'Missing payment verification data.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            payment_order = PaymentOrder.objects.get(order_id=order_id, user=request.user)
        except PaymentOrder.DoesNotExist:
            return Response(
                {'detail': 'Order not found.'},
                status=status.HTTP_404_NOT_FOUND,
            )

        key_id = getattr(settings, 'RAZORPAY_KEY_ID', '')
        key_secret = getattr(settings, 'RAZORPAY_KEY_SECRET', '')

        # Demo mode: auto-verify if keys not set
        if not key_id or not key_secret:
            payment_order.status = PaymentOrder.STATUS_PAID
            payment_order.payment_id = payment_id
            payment_order.signature = signature
            payment_order.verified_at = timezone.now()
            payment_order.save(update_fields=['status', 'payment_id', 'signature', 'verified_at'])

            request.user.is_premium = True
            if not request.user.premium_since:
                request.user.premium_since = timezone.now()
            request.user.premium_until = timezone.now() + timedelta(days=30)
            request.user.save(update_fields=['is_premium', 'premium_since', 'premium_until'])

            return Response({'detail': 'Payment verified (demo mode).', 'is_premium': True})

        # Real Razorpay verification
        client = razorpay.Client(auth=(key_id, key_secret))

        try:
            client.utility.verify_payment_signature({
                'razorpay_order_id': order_id,
                'razorpay_payment_id': payment_id,
                'razorpay_signature': signature,
            })
        except razorpay.errors.SignatureVerificationError:
            payment_order.status = PaymentOrder.STATUS_FAILED
            payment_order.payment_id = payment_id
            payment_order.signature = signature
            payment_order.save(update_fields=['status', 'payment_id', 'signature'])
            return Response(
                {'detail': 'Payment verification failed.'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment_order.status = PaymentOrder.STATUS_PAID
        payment_order.payment_id = payment_id
        payment_order.signature = signature
        payment_order.verified_at = timezone.now()
        payment_order.save(update_fields=['status', 'payment_id', 'signature', 'verified_at'])

        request.user.is_premium = True
        if not request.user.premium_since:
            request.user.premium_since = timezone.now()
        request.user.premium_until = timezone.now() + timedelta(days=30)
        request.user.save(update_fields=['is_premium', 'premium_since', 'premium_until'])

        return Response({'detail': 'Payment verified.', 'is_premium': True})


class PremiumStatusView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'is_premium': request.user.is_premium,
            'premium_since': request.user.premium_since,
            'premium_until': request.user.premium_until,
        })
