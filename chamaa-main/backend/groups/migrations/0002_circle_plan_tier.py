from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='circle',
            name='plan_tier',
            field=models.CharField(
                blank=True,
                choices=[
                    ('starter', 'Starter'),
                    ('standard', 'Standard'),
                    ('premium', 'Premium'),
                ],
                default='',
                max_length=20,
            ),
        ),
    ]