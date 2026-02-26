# Backend Testing Guide

## Running Tests

### Run All Tests

```bash
python manage.py test
```

### Run Specific App Tests

```bash
python manage.py test investiq_api.apps.authentication
python manage.py test investiq_api.apps.prediction
```

### Run with Verbosity

```bash
python manage.py test --verbosity=2
```

### Run with Coverage

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

## Test Structure

### Authentication Tests

```python
# tests/test_authentication.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()

class UserRegistrationTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.registration_url = '/api/auth/register/register/'

    def test_user_registration_success(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'SecurePass123',
            'password_confirm': 'SecurePass123',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

    def test_user_registration_password_mismatch(self):
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'SecurePass123',
            'password_confirm': 'DifferentPass',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_duplicate_email(self):
        User.objects.create_user(
            username='user1',
            email='test@example.com',
            password='Pass123'
        )
        data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'SecurePass123',
            'password_confirm': 'SecurePass123',
        }
        response = self.client.post(self.registration_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class UserLoginTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.login_url = '/api/auth/login/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='SecurePass123'
        )

    def test_user_login_success(self):
        data = {'username': 'testuser', 'password': 'SecurePass123'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_user_login_invalid_credentials(self):
        data = {'username': 'testuser', 'password': 'WrongPass'}
        response = self.client.post(self.login_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
```

### Prediction Tests

```python
# tests/test_prediction.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from investiq_api.apps.prediction.models import StockPrediction
from investiq_api.apps.prediction.utils import MockStockDataProvider, AIPredictor

User = get_user_model()

class StockPredictionTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.prediction_url = '/api/prediction/predictions/create_prediction/'
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='SecurePass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_create_prediction_success(self):
        data = {
            'stock_symbol': 'AAPL',
            'user_prediction': 'bullish',
            'predicted_price': 155.00
        }
        response = self.client.post(self.prediction_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(StockPrediction.objects.count(), 1)
        self.assertIn('ai_prediction', response.data['prediction'])

    def test_create_prediction_invalid_symbol(self):
        data = {
            'stock_symbol': 'INVALID123',
            'user_prediction': 'bullish'
        }
        response = self.client.post(self.prediction_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_prediction_stats(self):
        # Create some predictions
        for i in range(5):
            StockPrediction.objects.create(
                user=self.user,
                stock_symbol=f'STOCK{i}',
                user_prediction='bullish',
                current_price=100.0,
                ai_prediction='bullish',
                ai_confidence=0.8,
                ai_explanation='Test'
            )

        url = '/api/prediction/predictions/prediction_stats/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_predictions'], 5)

class MockStockDataProviderTest(TestCase):
    def test_get_mock_data(self):
        prices = MockStockDataProvider.get_mock_data('AAPL')
        self.assertEqual(len(prices), 30)
        self.assertTrue(all(isinstance(p, (int, float)) for p in prices))

    def test_calculate_sma(self):
        prices = [100, 101, 102, 103, 104, 105, 106, 107, 108, 109]
        sma = MockStockDataProvider.calculate_sma(prices, 5)
        self.assertIsNotNone(sma)
        self.assertTrue(100 < sma < 110)

    def test_get_stock_analysis(self):
        analysis = MockStockDataProvider.get_stock_analysis('AAPL')
        self.assertIn('current_price', analysis)
        self.assertIn('sma_50', analysis)
        self.assertIn('sma_200', analysis)
        self.assertIn('historical_prices', analysis)

class AIPredictorTest(TestCase):
    def test_predict_stock(self):
        analysis = {
            'current_price': 150.0,
            'sma_50': 148.0,
            'sma_200': 145.0,
        }
        result = AIPredictor.predict_stock(analysis, 'bullish')

        self.assertIn('ai_prediction', result)
        self.assertIn('confidence', result)
        self.assertIn('explanation', result)
        self.assertIsInstance(result['confidence'], (int, float))
```

### Portfolio Tests

```python
# tests/test_portfolio.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from investiq_api.apps.portfolio.models import Portfolio, PortfolioHolding

User = get_user_model()

class PortfolioTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='SecurePass123'
        )
        self.client.force_authenticate(user=self.user)
        self.portfolio, _ = Portfolio.objects.get_or_create(user=self.user)

    def test_portfolio_creation(self):
        self.assertIsNotNone(self.portfolio)
        self.assertEqual(self.portfolio.user, self.user)

    def test_add_holding(self):
        url = '/api/portfolio/add_holding/'
        data = {
            'stock_symbol': 'AAPL',
            'quantity': 10,
            'purchase_price': 150.00,
            'current_price': 155.00,
            'sector': 'technology',
            'risk_rating': 5.0
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.portfolio.holdings.count(), 1)

    def test_get_portfolio_overview(self):
        # Create a holding
        PortfolioHolding.objects.create(
            portfolio=self.portfolio,
            stock_symbol='AAPL',
            quantity=10,
            purchase_price=150.00,
            current_price=155.00,
            sector='technology'
        )

        url = '/api/portfolio/overview/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('holdings', response.data)
        self.assertIn('allocation', response.data)

    def test_portfolio_performance(self):
        PortfolioHolding.objects.create(
            portfolio=self.portfolio,
            stock_symbol='AAPL',
            quantity=10,
            purchase_price=150.00,
            current_price=160.00,
            sector='technology'
        )
        PortfolioHolding.objects.create(
            portfolio=self.portfolio,
            stock_symbol='GOOGL',
            quantity=5,
            purchase_price=140.00,
            current_price=130.00,
            sector='technology'
        )

        url = '/api/portfolio/performance/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['total_invested'], 0)

class PortfolioHoldingTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='SecurePass123'
        )
        self.portfolio = Portfolio.objects.create(user=self.user)

    def test_holding_profit_loss(self):
        holding = PortfolioHolding.objects.create(
            portfolio=self.portfolio,
            stock_symbol='AAPL',
            quantity=10,
            purchase_price=150.00,
            current_price=160.00,
            sector='technology'
        )

        self.assertEqual(holding.initial_investment, 1500.0)
        self.assertEqual(holding.current_value, 1600.0)
        self.assertEqual(holding.profit_loss, 100.0)
        self.assertAlmostEqual(holding.profit_loss_percent, 6.67, places=1)
```

### News Tests

```python
# tests/test_news.py

from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status
from investiq_api.apps.news.utils import MockNewsProvider

class MockNewsProviderTest(TestCase):
    def test_fetch_news(self):
        news = MockNewsProvider.fetch_news(limit=10)
        self.assertEqual(len(news), 10)

        for article in news:
            self.assertIn('title', article)
            self.assertIn('description', article)
            self.assertIn('sentiment', article)
            self.assertIn('impact_score', article)

    def test_fetch_news_by_sentiment(self):
        positive_news = MockNewsProvider.get_news_by_sentiment('positive')
        self.assertTrue(all(n['sentiment'] == 'positive' for n in positive_news))

    def test_get_trending_news(self):
        trending = MockNewsProvider.get_trending_news()
        self.assertEqual(len(trending), 10)

        # Verify it's sorted by impact score
        scores = [n['impact_score'] for n in trending]
        self.assertEqual(scores, sorted(scores, reverse=True))

class NewsAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_all_news(self):
        url = '/api/news/articles/all_news/?page=1&page_size=5'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_get_market_sentiment(self):
        url = '/api/news/articles/market_sentiment/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('overall_sentiment', response.data)
        self.assertIn('breakdown', response.data)

    def test_filter_by_sentiment(self):
        url = '/api/news/articles/by_sentiment/?sentiment=positive'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['sentiment'], 'positive')
```

## Manual Testing Checklist

### Authentication

- [ ] User can register with valid data
- [ ] User cannot register with existing email
- [ ] User can login with correct credentials
- [ ] User cannot login with wrong password
- [ ] User can refresh token
- [ ] User can update profile
- [ ] User can change password

### Predictions

- [ ] User can create prediction for valid stock
- [ ] User cannot create prediction with invalid symbol
- [ ] AI generates prediction with confidence score
- [ ] User can view prediction history
- [ ] User can see prediction statistics
- [ ] Trending stocks are returned correctly

### News

- [ ] All news can be fetched
- [ ] News can be filtered by sentiment
- [ ] Market sentiment is calculated
- [ ] News by stock works
- [ ] Trending news is ordered by impact

### Portfolio

- [ ] User can add stock holding
- [ ] Portfolio overview shows correct totals
- [ ] Profit/loss is calculated correctly
- [ ] Risk score is calculated
- [ ] Cash can be updated
- [ ] Holdings can be removed
- [ ] Sector allocation works

### Advisor

- [ ] Recommendation can be retrieved
- [ ] Recommendation history shows past recommendations
- [ ] Feedback can be submitted
- [ ] Analysis summary includes all metrics

## Performance Testing

```bash
# Install Apache Bench
apt-get install apache2-utils

# Test API performance
ab -n 100 -c 10 http://localhost:8000/api/health/
ab -n 100 -c 10 -H "Authorization: Bearer TOKEN" http://localhost:8000/api/portfolio/overview/
```

## Load Testing

```bash
# Install Locust
pip install locust

# Create locustfile.py and run
locust -f locustfile.py --host=http://localhost:8000
```

## Security Testing

```bash
# Check for common vulnerabilities
pip install bandit
bandit -r investiq_api/

# Check dependencies for vulnerabilities
pip install safety
safety check
```

## Continuous Integration Example

### GitHub Actions (.github/workflows/tests.yml)

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.11

      - name: Install dependencies
        run: |
          pip install -r requirements.txt

      - name: Run tests
        run: |
          python manage.py test --verbosity=2

      - name: Check code quality
        run: |
          pip install flake8
          flake8 investiq_api --count --select=E9,F63,F7,F82 --show-source --statistics
```

---

**Testing is essential for maintaining code quality and preventing regressions!**
