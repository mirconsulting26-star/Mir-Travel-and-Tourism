from datetime import datetime
from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field, EmailStr

# --- AUTH & USER SCHEMAS ---
class UserRole:
    SUPER_ADMIN = "SUPER_ADMIN"
    STAFF = "STAFF"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: str = UserRole.STAFF
    is_active: bool = True

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    created_at: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# --- CUSTOMER SCHEMA ---
class CustomerBase(BaseModel):
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    passport_number: Optional[str] = None
    notes: Optional[str] = None

class CustomerCreate(CustomerBase):
    pass

class CustomerResponse(CustomerBase):
    id: str
    created_at: str


# --- AIRLINE SCHEMA ---
class AirlineBase(BaseModel):
    code: str  # e.g., IB, VY, LH, EK
    name: str
    logo_url: Optional[str] = None
    is_active: bool = True
    is_preferred: bool = False
    is_featured: bool = False
    notes: Optional[str] = None

class AirlineCreate(AirlineBase):
    pass

class AirlineResponse(AirlineBase):
    id: str
    created_at: str


# --- HOTEL SCHEMA ---
class HotelBase(BaseModel):
    name: str
    destination: str
    stars: int = Field(default=4, ge=1, le=5)
    rating: float = Field(default=8.5, ge=0, le=10)
    address: Optional[str] = None
    amenities: List[str] = []
    images: List[str] = []
    is_active: bool = True
    is_preferred: bool = False
    is_featured: bool = False
    notes: Optional[str] = None

class HotelCreate(HotelBase):
    pass

class HotelResponse(HotelBase):
    id: str
    created_at: str


# --- DESTINATION SCHEMA ---
class DestinationBase(BaseModel):
    name: str
    slug: str
    country: str
    region: Optional[str] = None
    summary: str
    description: str
    hero_image: Optional[str] = None
    gallery: List[str] = []
    highlights: List[str] = []
    practical_info: Dict[str, str] = {}
    is_featured: bool = False

class DestinationCreate(DestinationBase):
    pass

class DestinationResponse(DestinationBase):
    id: str
    created_at: str


# --- TOUR & DEPARTURE SCHEMAS ---
class TourDepartureBase(BaseModel):
    tour_id: str
    start_date: str
    end_date: str
    total_seats: int
    available_seats: int
    price: float
    status: str = "AVAILABLE"  # AVAILABLE, FULL, CANCELLED

class TourDepartureCreate(TourDepartureBase):
    pass

class TourDepartureResponse(TourDepartureBase):
    id: str

class ItineraryItem(BaseModel):
    day: int
    title: str
    description: str

class TourBase(BaseModel):
    title: str
    slug: str
    summary: str
    description: str
    destination: str
    duration_days: int
    price_from: float
    deposit_amount: float = 100.0
    inclusions: List[str] = []
    exclusions: List[str] = []
    gallery: List[str] = []
    faqs: List[Dict[str, str]] = []
    itinerary: List[ItineraryItem] = []
    status: str = "PUBLISHED"  # DRAFT, PUBLISHED, ARCHIVED
    is_featured: bool = False

class TourCreate(TourBase):
    departures: List[TourDepartureCreate] = []

class TourResponse(TourBase):
    id: str
    departures: List[TourDepartureResponse] = []
    created_at: str


# --- BLOG POST & RICH EDITOR SCHEMAS ---
class BlogBlock(BaseModel):
    id: str
    type: str  # heading, paragraph, rich_text, image, gallery, quote, callout, video, map, itinerary, faq, table, cta
    content: Any  # Flexible JSON payload per block type

class BlogPostBase(BaseModel):
    title: str
    slug: str
    excerpt: str
    category: str
    tags: List[str] = []
    cover_image: Optional[str] = None
    gallery: List[str] = []
    blocks: List[BlogBlock] = []
    author: str = "MIR Travel Team"
    status: str = "PUBLISHED"  # DRAFT, PUBLISHED, ARCHIVED
    publish_at: Optional[str] = None
    is_featured: bool = False
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None

class BlogPostCreate(BlogPostBase):
    pass

class BlogPostResponse(BlogPostBase):
    id: str
    created_at: str


# --- EVENT SCHEMA ---
class EventBase(BaseModel):
    title: str
    slug: str
    summary: str
    description: str
    location: str
    event_date: str
    cover_image: Optional[str] = None
    gallery: List[str] = []
    status: str = "PUBLISHED"
    is_featured: bool = False

class EventCreate(EventBase):
    pass

class EventResponse(EventBase):
    id: str
    created_at: str


# --- FLIGHT & FLIGHT DESK SCHEMAS ---
class FlightSearchQuery(BaseModel):
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "ECONOMY"  # ECONOMY, PREMIUM_ECONOMY, BUSINESS, FIRST
    preferred_airlines: List[str] = []
    direct_only: bool = False
    max_price: Optional[float] = None

class Segment(BaseModel):
    departure_airport: str
    arrival_airport: str
    departure_time: str
    arrival_time: str
    airline_code: str
    airline_name: str
    flight_number: str
    duration_minutes: int
    aircraft: Optional[str] = "Boeing 737 / Airbus A320"

class FlightOffer(BaseModel):
    offer_id: str
    price: float
    currency: str = "EUR"
    total_duration_minutes: int
    stops: int
    valid_until: str
    outbound_segments: List[Segment]
    return_segments: List[Segment] = []
    baggage_included: bool = True
    fare_class: str = "Standard Economy"
    provider: str = "MIR Demo Engine"
    
    # Flight Desk Ranking Fields
    score: Optional[float] = 0.0
    explainable_reasons: List[str] = []
    is_shortlisted: Optional[bool] = False

class FlightDeskRequest(BaseModel):
    client_name: str
    client_email: EmailStr
    client_phone: Optional[str] = None
    origin: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "ECONOMY"
    flexibility_days: int = 0
    budget_max: Optional[float] = None
    preferred_airlines: List[str] = []
    excluded_airlines: List[str] = []
    max_stops: Optional[int] = None
    baggage_required: bool = True
    time_window: Optional[str] = "ANYTIME"
    staff_notes: Optional[str] = None

class QuoteCreateRequest(BaseModel):
    client_name: str
    client_email: EmailStr
    flight_offers: List[FlightOffer]
    notes: Optional[str] = None

class QuoteResponse(BaseModel):
    id: str
    quote_reference: str
    client_name: str
    client_email: str
    flight_offers: List[FlightOffer]
    valid_until: str
    status: str = "ACTIVE"
    created_at: str


# --- HOTEL SEARCH SCHEMAS ---
class HotelSearchQuery(BaseModel):
    destination: str
    check_in: str
    check_out: str
    guests: int = 2
    rooms: int = 1
    min_stars: Optional[int] = None
    max_price: Optional[float] = None
    facilities: List[str] = []

class HotelOffer(BaseModel):
    hotel_id: str
    name: str
    destination: str
    stars: int
    rating: float
    address: str
    image_url: str
    price_per_night: float
    total_price: float
    currency: str = "EUR"
    room_type: str
    cancellation_policy: str
    amenities: List[str]
    provider: str = "MIR Demo Engine"


# --- ORDER & CHECKOUT SCHEMAS ---
class OrderItem(BaseModel):
    item_type: str  # TOUR, FLIGHT_QUOTE
    item_id: str
    title: str
    quantity: int = 1
    unit_price: float
    details: Dict[str, Any] = {}

class CheckoutRequest(BaseModel):
    items: List[OrderItem]
    customer_name: str
    customer_email: EmailStr
    customer_phone: str
    payment_method: str = "STRIPE"  # STRIPE, PAYPAL

class CheckoutSessionResponse(BaseModel):
    order_id: str
    payment_session_id: str
    payment_url: str
    total_amount: float
    currency: str = "EUR"

class OrderResponse(BaseModel):
    id: str
    order_id: str
    customer_name: str
    customer_email: str
    customer_phone: str
    total_amount: float
    currency: str
    status: str  # PENDING_PAYMENT, PAID, CONFIRMED, CANCELLED, REFUNDED
    payment_provider: str
    items: List[OrderItem]
    created_at: str


# --- AUDIT LOG SCHEMA ---
class AuditLogResponse(BaseModel):
    id: str
    user_email: str
    action: str
    resource: str
    details: str
    timestamp: str
