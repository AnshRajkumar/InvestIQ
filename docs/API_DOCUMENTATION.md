# Festronix API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

### JWT Token Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Register User

**Endpoint:** `POST /auth/register/register/`

**Request:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "password_confirm": "SecurePass123",
  "first_name": "John",
  "last_name": "Doe",
  "experience_level": "beginner",
  "risk_tolerance": "medium"
}
```

**Response:** `201 Created`

```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "experience_level": "beginner",
    "risk_tolerance": "medium"
  }
}
```

### Login

**Endpoint:** `POST /auth/login/`

**Request:**

```json
{
  "username": "john_doe",
  "password": "SecurePass123"
}
```

**Response:** `200 OK`

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

### Refresh Token

**Endpoint:** `POST /auth/refresh/`

**Request:**

```json
{
  "refresh": "<refresh_token>"
}
```

**Response:** `200 OK`

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}
```

### Get Current User Profile

**Endpoint:** `GET /auth/profile/me/`

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "bio": "Interested in tech stocks",
  "experience_level": "beginner",
  "risk_tolerance": "medium",
  "phone_number": "+1234567890",
  "location": "New York, USA",
  "interests": "tech,finance,startups",
  "created_at": "2024-02-26T10:30:00Z",
  "updated_at": "2024-02-26T10:30:00Z"
}
```

### Update Profile

**Endpoint:** `PUT /auth/profile/update_profile/`

**Request:**

```json
{
  "bio": "Updated bio",
  "risk_tolerance": "high",
  "interests": "tech,biotech,renewable"
}
```

**Response:** `200 OK`

```json
{
  "message": "Profile updated successfully",
  "user": { ... }
}
```

### Change Password

**Endpoint:** `POST /auth/profile/change_password/`

**Request:**

```json
{
  "old_password": "OldPass123",
  "new_password": "NewPass123"
}
```

**Response:** `200 OK`

```json
{
  "message": "Password changed successfully"
}
```

## Stock Predictions

### Create Prediction

**Endpoint:** `POST /prediction/predictions/create_prediction/`

**Request:**

```json
{
  "stock_symbol": "AAPL",
  "user_prediction": "bullish",
  "predicted_price": 155.5
}
```

**Response:** `201 Created`

```json
{
  "prediction": {
    "id": 1,
    "username": "john_doe",
    "stock_symbol": "AAPL",
    "user_prediction": "bullish",
    "predicted_price": 155.5,
    "current_price": 150.0,
    "sma_50": 148.5,
    "sma_200": 145.0,
    "ai_prediction": "bullish",
    "ai_confidence": 0.75,
    "ai_explanation": "Based on technical analysis...",
    "actual_price": null,
    "is_correct": null,
    "price_change_percent": null,
    "created_at": "2024-02-26T10:30:00Z",
    "updated_at": "2024-02-26T10:30:00Z",
    "prediction_date": "2024-02-26"
  },
  "market_analysis": {
    "current_price": 150.0,
    "sma_50": 148.5,
    "sma_200": 145.0,
    "signal": "Buy"
  },
  "ai_consensus": true
}
```

### Get My Predictions

**Endpoint:** `GET /prediction/predictions/my_predictions/`

**Query Parameters:**

- `symbol` (optional): Filter by stock symbol
- `page` (optional, default: 1): Page number
- `page_size` (optional, default: 10): Results per page

**Response:** `200 OK`

```json
{
  "count": 25,
  "page": 1,
  "page_size": 10,
  "results": [ ... ]
}
```

### Get Prediction Statistics

**Endpoint:** `GET /prediction/predictions/prediction_stats/`

**Response:** `200 OK`

```json
{
  "total_predictions": 25,
  "correct_predictions": 18,
  "accuracy_percentage": 72.0,
  "most_predicted_stocks": ["AAPL", "GOOGL", "MSFT"]
}
```

### Get Stock Information

**Endpoint:** `GET /prediction/predictions/stock_info/?symbol=AAPL`

**Response:** `200 OK`

```json
{
  "symbol": "AAPL",
  "current_price": 150.00,
  "sma_50": 148.50,
  "sma_200": 145.00,
  "price_history_30d": [145.00, 145.50, 146.00, ...]
}
```

### Get Trending Stocks

**Endpoint:** `GET /prediction/predictions/trending_stocks/`

**Response:** `200 OK`

```json
{
  "trending": ["AAPL", "GOOGL", "MSFT", "TSLA", "AMZN"]
}
```

## Financial News

### Get All News

**Endpoint:** `GET /news/articles/all_news/?page=1&page_size=10`

**Response:** `200 OK`

```json
{
  "count": 50,
  "page": 1,
  "page_size": 10,
  "results": [
    {
      "id": 1,
      "title": "Tech Giants Rally on AI Innovation",
      "description": "Major technology companies show strong growth...",
      "source": "MarketWatch",
      "url": "https://example.com/news/1",
      "related_stocks": "AAPL,GOOGL,MSFT",
      "related_stocks_list": ["AAPL", "GOOGL", "MSFT"],
      "sentiment": "positive",
      "sentiment_score": 0.85,
      "impact_score": 78.5,
      "impact_category": "product",
      "image_url": "https://example.com/image.jpg",
      "published_at": "2024-02-26T10:30:00Z",
      "fetched_at": "2024-02-26T10:35:00Z"
    }
  ]
}
```

### Get Trending News

**Endpoint:** `GET /news/articles/trending/`

**Response:** `200 OK`

```json
{
  "trending": [ ... ]
}
```

### Get News by Sentiment

**Endpoint:** `GET /news/articles/by_sentiment/?sentiment=positive`

**Query Parameters:**

- `sentiment`: positive, negative, or neutral

**Response:** `200 OK`

```json
{
  "sentiment": "positive",
  "results": [ ... ]
}
```

### Get News by Stock

**Endpoint:** `GET /news/articles/by_stock/?symbol=AAPL`

**Response:** `200 OK`

```json
{
  "symbol": "AAPL",
  "count": 15,
  "results": [ ... ]
}
```

### Get Market Sentiment

**Endpoint:** `GET /news/articles/market_sentiment/`

**Response:** `200 OK`

```json
{
  "overall_sentiment": "positive",
  "breakdown": {
    "positive": 45,
    "negative": 30,
    "neutral": 25,
    "total": 100
  },
  "average_impact_score": 65.5
}
```

## Portfolio Management

### Get Portfolio Overview

**Endpoint:** `GET /portfolio/overview/`

**Response:** `200 OK`

```json
{
  "id": 1,
  "total_value": 50000.0,
  "cash_available": 5000.0,
  "risk_score": 52.5,
  "holdings": [
    {
      "id": 1,
      "stock_symbol": "AAPL",
      "quantity": 100,
      "purchase_price": 150.0,
      "current_price": 155.0,
      "current_value": 15500.0,
      "initial_investment": 15000.0,
      "profit_loss": 500.0,
      "profit_loss_percent": 3.33,
      "purchase_date": "2024-01-15",
      "sector": "technology",
      "risk_rating": 5.5
    }
  ],
  "allocation": {
    "AAPL": { "amount": 15500.0, "percentage": 31.0 },
    "CASH": { "amount": 5000.0, "percentage": 10.0 }
  },
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-02-26T10:30:00Z"
}
```

### Add Stock Holding

**Endpoint:** `POST /portfolio/add_holding/`

**Request:**

```json
{
  "stock_symbol": "MSFT",
  "quantity": 50,
  "purchase_price": 380.0,
  "current_price": 385.0,
  "sector": "technology",
  "risk_rating": 4.5
}
```

**Response:** `201 Created`

```json
{
  "message": "Holding added successfully",
  "holding": { ... }
}
```

### Get All Holdings

**Endpoint:** `GET /portfolio/holdings/?sector=technology`

**Query Parameters:**

- `sector` (optional): Filter by sector

**Response:** `200 OK`

```json
{
  "count": 5,
  "results": [ ... ]
}
```

### Remove Holding

**Endpoint:** `DELETE /portfolio/remove_holding/?symbol=AAPL`

**Response:** `200 OK`

```json
{
  "message": "Holding removed successfully"
}
```

### Get Performance Metrics

**Endpoint:** `GET /portfolio/performance/`

**Response:** `200 OK`

```json
{
  "total_invested": 45000.00,
  "current_value": 47500.00,
  "total_profit_loss": 2500.00,
  "overall_return_percent": 5.56,
  "best_performer": { ... },
  "worst_performer": { ... },
  "number_of_holdings": 3
}
```

### Update Cash

**Endpoint:** `POST /portfolio/update_cash/`

**Request:**

```json
{
  "amount": 5000.0,
  "action": "set"
}
```

**Actions:**

- `set`: Set cash to amount
- `add`: Add amount to cash
- `subtract`: Subtract amount from cash

**Response:** `200 OK`

```json
{
  "message": "Cash updated successfully",
  "cash_available": 5000.0
}
```

### Get Sector Allocation

**Endpoint:** `GET /portfolio/allocation_by_sector/`

**Response:** `200 OK`

```json
{
  "total_value": 50000.0,
  "allocation_by_sector": {
    "Technology": { "value": 30000.0, "percentage": 60.0 },
    "Finance": { "value": 12000.0, "percentage": 24.0 },
    "Healthcare": { "value": 8000.0, "percentage": 16.0 }
  }
}
```

## AI Strategy Advisor

### Get AI Recommendation

**Endpoint:** `GET /advisor/get_recommendation/`

**Response:** `200 OK`

```json
{
  "recommendation": {
    "id": 1,
    "recommendation_type": "rebalance",
    "title": "Rebalance Your Portfolio",
    "description": "Your portfolio is overweight in certain sectors",
    "target_symbol": null,
    "target_price": null,
    "portfolio_analysis": { ... },
    "news_impact": { ... },
    "prediction_data": [ ... ],
    "reasoning": "Based on current market sentiment and your risk profile...",
    "confidence_score": 0.75,
    "risk_level": "medium",
    "action_items": [
      "Analyze sector allocation",
      "Consider reducing high-risk positions"
    ],
    "user_feedback": null,
    "outcome": null,
    "created_at": "2024-02-26T10:30:00Z",
    "updated_at": "2024-02-26T10:30:00Z"
  },
  "portfolio_snapshot": { ... },
  "market_snapshot": { ... }
}
```

### Get Recommendation History

**Endpoint:** `GET /advisor/recommendations_history/?page=1&page_size=10`

**Response:** `200 OK`

```json
{
  "count": 20,
  "page": 1,
  "page_size": 10,
  "results": [ ... ]
}
```

### Submit Feedback

**Endpoint:** `POST /advisor/feedback/`

**Request:**

```json
{
  "recommendation_id": 1,
  "feedback": "helpful",
  "outcome": "Successfully rebalanced portfolio"
}
```

**Feedback Types:**

- `helpful`
- `not_helpful`
- `neutral`

**Response:** `200 OK`

```json
{
  "message": "Feedback recorded successfully",
  "recommendation": { ... }
}
```

### Get Analysis Summary

**Endpoint:** `GET /advisor/analysis_summary/`

**Response:** `200 OK`

```json
{
  "portfolio_health": {
    "total_value": 50000.0,
    "risk_score": 52.5,
    "number_of_holdings": 3
  },
  "prediction_performance": {
    "total_predictions": 25,
    "correct_predictions": 18,
    "accuracy_percentage": 72.0
  },
  "advisor_performance": {
    "total_recommendations": 5,
    "helpful_recommendations": 4,
    "helpful_percentage": 80.0
  },
  "overall_health_score": 78.5
}
```

## Error Responses

### 400 Bad Request

```json
{
  "error": "Description of what went wrong"
}
```

### 401 Unauthorized

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### 403 Forbidden

```json
{
  "detail": "You do not have permission to perform this action."
}
```

### 404 Not Found

```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error"
}
```

## Rate Limiting

No rate limiting is currently implemented, but in production:

- API requests will be limited to 1000 requests/hour per user
- Bulk operations will have stricter limits

## Pagination

Default pagination: 20 items per page

**Query Parameters:**

- `page`: Page number (default: 1)
- `page_size`: Items per page (default: 20, max: 100)

## Filtering & Search

Most list endpoints support filtering via query parameters. See specific endpoint documentation for available filters.

## Status Codes

- `200 OK`: Successful GET/PUT/PATCH request
- `201 Created`: Successful POST request
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Authentication required
- `403 Forbidden`: Permission denied
- `404 Not Found`: Resource not found
- `500 Internal Server Error`: Server error

## Notes

- All timestamps are in UTC format (ISO 8601)
- Decimal numbers use standard decimal format (not scientific notation)
- Empty arrays are returned as `[]`, not null
- Pagination is 1-indexed (page 1 is the first page)
