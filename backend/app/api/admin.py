import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from fastapi import APIRouter, HTTPException, Depends, status, UploadFile, File
from bson import ObjectId

from app.auth.router import get_current_user
from app.db.mongo import get_db
from app.schemas.domain import (
    UserResponse, FlightDeskRequest, FlightOffer, QuoteCreateRequest, QuoteResponse,
    TourCreate, TourResponse, TourDepartureCreate, TourDepartureResponse,
    DestinationCreate, DestinationResponse, AirlineCreate, AirlineResponse,
    HotelCreate, HotelResponse, BlogPostCreate, BlogPostResponse,
    EventCreate, EventResponse, CustomerCreate, CustomerResponse, AuditLogResponse
)
from app.services.flight_desk import FlightDeskService
from app.providers.media import MockMediaProvider

router = APIRouter(prefix="/admin", tags=["Admin Travel Desk & CMS"])
flight_desk_service = FlightDeskService()
media_provider = MockMediaProvider()

async def log_audit_action(user_email: str, action: str, resource: str, details: str):
    db = get_db()
    if db is not None:
        await db.audit_logs.insert_one({
            "user_email": user_email,
            "action": action,
            "resource": resource,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        })


# --- FLIGHT DESK ENGINE ---
@router.post("/flight-desk/evaluate", response_model=List[FlightOffer])
async def evaluate_flight_desk_request(
    request: FlightDeskRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    ranked_offers = await flight_desk_service.evaluate_and_rank_offers(request)
    await log_audit_action(current_user.email, "EVALUATE_FLIGHTS", "FLIGHT_DESK", f"Evaluated flights for {request.client_name} ({request.origin} -> {request.destination})")
    return ranked_offers


# --- QUOTES MANAGEMENT ---
@router.post("/quotes", response_model=QuoteResponse)
async def create_quote_snapshot(
    req: QuoteCreateRequest,
    current_user: UserResponse = Depends(get_current_user)
):
    ref = f"MIR-Q-{uuid.uuid4().hex[:6].upper()}"
    valid_until = (datetime.utcnow() + timedelta(days=7)).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    quote_doc = {
        "quote_reference": ref,
        "client_name": req.client_name,
        "client_email": req.client_email,
        "flight_offers": [offer.dict() for offer in req.flight_offers],
        "valid_until": valid_until,
        "status": "ACTIVE",
        "notes": req.notes,
        "created_by": current_user.email,
        "created_at": datetime.utcnow().isoformat()
    }
    
    db = get_db()
    if db is not None:
        res = await db.quotes.insert_one(quote_doc)
        quote_doc["id"] = str(res.inserted_id)
    else:
        quote_doc["id"] = f"quote_{uuid.uuid4().hex[:8]}"
        
    await log_audit_action(current_user.email, "CREATE_QUOTE", "QUOTE", f"Created quote {ref} for {req.client_email}")
    return quote_doc

@router.get("/quotes", response_model=List[QuoteResponse])
async def list_quotes(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.quotes.find().sort("created_at", -1)
        quotes = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            quotes.append(doc)
        return quotes
    return []


# --- AIRLINES CRUD ---
@router.get("/airlines", response_model=List[AirlineResponse])
async def list_airlines(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.airlines.find()
        airlines = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            airlines.append(doc)
        return airlines
    return []

@router.post("/airlines", response_model=AirlineResponse)
async def create_airline(
    req: AirlineCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.airlines.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"air_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "AIRLINE", f"Added airline {req.name} ({req.code})")
    return doc

@router.put("/airlines/{airline_id}", response_model=AirlineResponse)
async def update_airline(
    airline_id: str,
    req: AirlineCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    if db is not None:
        await db.airlines.update_one({"_id": ObjectId(airline_id)}, {"$set": doc})
        doc["id"] = airline_id
        doc["created_at"] = datetime.utcnow().isoformat()
        return doc
    doc["id"] = airline_id
    doc["created_at"] = datetime.utcnow().isoformat()
    return doc


# --- HOTELS CRUD ---
@router.get("/hotels", response_model=List[HotelResponse])
async def list_hotels(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.hotels.find()
        hotels = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            hotels.append(doc)
        return hotels
    return []

@router.post("/hotels", response_model=HotelResponse)
async def create_hotel(
    req: HotelCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.hotels.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"hotel_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "HOTEL", f"Added hotel {req.name}")
    return doc

@router.delete("/hotels/{hotel_id}")
async def delete_hotel(
    hotel_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    if db is not None:
        await db.hotels.delete_one({"_id": ObjectId(hotel_id)})
    await log_audit_action(current_user.email, "DELETE", "HOTEL", f"Deleted hotel {hotel_id}")
    return {"status": "deleted", "id": hotel_id}


# --- TOURS CRUD ---
@router.get("/tours", response_model=List[TourResponse])
async def list_admin_tours(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.tours.find()
        tours = []
        async for doc in cursor:
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
            tours.append(doc)
        return tours
    return []

@router.post("/tours", response_model=TourResponse)
async def create_tour(
    req: TourCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    departures_data = doc.pop("departures", [])
    doc["created_at"] = datetime.utcnow().isoformat()
    
    if db is not None:
        res = await db.tours.insert_one(doc)
        tour_id = str(res.inserted_id)
        
        seeded_deps = []
        for dep in departures_data:
            dep["tour_id"] = tour_id
            dep_res = await db.tour_departures.insert_one(dep)
            dep["id"] = str(dep_res.inserted_id)
            seeded_deps.append(dep)
            
        doc["id"] = tour_id
        doc["departures"] = seeded_deps
        await log_audit_action(current_user.email, "CREATE", "TOUR", f"Created tour {req.title}")
        return doc
        
    doc["id"] = f"tour_{uuid.uuid4().hex[:8]}"
    doc["departures"] = []
    return doc

@router.delete("/tours/{tour_id}")
async def delete_tour(
    tour_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    if db is not None:
        await db.tours.delete_one({"_id": ObjectId(tour_id)})
        await db.tour_departures.delete_many({"tour_id": tour_id})
    await log_audit_action(current_user.email, "DELETE", "TOUR", f"Deleted tour {tour_id}")
    return {"status": "deleted", "id": tour_id}


# --- DESTINATIONS CRUD ---
@router.get("/destinations", response_model=List[DestinationResponse])
async def list_admin_destinations(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.destinations.find()
        dests = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            dests.append(doc)
        return dests
    return []

@router.post("/destinations", response_model=DestinationResponse)
async def create_destination(
    req: DestinationCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.destinations.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"dest_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "DESTINATION", f"Created destination {req.name}")
    return doc

@router.delete("/destinations/{dest_id}")
async def delete_destination(
    dest_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    if db is not None:
        await db.destinations.delete_one({"_id": ObjectId(dest_id)})
    await log_audit_action(current_user.email, "DELETE", "DESTINATION", f"Deleted destination {dest_id}")
    return {"status": "deleted", "id": dest_id}


# --- EVENTS CMS ---
@router.get("/events", response_model=List[EventResponse])
async def list_admin_events(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.events.find()
        events = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            events.append(doc)
        return events
    return []

@router.post("/events", response_model=EventResponse)
async def create_event(
    req: EventCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.events.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"event_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "EVENT", f"Created event {req.title}")
    return doc

@router.delete("/events/{event_id}")
async def delete_event(
    event_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    if db is not None:
        await db.events.delete_one({"_id": ObjectId(event_id)})
    await log_audit_action(current_user.email, "DELETE", "EVENT", f"Deleted event {event_id}")
    return {"status": "deleted", "id": event_id}


# --- BLOG CMS ---
@router.get("/blog", response_model=List[BlogPostResponse])
async def list_admin_blog_posts(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.blog_posts.find().sort("created_at", -1)
        posts = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            posts.append(doc)
        return posts
    return []

@router.post("/blog", response_model=BlogPostResponse)
async def create_blog_post(
    req: BlogPostCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.blog_posts.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"post_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "BLOG", f"Created post {req.title}")
    return doc

@router.delete("/blog/{post_id}")
async def delete_blog_post(
    post_id: str,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    if db is not None:
        await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    await log_audit_action(current_user.email, "DELETE", "BLOG", f"Deleted blog post {post_id}")
    return {"status": "deleted", "id": post_id}


# --- BOOKINGS & ORDERS ---
@router.get("/bookings")
async def list_admin_bookings(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.orders.find().sort("created_at", -1)
        orders = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            orders.append(doc)
        return orders
    return []


# --- CUSTOMERS ---
@router.get("/customers", response_model=List[CustomerResponse])
async def list_admin_customers(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.customers.find().sort("created_at", -1)
        customers = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            customers.append(doc)
        return customers
    return []

@router.post("/customers", response_model=CustomerResponse)
async def create_customer(
    req: CustomerCreate,
    current_user: UserResponse = Depends(get_current_user)
):
    db = get_db()
    doc = req.dict()
    doc["created_at"] = datetime.utcnow().isoformat()
    if db is not None:
        res = await db.customers.insert_one(doc)
        doc["id"] = str(res.inserted_id)
    else:
        doc["id"] = f"cust_{uuid.uuid4().hex[:8]}"
    await log_audit_action(current_user.email, "CREATE", "CUSTOMER", f"Created customer profile {req.full_name}")
    return doc


# --- MEDIA LIBRARY & UPLOADER ---
@router.get("/media")
async def list_cms_media(current_user: UserResponse = Depends(get_current_user)):
    return [
        {
            "id": "med_1",
            "url": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
            "title": "Benidorm Beachfront Horizon",
            "format": "JPEG",
            "size": "420 KB",
            "created_at": "2026-09-28T10:00:00Z"
        },
        {
            "id": "med_2",
            "url": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
            "title": "Barcelona Gothic Quarter & Cathedral",
            "format": "JPEG",
            "size": "580 KB",
            "created_at": "2026-09-28T11:30:00Z"
        },
        {
            "id": "med_3",
            "url": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
            "title": "Benidorm Fest Concert Stage",
            "format": "JPEG",
            "size": "390 KB",
            "created_at": "2026-09-29T14:15:00Z"
        },
        {
            "id": "med_4",
            "url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
            "title": "Gran Hotel Sol y Mar Resort",
            "format": "JPEG",
            "size": "510 KB",
            "created_at": "2026-09-29T16:40:00Z"
        }
    ]

@router.post("/media/upload")
async def upload_cms_media(
    file: UploadFile = File(...),
    current_user: UserResponse = Depends(get_current_user)
):
    content = await file.read()
    upload_res = await media_provider.upload_image(content, file.filename or "upload.jpg")
    await log_audit_action(current_user.email, "UPLOAD_MEDIA", "MEDIA", f"Uploaded image {file.filename}")
    return upload_res


# --- AUDIT LOGS ---
@router.get("/audit-logs", response_model=List[AuditLogResponse])
async def get_audit_logs(current_user: UserResponse = Depends(get_current_user)):
    db = get_db()
    if db is not None:
        cursor = db.audit_logs.find().sort("timestamp", -1).limit(100)
        logs = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            logs.append(doc)
        return logs
    return []
