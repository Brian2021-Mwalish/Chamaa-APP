from pathlib import Path
from uuid import uuid4

from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.conf import settings
from django.db import models
from django.utils import timezone

from .storage import PrivateFileSystemStorage


private_kyc_storage = PrivateFileSystemStorage()


def kyc_document_path(instance, filename):
    extension = Path(filename).suffix.lower()
    return f'kyc/{instance.user_id}/{uuid4().hex}{extension}'


class UserManager(BaseUserManager):
    def create_user(self, email, password=None, phone='', **extra_fields):
        if not email or not email.strip():
            raise ValueError('An email address is required.')

        email = self.normalize_email(email).lower()
        user = self.model(email=email, phone=phone.strip(), **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('A superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('A superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    PLAN_CHOICES = (
        ('starter', 'Starter'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    )
    PAYMENT_MODE_CHOICES = (
        ('manual', 'Manual processing'),
        ('direct_debit', 'Automatic direct debit'),
    )
    ONBOARDING_STAGES = (
        ('kyc', 'KYC'),
        ('plan', 'Plan selection'),
        ('membership', 'Membership'),
        ('waiting', 'Waiting room'),
        ('app', 'Application'),
    )

    phone = models.CharField(max_length=32, blank=True, default='')
    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True, null=True, unique=True)
    selected_plan = models.CharField(max_length=20, choices=PLAN_CHOICES, blank=True)
    payment_mode = models.CharField(
        max_length=12, choices=PAYMENT_MODE_CHOICES, default='manual'
    )
    phone_verified = models.BooleanField(default=False)
    onboarding_stage = models.CharField(
        max_length=16, choices=ONBOARDING_STAGES, default='kyc'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=('phone',), condition=~models.Q(phone=''), name='unique_nonempty_user_phone'
            ),
        ]

    def __str__(self):
        return self.email or self.phone


class KYCSubmission(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending review'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='kyc_submission',
    )
    full_name = models.CharField(max_length=150)
    id_document = models.FileField(
        storage=private_kyc_storage,
        upload_to=kyc_document_path,
    )
    income_document = models.FileField(
        storage=private_kyc_storage,
        upload_to=kyc_document_path,
    )
    status = models.CharField(
        max_length=16, choices=STATUS_CHOICES, default='pending'
    )
    submitted_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'KYC for {self.user.phone} ({self.status})'


