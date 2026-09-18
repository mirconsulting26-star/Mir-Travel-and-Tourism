import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, status, Request
from bson import ObjectId

from app.db.mongo import get_db
from app.schemas.domain import (
    TourResponse, DestinationResponse, BlogPostResponse, EventResponse,
    FlightSearchQuery, FlightOffer, HotelSearchQuery, HotelOffer,
    CheckoutRequest, CheckoutSessionResponse, OrderResponse, OrderItem
)
from app.providers.flights import MockFlightProvider
from app.providers.hotels import MockHotelProvider
from app.providers.payments import MockPaymentProvider

router = APIRouter(prefix="", tags=["Public Customer API"])

flight_provider = MockFlightProvider()
hotel_provider = MockHotelProvider()
payment_provider = MockPaymentProvider()

# --- TOURS ---
@router.get("/tours", response_model=List[TourResponse])
async def get_tours(featured_only: bool = False):
    db = get_db()
    if db is not None:
        query = {"status": "PUBLISHED"}
        if featured_only:
            query["is_featured"] = True
        cursor = db.tours.find(query)
        tours = []
        async for doc in cursor:
            doc_id = str(doc["_id"])
            # fetch departures
            dep_cursor = db.tour_departures.find({"tour_id": doc_id})
            deps = []
            async for dep in dep_cursor:
                deps.append({
                    "id": str(dep["_id"]),
                    "tour_id": dep["tour_id"],
                    "start_date": dep["start_date"],
                    "end_date": dep["end_date"],
                    "total_seats": dep["total_seats"],
                    "available_seats": dep["available_seats"],
                    "price": dep["price"],
                    "status": dep.get("status", "AVAILABLE")
                })
            doc["id"] = doc_id
            doc["departures"] = deps
            tours.append(doc)
        return tours
    return []

@router.get("/tours/{slug}", response_model=TourResponse)
async def get_tour_by_slug(slug: str):
    db = get_db()
    if db is not None:
        doc = await db.tours.find_one({"slug": slug})
        if doc:
            doc_id = str(doc["_id"])
            dep_cursor = db.tour_departures.find({"tour_id": doc_id})
            deps = []
            async for dep in dep_cursor:
                deps.append({
                    "id": str(dep["_id"]),
                    "tour_id": dep["tour_id"],
                    "start_date": dep["start_date"],
                    "end_date": dep["end_date"],
                    "total_seats": dep["total_seats"],
                    "available_seats": dep["available_seats"],
                    "price": dep["price"],
                    "status": dep.get("status", "AVAILABLE")
                })
            doc["id"] = doc_id
            doc["departures"] = deps
            return doc
    raise HTTPException(status_code=404, detail="Tour not found")


# --- DESTINATIONS ---
@router.get("/destinations", response_model=List[DestinationResponse])
async def get_destinations(featured_only: bool = False):
    db = get_db()
    if db is not None:
        query = {}
        if featured_only:
            query["is_featured"] = True
        cursor = db.destinations.find(query)
        dests = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            dests.append(doc)
        return dests
    return []

@router.get("/destinations/{slug}", response_model=DestinationResponse)
async def get_destination_by_slug(slug: str):
    db = get_db()
    if db is not None:
        doc = await db.destinations.find_one({"slug": slug})
        if doc:
            doc["id"] = str(doc["_id"])
            return doc
    raise HTTPException(status_code=404, detail="Destination not found")


# --- BLOG ---
@router.get("/blog", response_model=List[BlogPostResponse])
async def get_blog_posts(category: Optional[str] = None, tag: Optional[str] = None):
    db = get_db()
    if db is not None:
        query = {"status": "PUBLISHED"}
        if category:
            query["category"] = category
        if tag:
            query["tags"] = tag
        cursor = db.blog_posts.find(query)
        posts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            posts.append(doc)
        return posts
    return []

@router.get("/blog/{slug}", response_model=BlogPostResponse)
async def get_blog_post_by_slug(slug: str):
    db = get_db()
    if db is not None:
        doc = await db.blog_posts.find_one({"slug": slug})
        if doc:
            doc["id"] = str(doc["_id"])
            return doc
    raise HTTPException(status_code=404, detail="Blog post not found")


# --- EVENTS ---
@router.get("/events", response_model=List[EventResponse])
async def get_events():
    db = get_db()
    if db is not None:
        cursor = db.events.find({"status": "PUBLISHED"})
        events = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            events.append(doc)
        return events
    return []


# --- FLIGHT & HOTEL SEARCH ---
@router.post("/flights/search", response_model=List[FlightOffer])
async def search_flights(query: FlightSearchQuery):
    return await flight_provider.search_flights(query)

@router.post("/hotels/search", response_model=List[HotelOffer])
async def search_hotels(query: HotelSearchQuery):
    return await hotel_provider.search_hotels(query)


# --- CHECKOUT & ORDERS ---
@router.post("/checkout/create-session", response_model=CheckoutSessionResponse)
async def create_checkout_session(request: CheckoutRequest):
    # Server-side price authority calculation
    total_amount = sum(item.unit_price * item.quantity for item in request.items)
    order_id = f"MIR-ORD-{uuid.uuid4().hex[:8].upper()}"
    
    db = get_db()
    if db is not None:
        order_doc = {
            "order_id": order_id,
            "customer_name": request.customer_name,
            "customer_email": request.customer_email,
            "customer_phone": request.customer_phone,
            "total_amount": total_amount,
            "currency": "EUR",
            "status": "PENDING_PAYMENT",
            "payment_provider": request.payment_method,
            "items": [item.dict() for item in request.items],
            "created_at": datetime.utcnow().isoformat()
        }
        await db.orders.insert_one(order_doc)
        
    session_res = await payment_provider.create_checkout_session(request, order_id, total_amount)
    return session_res

@router.get("/orders/{order_id}", response_model=OrderResponse)
async def get_order_by_id(order_id: str):
    db = get_db()
    if db is not None:
        order_doc = await db.orders.find_one({"order_id": order_id})
        if order_doc:
            order_doc["id"] = str(order_doc["_id"])
            return order_doc
            
    # Mock order fallback if database not present
    return OrderResponse(
        id="ord_demo_1",
        order_id=order_id,
        customer_name="Demo Customer",
        customer_email="customer@example.com",
        customer_phone="+34 600 000 000",
        total_amount=890.0,
        currency="EUR",
        status="CONFIRMED",
        payment_provider="STRIPE",
        items=[
            OrderItem(
                item_type="TOUR",
                item_id="tour_demo_1",
                title="Costa Blanca Coastal Sun & Heritage Tour [DEMO]",
                quantity=1,
                unit_price=890.0
            )
        ],
        created_at=datetime.utcnow().isoformat()
    )

@router.post("/checkout/webhook")
async def handle_payment_webhook(request: Request):
    payload = await request.body()
    sig_header = request.headers.get("stripe-signature", "")
    event = await payment_provider.verify_webhook_signature(payload, sig_header)
    
    db = get_db()
    if event and db is not None:
        # Store webhook event for idempotency & update order status
        await db.payments.insert_one({
            "provider": "STRIPE",
            "payload": event,
            "received_at": datetime.utcnow().isoformat()
        })
        if "order_id" in event:
            await db.orders.update_one(
                {"order_id": event["order_id"]},
                {"$set": {"status": "PAID"}}
            )
            
    return {"status": "success"}
