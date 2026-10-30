import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ('accounts', '0007_merge_circle_and_payment_mode'),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[],
            state_operations=[
                migrations.CreateModel(
                    name='Circle',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('name', models.CharField(max_length=100)),
                        ('circle_type', models.CharField(choices=[('managed', 'Platform managed'), ('private', 'Friends and family')], max_length=12)),
                        ('visibility', models.CharField(choices=[('public', 'Public'), ('private', 'Private')], max_length=10)),
                        ('contribution_amount', models.PositiveIntegerField()),
                        ('cadence', models.CharField(choices=[('weekly', 'Weekly'), ('monthly', 'Monthly')], default='monthly', max_length=8)),
                        ('max_members', models.PositiveSmallIntegerField(default=5)),
                        ('membership_fee_percent', models.DecimalField(decimal_places=2, default=1.0, max_digits=4)),
                        ('security_buffer_months', models.PositiveSmallIntegerField(default=1)),
                        ('status', models.CharField(choices=[('forming', 'Forming'), ('active', 'Active'), ('completed', 'Completed'), ('paused', 'Paused')], default='forming', max_length=12)),
                        ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_circles', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={'db_table': 'accounts_circle', 'ordering': ('-created_at',)},
                ),
                migrations.CreateModel(
                    name='CircleMembership',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('rotation_order', models.PositiveSmallIntegerField(blank=True, null=True)),
                        ('auto_debit_opt_in', models.BooleanField(default=False)),
                        ('accepted_default_disclaimer', models.BooleanField(default=False)),
                        ('is_active', models.BooleanField(default=True)),
                        ('joined_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('circle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='memberships', to='groups.circle')),
                        ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='circle_memberships', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={
                        'db_table': 'accounts_circlemembership',
                        'ordering': ('rotation_order', 'joined_at'),
                        'constraints': [models.UniqueConstraint(fields=('circle', 'user'), name='unique_circle_member')],
                    },
                ),
                migrations.CreateModel(
                    name='Contribution',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('cycle_number', models.PositiveIntegerField()),
                        ('amount', models.PositiveIntegerField()),
                        ('status', models.CharField(choices=[('pending', 'Pending'), ('paid', 'Paid'), ('missed', 'Missed')], default='pending', max_length=10)),
                        ('payment_method', models.CharField(choices=[('manual', 'Manual'), ('direct_debit', 'Direct debit')], default='manual', max_length=12)),
                        ('payment_reference', models.CharField(blank=True, max_length=100)),
                        ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('paid_at', models.DateTimeField(blank=True, null=True)),
                        ('membership', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='contributions', to='groups.circlemembership')),
                    ],
                    options={
                        'db_table': 'accounts_contribution',
                        'ordering': ('-created_at',),
                        'constraints': [models.UniqueConstraint(fields=('membership', 'cycle_number'), name='unique_member_cycle_contribution')],
                    },
                ),
                migrations.CreateModel(
                    name='Payout',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('cycle_number', models.PositiveIntegerField()),
                        ('gross_amount', models.PositiveIntegerField()),
                        ('membership_fee_amount', models.PositiveIntegerField(default=0)),
                        ('security_buffer_amount', models.PositiveIntegerField(default=0)),
                        ('status', models.CharField(choices=[('queued', 'Queued'), ('processing', 'Processing'), ('paid', 'Paid')], default='queued', max_length=12)),
                        ('buffer_released_at', models.DateTimeField(blank=True, null=True)),
                        ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('paid_at', models.DateTimeField(blank=True, null=True)),
                        ('circle', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payouts', to='groups.circle')),
                        ('recipient', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='payouts', to='groups.circlemembership')),
                    ],
                    options={
                        'db_table': 'accounts_payout',
                        'ordering': ('cycle_number',),
                        'constraints': [models.UniqueConstraint(fields=('circle', 'cycle_number'), name='unique_circle_cycle_payout')],
                    },
                ),
                migrations.CreateModel(
                    name='Donation',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('amount', models.PositiveIntegerField()),
                        ('status', models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed')], default='pending', max_length=12)),
                        ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('confirmed_at', models.DateTimeField(blank=True, null=True)),
                        ('donor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='donations', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={'db_table': 'accounts_donation'},
                ),
                migrations.CreateModel(
                    name='FoundationNomination',
                    fields=[
                        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                        ('kind', models.CharField(choices=[('individual', 'Individual'), ('cause', 'Cause')], max_length=12)),
                        ('title', models.CharField(max_length=150)),
                        ('description', models.TextField(max_length=2000)),
                        ('location', models.CharField(blank=True, max_length=120)),
                        ('status', models.CharField(choices=[('pending', 'Pending review'), ('reviewing', 'Under review'), ('selected', 'Selected'), ('declined', 'Declined')], default='pending', max_length=12)),
                        ('created_at', models.DateTimeField(default=django.utils.timezone.now)),
                        ('nominated_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='foundation_nominations', to=settings.AUTH_USER_MODEL)),
                    ],
                    options={'db_table': 'accounts_foundationnomination'},
                ),
            ],
        ),
    ]