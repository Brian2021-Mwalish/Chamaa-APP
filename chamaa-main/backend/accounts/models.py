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
    def create_user(self, phone, password=None, **extra_fields):
        if not phone or not phone.strip():
            raise ValueError('A phone number is required.')

        user = self.model(phone=phone.strip(), **extra_fields)
        if password:
            user.set_password(password)
        else:
            user.set_unusable_password()
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('A superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('A superuser must have is_superuser=True.')

        return self.create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    PLAN_CHOICES = (
        ('starter', 'Starter'),
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    )
    ONBOARDING_STAGES = (
        ('kyc', 'KYC'),
        ('plan', 'Plan selection'),
        ('membership', 'Membership'),
        ('waiting', 'Waiting room'),
        ('app', 'Application'),
    )

    phone = models.CharField(max_length=32, unique=True)
    name = models.CharField(max_length=150, blank=True)
    email = models.EmailField(blank=True)
    selected_plan = models.CharField(max_length=20, choices=PLAN_CHOICES, blank=True)
    phone_verified = models.BooleanField(default=False)
    onboarding_stage = models.CharField(
        max_length=16, choices=ONBOARDING_STAGES, default='kyc'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = 'phone'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.phone


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