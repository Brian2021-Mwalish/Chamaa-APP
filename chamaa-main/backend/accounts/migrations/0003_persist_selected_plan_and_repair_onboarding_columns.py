from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_user_onboarding_and_phone_verification'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                'ALTER TABLE accounts_user '
                'ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false; '
                'ALTER TABLE accounts_user '
                "ADD COLUMN IF NOT EXISTS onboarding_stage varchar(16) NOT NULL DEFAULT 'kyc';"
            ),
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.AddField(
            model_name='user',
            name='selected_plan',
            field=models.CharField(
                blank=True,
                choices=[
                    ('starter', 'Starter'),
                    ('standard', 'Standard'),
                    ('premium', 'Premium'),
                ],
                max_length=20,
            ),
        ),
    ]