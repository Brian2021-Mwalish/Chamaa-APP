from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0005_kycsubmission'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='payment_mode',
            field=models.CharField(
                choices=[
                    ('manual', 'Manual processing'),
                    ('direct_debit', 'Automatic direct debit'),
                ],
                default='manual',
                max_length=12,
            ),
        ),
    ]