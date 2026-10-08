from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='phone_verified',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='onboarding_stage',
            field=models.CharField(
                choices=[
                    ('kyc', 'KYC'),
                    ('plan', 'Plan selection'),
                    ('membership', 'Membership'),
                    ('waiting', 'Waiting room'),
                    ('app', 'Application'),
                ],
                default='kyc',
                max_length=16,
            ),
        ),
    ]