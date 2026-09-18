import uuid
from typing import List
from app.providers.base import BaseHotelProvider
from app.schemas.domain import HotelSearchQuery, HotelOffer

class MockHotelProvider(BaseHotelProvider):
    async def search_hotels(self, query: HotelSearchQuery) -> List[HotelOffer]:
        hotels: List[HotelOffer] = []
        dest = query.destination.capitalize()
        
        sample_hotels = [
            {
                "name": f"Grand Hotel & Spa {dest}",
                "stars": 5,
                "rating": 9.2,
                "address": f"Avenida Principal 42, {dest}",
                "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
                "price_per_night": 165.0,
                "room_type": "Deluxe Sea View Room",
                "policy": "Free Cancellation up to 48 hours before check-in",
                "amenities": ["Pool", "Spa", "Free WiFi", "Breakfast Included", "Air Conditioning", "Beachfront"]
            },
            {
                "name": f"Mediterranean Palace {dest}",
                "stars": 4,
                "rating": 8.7,
                "address": f"Paseo Marítimo 18, {dest}",
                "image_url": "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                "price_per_night": 115.0,
                "room_type": "Standard Double Room",
                "policy": "Free Cancellation up to 24 hours before check-in",
                "amenities": ["Outdoor Pool", "Free WiFi", "Restaurant", "Bar", "Fitness Center"]
            },
            {
                "name": f"{dest} Boutique Suites",
                "stars": 4,
                "rating": 9.0,
                "address": f"Calle Mayor 12, {dest}",
                "image_url": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
                "price_per_night": 135.0,
                "room_type": "Executive Suite",
                "policy": "Non-refundable (Special Rate)",
                "amenities": ["City Center", "Boutique Design", "Free High-Speed WiFi", "Rooftop Terrace"]
            },
            {
                "name": f"Sun & Beach Resort {dest}",
                "stars": 3,
                "rating": 8.2,
                "address": f"Playa Sol 5, {dest}",
                "image_url": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
                "price_per_night": 82.0,
                "room_type": "Twin Room with Balcony",
                "policy": "Free Cancellation up to 3 days before check-in",
                "amenities": ["Pool", "Close to Beach", "Family Friendly", "Parking"]
            }
        ]
        
        # Filter stars if min_stars is set
        if query.min_stars:
            sample_hotels = [h for h in sample_hotels if h["stars"] >= query.min_stars]
            
        for h in sample_hotels:
            offer = HotelOffer(
                hotel_id=f"HOTEL-{uuid.uuid4().hex[:8].upper()}",
                name=h["name"],
                destination=dest,
                stars=h["stars"],
                rating=h["rating"],
                address=h["address"],
                image_url=h["image_url"],
                price_per_night=h["price_per_night"],
                total_price=round(h["price_per_night"] * 3, 2),  # Assuming 3 nights sample
                currency="EUR",
                room_type=h["room_type"],
                cancellation_policy=h["policy"],
                amenities=h["amenities"],
                provider="MIR Hotel Engine (Demo)"
            )
            hotels.append(offer)
            
        return sorted(hotels, key=lambda x: x.price_per_night)


class AmadeusHotelAdapter(BaseHotelProvider):
    def __init__(self, client_id: str, client_secret: str):
        self.mock = MockHotelProvider()

    async def search_hotels(self, query: HotelSearchQuery) -> List[HotelOffer]:
        return await self.mock.search_hotels(query)
