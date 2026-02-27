import random
from datetime import datetime, timedelta


class MockNewsProvider:
    """Mock financial news provider for development"""
    
    news_templates = [
        {
            'title': '{stock} Surges {percent}% on Strong Earnings Report',
            'description': '{stock} reported better-than-expected Q4 earnings with revenue growth of {percent}% YoY. {sentiment_text}',
            'sentiment': 'positive',
            'impact_score': 85,
            'category': 'earnings',
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'TSLA']
        },
        {
            'title': '{stock} Faces Regulatory Scrutiny Over Data Privacy',
            'description': 'Regulators launched an investigation into {stock}\'s data handling practices. The company faces potential fines and operational restrictions.',
            'sentiment': 'negative',
            'impact_score': 72,
            'category': 'regulation',
            'stocks': ['META', 'GOOGL', 'AMZN']
        },
        {
            'title': '{stock} Announces Major Product Launch',
            'description': '{stock} unveiled its latest innovation which is expected to capture significant market share. Analysts are bullish on this development.',
            'sentiment': 'positive',
            'impact_score': 78,
            'category': 'product',
            'stocks': ['AAPL', 'MSFT', 'NVDA', 'TSLA']
        },
        {
            'title': 'Tech Sector Rallies on AI Optimism',
            'description': 'Major technology companies saw significant gains as investors bet on artificial intelligence growth. {stock} led the charge with gains exceeding {percent}%.',
            'sentiment': 'positive',
            'impact_score': 75,
            'category': 'market',
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'NVDA', 'META']
        },
        {
            'title': '{stock} Stock Falls on Disappointing Guidance',
            'description': 'The company lowered its forward guidance citing weaker demand. Investors quickly sold off shares in trading after the announcement.',
            'sentiment': 'negative',
            'impact_score': 68,
            'category': 'earnings',
            'stocks': ['TSLA', 'META', 'NFLX']
        },
        {
            'title': '{stock} Acquires {target} in Major Deal',
            'description': '{stock} announced the acquisition of {target} in an all-cash deal valued at ${amount} billion. The move strengthens the company\'s {category} capabilities.',
            'sentiment': 'positive',
            'impact_score': 82,
            'category': 'acquisition',
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META']
        },
        {
            'title': 'Market Volatility Continues Amid Economic Uncertainty',
            'description': 'Tech stocks experienced significant volatility as investors digest mixed economic signals. {stock} was among the hardest-hit securities.',
            'sentiment': 'negative',
            'impact_score': 65,
            'category': 'market',
            'stocks': ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'META', 'NVDA']
        },
        {
            'title': '{stock} Expands into {market} Market',
            'description': '{stock} announced expansion plans into the {market} market, a move expected to unlock new growth opportunities. Analysts see this as a positive development.',
            'sentiment': 'positive',
            'impact_score': 71,
            'category': 'product',
            'stocks': ['AAPL', 'TSLA', 'AMZN']
        },
    ]
    
    sentiment_texts = {
        'positive': 'This is seen as a major positive catalyst for the stock.',
        'negative': 'Analysts express concerns about the potential impact on future performance.',
        'neutral': 'The market reaction remains mixed as investors assess the implications.'
    }
    
    sources = ['Bloomberg', 'Reuters', 'MarketWatch', 'CNBC', 'Yahoo Finance', 'TechCrunch']
    
    @classmethod
    def fetch_news(cls, limit=20):
        """Generate mock news articles"""
        articles = []
        for i in range(limit):
            template = random.choice(cls.news_templates)
            stocks = template['stocks']
            stock = random.choice(stocks)
            
            # Generate variations in sentiment
            sentiment = template['sentiment']
            if random.random() < 0.3:  # 30% chance to flip sentiment
                sentiment = 'negative' if sentiment == 'positive' else 'positive'
            
            # Create article
            title = template['title'].format(
                stock=stock,
                percent=random.randint(2, 15),
                market=random.choice(['Asian', 'European', 'Middle Eastern']),
                target=random.choice(['TechCorp', 'DataSystems', 'CloudServices']),
                amount=random.randint(2, 50)
            )
            
            related_stocks = ','.join(random.sample(stocks, k=min(3, len(stocks))))
            
            # Add some randomness to impact score
            impact_score = template['impact_score'] + random.randint(-10, 10)
            impact_score = max(20, min(100, impact_score))
            
            sentiment_score = random.uniform(0.6, 0.95) if sentiment == 'positive' else random.uniform(0.05, 0.4)
            
            # Date variation (last 7 days)
            days_ago = random.randint(0, 7)
            published_at = datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 23))
            
            article = {
                'title': title,
                'description': template['description'].format(
                    stock=stock,
                    sentiment_text=cls.sentiment_texts[sentiment],
                    percent=random.randint(5, 20),
                    category=template['category'],
                    amount=random.randint(2, 50),
                    market=random.choice(['Asian', 'European', 'Middle Eastern']),
                    target=random.choice(['TechCorp', 'DataSystems', 'CloudServices'])
                ),
                'source': random.choice(cls.sources),
                'url': f'https://example.com/news/{i}',
                'image_url': f'https://via.placeholder.com/400x200?text={stock}+News',
                'related_stocks': related_stocks,
                'sentiment': sentiment,
                'sentiment_score': sentiment_score,
                'impact_score': impact_score,
                'impact_category': template['category'],
                'published_at': published_at.isoformat(),
            }
            articles.append(article)
        
        # Sort by impact score (trending first)
        articles.sort(key=lambda x: x['impact_score'], reverse=True)
        return articles
    
    @classmethod
    def get_news_by_sentiment(cls, sentiment, limit=20):
        """Get news filtered by sentiment"""
        articles = cls.fetch_news(limit * 2)
        return [a for a in articles if a['sentiment'] == sentiment][:limit]
    
    @classmethod
    def get_trending_news(cls, limit=10):
        """Get top trending news (by impact score)"""
        articles = cls.fetch_news(limit * 3)
        return articles[:limit]
    
    @classmethod
    def get_news_by_stock(cls, symbol, limit=10):
        """Get news related to a specific stock"""
        articles = cls.fetch_news(limit * 3)
        symbol = symbol.upper()
        return [a for a in articles if symbol in a['related_stocks']][:limit]
    
    @classmethod
    def calculate_market_sentiment(cls, limit=50):
        """Calculate overall market sentiment"""
        articles = cls.fetch_news(limit)
        
        positive = sum(1 for a in articles if a['sentiment'] == 'positive')
        negative = sum(1 for a in articles if a['sentiment'] == 'negative')
        neutral = sum(1 for a in articles if a['sentiment'] == 'neutral')
        
        total = len(articles)
        
        # Determine overall sentiment
        if positive > negative and positive > neutral:
            overall = 'positive'
        elif negative > positive and negative > neutral:
            overall = 'negative'
        else:
            overall = 'neutral'
        
        # Calculate average score
        avg_score = sum(a['sentiment_score'] for a in articles) / total if total > 0 else 0.5
        
        return {
            'overall_sentiment': overall,
            'overall_score': round(avg_score, 2),
            'breakdown': {
                'positive': positive,
                'negative': negative,
                'neutral': neutral,
                'total': total,
            },
            'total_articles': total,
        }
