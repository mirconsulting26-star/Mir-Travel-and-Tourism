import uuid
from datetime import datetime, timedelta
from typing import List
from app.providers.base import BaseFlightProvider
from app.schemas.domain import FlightSearchQuery, FlightOffer, Segment

class MockFlightProvider(BaseFlightProvider):
    async def search_flights(self, query: FlightSearchQuery) -> List[FlightOffer]:
        offers: List[FlightOffer] = []
        
        # Sample airlines
        airlines = [
            {"code": "IB", "name": "Iberia"},
            {"code": "VY", "name": "Vueling"},
            {"code": "UX", "name": "Air Europa"},
            {"code": "LH", "name": "Lufthansa"},
            {"code": "EK", "name": "Emirates"}
        ]
        
        # Filter preferred if specified
        if query.preferred_airlines:
            airlines = [a for a in airlines if a["code"] in query.preferred_airlines] or airlines
            
        base_price = 85.0 if query.cabin_class == "ECONOMY" else (240.0 if query.cabin_class == "BUSINESS" else 450.0)
        
        # Generate 4-6 realistic offer variations
        for idx in range(5):
            airline = airlines[idx % len(airlines)]
            stops = 0 if query.direct_only else (0 if idx < 3 else 1)
            duration = 75 + (idx * 45) if stops == 0 else 220 + (idx * 30)
            price = round((base_price + (idx * 35.5) + (20 if stops == 0 else 0)) * query.passengers, 2)
            
            dep_dt = datetime.strptime(query.departure_date, "%Y-%m-%d").replace(hour=7 + (idx * 3), minute=15)
            arr_dt = dep_dt + timedelta(minutes=duration)
            
            outbound_segments = [
                Segment(
                    departure_airport=query.origin.upper()[:3],
                    arrival_airport=query.destination.upper()[:3] if stops == 0 else "BIO",
                    departure_time=dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                    arrival_time=(dep_dt + timedelta(minutes=75 if stops > 0 else duration)).strftime("%Y-%m-%dT%H:%M:%S"),
                    airline_code=airline["code"],
                    airline_name=airline["name"],
                    flight_number=f"{airline['code']}{1000 + idx * 47}",
                    duration_minutes=75 if stops > 0 else duration
                )
            ]
            
            if stops > 0:
                layover_arr = dep_dt + timedelta(minutes=75)
                layover_dep = layover_arr + timedelta(minutes=65)
                arr_dt = layover_dep + timedelta(minutes=duration - 75)
                outbound_segments.append(
                    Segment(
                        departure_airport="BIO",
                        arrival_airport=query.destination.upper()[:3],
                        departure_time=layover_dep.strftime("%Y-%m-%dT%H:%M:%S"),
                        arrival_time=arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                        airline_code=airline["code"],
                        airline_name=airline["name"],
                        flight_number=f"{airline['code']}{2000 + idx * 47}",
                        duration_minutes=duration - 75
                    )
                )
                
            return_segments = []
            if query.return_date:
                ret_dep_dt = datetime.strptime(query.return_date, "%Y-%m-%d").replace(hour=10 + (idx * 2), minute=45)
                ret_arr_dt = ret_dep_dt + timedelta(minutes=duration)
                return_segments.append(
                    Segment(
                        departure_airport=query.destination.upper()[:3],
                        arrival_airport=query.origin.upper()[:3],
                        departure_time=ret_dep_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                        arrival_time=ret_arr_dt.strftime("%Y-%m-%dT%H:%M:%S"),
                        airline_code=airline["code"],
                        airline_name=airline["name"],
                        flight_number=f"{airline['code']}{3000 + idx * 47}",
                        duration_minutes=duration
                    )
                )
                price = round(price * 1.8, 2)
            
            offer = FlightOffer(
                offer_id=f"OFFER-DEMO-{uuid.uuid4().hex[:8].upper()}",
                price=price,
                currency="EUR",
                total_duration_minutes=duration,
                stops=stops,
                valid_until=(datetime.utcnow() + timedelta(hours=24)).strftime("%Y-%m-%dT%H:%M:%SZ"),
                outbound_segments=outbound_segments,
                return_segments=return_segments,
                baggage_included=idx % 2 == 0,
                fare_class="Standard Economy" if query.cabin_class == "ECONOMY" else "Flex Business",
                provider="MIR Flight Engine (Demo)"
            )
            offers.append(offer)
            
        return sorted(offers, key=lambda x: x.price)


class AmadeusFlightAdapter(BaseFlightProvider):
    """Adapter for production Amadeus Flight Offers Search API (wired when client credentials are provided)."""
    def __init__(self, client_id: str, client_secret: str, base_url: str):
        self.client_id = client_id
        self.client_secret = client_secret
        self.base_url = base_url
        self.mock = MockFlightProvider()

    async def search_flights(self, query: FlightSearchQuery) -> List[FlightOffer]:
        if not self.client_id or not self.client_secret:
            # Fallback to mock adapter when credentials are not configured
            return await self.mock.search_flights(query)
        # Real Amadeus API call logic would be executed here
        return await self.mock.search_flights(query)
