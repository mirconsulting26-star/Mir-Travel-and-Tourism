from typing import List, Dict, Any
from app.schemas.domain import FlightDeskRequest, FlightOffer, FlightSearchQuery
from app.providers.flights import MockFlightProvider, BaseFlightProvider

class FlightDeskService:
    def __init__(self, flight_provider: BaseFlightProvider = None):
        self.flight_provider = flight_provider or MockFlightProvider()

    async def evaluate_and_rank_offers(self, request: FlightDeskRequest) -> List[FlightOffer]:
        # 1. Map FlightDeskRequest to FlightSearchQuery
        search_query = FlightSearchQuery(
            origin=request.origin,
            destination=request.destination,
            departure_date=request.departure_date,
            return_date=request.return_date,
            passengers=request.passengers,
            cabin_class=request.cabin_class,
            preferred_airlines=request.preferred_airlines,
            direct_only=request.max_stops == 0,
            max_price=request.budget_max
        )
        
        # 2. Search raw offers from provider
        offers = await self.flight_provider.search_flights(search_query)
        
        # 3. Apply Hard Filters
        filtered_offers: List[FlightOffer] = []
        for offer in offers:
            # Excluded airlines hard filter
            operating_airlines = {seg.airline_code for seg in offer.outbound_segments + offer.return_segments}
            if any(code in request.excluded_airlines for code in operating_airlines):
                continue
                
            # Max stops hard filter
            if request.max_stops is not None and offer.stops > request.max_stops:
                continue
                
            # Budget max hard filter
            if request.budget_max is not None and offer.price > request.budget_max:
                continue
                
            filtered_offers.append(offer)
            
        if not filtered_offers:
            filtered_offers = offers  # Fallback if hard filters removed all
            
        # 4. Calculate Explainable Score for each offer
        min_price = min((o.price for o in filtered_offers), default=1.0)
        min_duration = min((o.total_duration_minutes for o in filtered_offers), default=1)
        
        for offer in filtered_offers:
            explainable_reasons = []
            score = 100.0
            
            # Price Score (Max 40 points) - Closer to min_price = higher score
            price_ratio = min_price / max(offer.price, 1.0)
            price_pts = round(price_ratio * 40.0, 1)
            explainable_reasons.append(f"Price competitiveness: {price_pts}/40.0 pts (€{offer.price:.2f})")
            
            # Duration Score (Max 30 points) - Shorter duration = higher score
            dur_ratio = min_duration / max(offer.total_duration_minutes, 1)
            dur_pts = round(dur_ratio * 30.0, 1)
            explainable_reasons.append(f"Flight duration efficiency: {dur_pts}/30.0 pts ({offer.total_duration_minutes} mins)")
            
            # Stops Score (Max 15 points) - Direct flights get full score
            stops_pts = 15.0 if offer.stops == 0 else (7.5 if offer.stops == 1 else 0.0)
            explainable_reasons.append(f"Stops rating: {stops_pts}/15.0 pts ({offer.stops} stops)")
            
            # Preferred Airline Bonus (Max 10 points)
            op_airlines = {seg.airline_code for seg in offer.outbound_segments + offer.return_segments}
            is_pref = any(code in request.preferred_airlines for code in op_airlines)
            pref_pts = 10.0 if is_pref else 0.0
            if is_pref:
                explainable_reasons.append(f"Preferred airline bonus: +10.0 pts ({', '.join(op_airlines)})")
            else:
                explainable_reasons.append("Preferred airline bonus: 0.0 pts")
                
            # Baggage Match (Max 5 points)
            bag_pts = 5.0 if (not request.baggage_required or offer.baggage_included) else 0.0
            if offer.baggage_included:
                explainable_reasons.append("Baggage included: +5.0 pts")
            else:
                explainable_reasons.append("Baggage fee required: 0.0 pts")
                
            total_score = round(price_pts + dur_pts + stops_pts + pref_pts + bag_pts, 1)
            offer.score = total_score
            offer.explainable_reasons = explainable_reasons
            
        # 5. Sort by score descending and mark top shortlisted
        ranked_offers = sorted(filtered_offers, key=lambda x: x.score or 0, reverse=True)
        for idx, offer in enumerate(ranked_offers):
            if idx < 3:
                offer.is_shortlisted = True
                
        return ranked_offers
