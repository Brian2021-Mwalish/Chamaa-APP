from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ('accounts', '0007_merge_circle_and_payment_mode'),
        ('groups', '0001_initial'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.DeleteModel(name='Circle'),
                migrations.DeleteModel(name='CircleMembership'),
                migrations.DeleteModel(name='Contribution'),
                migrations.DeleteModel(name='Payout'),
                migrations.DeleteModel(name='Donation'),
                migrations.DeleteModel(name='FoundationNomination'),
            ],
        ),
    ]