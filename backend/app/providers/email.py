import logging
from app.providers.base import BaseEmailProvider

logger = logging.getLogger(__name__)

class MockEmailProvider(BaseEmailProvider):
    async def send_email(self, to_email: str, subject: str, body_html: str) -> bool:
        logger.info(f"[MOCK EMAIL] Sent to: {to_email} | Subject: {subject}")
        return True

class BrevoAdapter(BaseEmailProvider):
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.mock = MockEmailProvider()

    async def send_email(self, to_email: str, subject: str, body_html: str) -> bool:
        if not self.api_key:
            return await self.mock.send_email(to_email, subject, body_html)
        return await self.mock.send_email(to_email, subject, body_html)
