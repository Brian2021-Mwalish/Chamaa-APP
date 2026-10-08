import json
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from django.conf import settings


AFRICASTALKING_SMS_URL = 'https://api.africastalking.com/version1/messaging'


def send_otp_sms(phone, code):
    payload = {
        'username': settings.AFRICASTALKING_USERNAME,
        'to': phone,
        'message': f'Your Chama verification code is {code}. It expires in 3 minutes.',
    }
    if settings.AFRICASTALKING_SENDER_ID:
        payload['from'] = settings.AFRICASTALKING_SENDER_ID

    request = Request(
        AFRICASTALKING_SMS_URL,
        data=urlencode(payload).encode('utf-8'),
        headers={
            'apiKey': settings.AFRICASTALKING_API_KEY,
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method='POST',
    )
    with urlopen(request, timeout=10) as response:
        result = json.loads(response.read().decode('utf-8'))

    recipients = result.get('SMSMessageData', {}).get('Recipients', [])
    if not any(recipient.get('statusCode') == 101 for recipient in recipients):
        raise RuntimeError('SMS provider did not accept the message.')