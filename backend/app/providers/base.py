from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from app.schemas.domain import FlightSearchQuery, FlightOffer, HotelSearchQuery, HotelOffer, CheckoutRequest, CheckoutSessionResponse

class BaseFlightProvider(ABC):
    @abstractmethod
    async def search_flights(self, query: FlightSearchQuery) -> List[FlightOffer]:
        pass

class BaseHotelProvider(ABC):
    @abstractmethod
    async def search_hotels(self, query: HotelSearchQuery) -> List[HotelOffer]:
        pass

class BasePaymentProvider(ABC):
    @abstractmethod
    async def create_checkout_session(self, request: CheckoutRequest, order_id: str, total_amount: float) -> CheckoutSessionResponse:
        pass
    
    @abstractmethod
    async def verify_webhook_signature(self, payload: bytes, signature: str) -> Optional[Dict[str, Any]]:
        pass

class BaseMediaProvider(ABC):
    @abstractmethod
    async def upload_image(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        pass

class BaseEmailProvider(ABC):
    @abstractmethod
    async def send_email(self, to_email: str, subject: str, body_html: str) -> bool:
        pass
