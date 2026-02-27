from rest_framework import serializers
from .models import PaymentOrder


class PaymentOrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentOrder
        fields = [
            'id',
            'order_id',
            'amount',
            'currency',
            'status',
            'payment_id',
            'created_at',
            'verified_at',
        ]
