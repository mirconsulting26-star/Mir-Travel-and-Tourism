import pytest
from app.services.flight_desk import FlightDeskService
from app.schemas.domain import FlightDeskRequest, FlightOffer
from app.providers.flights import MockFlightProvider
from app.core.security import hash_password, verify_password, create_access_token, decode_access_token

def test_password_hashing():
    raw_pass = "SecurePass123!"
    hashed = hash_password(raw_pass)
    assert verify_password(raw_pass, hashed)
    assert not verify_password("WrongPass", hashed)

def test_jwt_token():
    token = create_access_token({"sub": "admin@mirtravel.es", "role": "SUPER_ADMIN"})
    decoded = decode_access_token(token)
    assert decoded is not None
    assert decoded["sub"] == "admin@mirtravel.es"
    assert decoded["role"] == "SUPER_ADMIN"

@pytest.mark.asyncio
async def test_flight_desk_explainable_ranking():
    service = FlightDeskService(MockFlightProvider())
    req = FlightDeskRequest(
        client_name="John Doe",
        client_email="john@example.com",
        origin="MAD",
        destination="BCN",
        departure_date="2026-10-15",
        passengers=1,
        preferred_airlines=["IB"],
        baggage_required=True
    )
    ranked = await service.evaluate_and_rank_offers(req)
    assert len(ranked) > 0
    top_offer = ranked[0]
    assert top_offer.score > 0
    assert len(top_offer.explainable_reasons) > 0
    assert top_offer.is_shortlisted is True
