from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='PredictionGame',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=10)),
                ('user_prediction', models.CharField(choices=[('UP', 'Price will go UP'), ('DOWN', 'Price will go DOWN')], max_length=10)),
                ('ai_prediction', models.CharField(choices=[('UP', 'Price will go UP'), ('DOWN', 'Price will go DOWN')], max_length=10)),
                ('ai_confidence', models.FloatField()),
                ('actual_result', models.CharField(blank=True, choices=[('UP', 'Price will go UP'), ('DOWN', 'Price will go DOWN')], max_length=10, null=True)),
                ('user_correct', models.BooleanField(blank=True, null=True)),
                ('ai_correct', models.BooleanField(blank=True, null=True)),
                ('explanation', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('resolved_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='prediction_games', to='authentication.user')),
            ],
            options={
                'verbose_name': 'Prediction Game',
                'verbose_name_plural': 'Prediction Games',
                'ordering': ['-created_at'],
            },
        ),
        migrations.CreateModel(
            name='PaperTradingSession',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ticker', models.CharField(max_length=10)),
                ('initial_capital', models.DecimalField(decimal_places=2, max_digits=12)),
                ('final_value', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('profit_loss', models.DecimalField(blank=True, decimal_places=2, max_digits=12, null=True)),
                ('return_percentage', models.FloatField(blank=True, null=True)),
                ('total_trades', models.IntegerField(blank=True, null=True)),
                ('trades', models.JSONField(blank=True, default=list)),
                ('started_at', models.DateTimeField(auto_now_add=True)),
                ('completed_at', models.DateTimeField(blank=True, null=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='paper_trading_sessions', to='authentication.user')),
            ],
            options={
                'verbose_name': 'Paper Trading Session',
                'verbose_name_plural': 'Paper Trading Sessions',
                'ordering': ['-started_at'],
            },
        ),
        migrations.CreateModel(
            name='UserStats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_predictions', models.IntegerField(default=0)),
                ('correct_predictions', models.IntegerField(default=0)),
                ('ai_correct_predictions', models.IntegerField(default=0)),
                ('accuracy', models.FloatField(default=0.0)),
                ('total_trading_profit', models.DecimalField(decimal_places=2, default=0, max_digits=12)),
                ('best_trade_return', models.FloatField(default=0.0)),
                ('total_paper_trading_sessions', models.IntegerField(default=0)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='playground_stats', to='authentication.user')),
            ],
        ),
    ]
