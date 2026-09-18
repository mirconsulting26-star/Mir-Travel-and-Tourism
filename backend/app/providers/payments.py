import uuid
import json
from typing import Dict, Any, Optional
from app.providers.base import BasePaymentProvider
from app.schemas.domain import CheckoutRequest, CheckoutSessionResponse

class MockPaymentProvider(BasePaymentProvider):
    async def create_checkout_session(self, request: CheckoutRequest, order_id: str, total_amount: float) -> CheckoutSessionResponse:
        session_id = f"cs_demo_{uuid.uuid4().hex[:12]}"
        # Redirect to booking confirmation with mock session
        mock_payment_url = f"http://localhost:5173/checkout/confirmation?order_id={order_id}&session_id={session_id}&status=success"
        
        return CheckoutSessionResponse(
            order_id=order_id,
            payment_session_id=session_id,
            payment_url=mock_payment_url,
            total_amount=total_amount,
            currency="EUR"
        )

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> Optional[Dict[str, Any]]:
        try:
            data = json.loads(payload.decode('utf-8'))
            return data
        except Exception:
            return None


class StripeAdapter(BasePaymentProvider):
    def __init__(self, secret_key: str, webhook_secret: str):
        self.secret_key = secret_key
        self.webhook_secret = webhook_secret
        self.mock = MockPaymentProvider()

    async def create_checkout_session(self, request: CheckoutRequest, order_id: str, total_amount: float) -> CheckoutSessionResponse:
        if not self.secret_key:
            return await self.mock.create_checkout_session(request, order_id, total_amount)
        # Real Stripe SDK initialization & Session creation here
        return await self.mock.create_checkout_session(request, order_id, total_amount)

    async def verify_webhook_signature(self, payload: bytes, signature: str) -> Optional[Dict[str, Any]]:
        return await self.mock.verify_webhook_signature(payload, signature)
