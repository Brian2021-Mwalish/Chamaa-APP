from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_persist_selected_plan_and_repair_onboarding_columns'),
    ]

    operations = [
        migrations.RunSQL(
            sql=(
                'ALTER TABLE accounts_user '
                "ADD COLUMN IF NOT EXISTS selected_plan varchar(20) NOT NULL DEFAULT '';"
            ),
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]