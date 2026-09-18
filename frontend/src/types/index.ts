export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'SUPER_ADMIN' | 'STAFF';
  is_active: boolean;
  created_at: string;
}

export interface Segment {
  departure_airport: string;
  arrival_airport: string;
  departure_time: string;
  arrival_time: string;
  airline_code: string;
  airline_name: string;
  flight_number: string;
  duration_minutes: number;
  aircraft?: string;
}

export interface FlightOffer {
  offer_id: string;
  price: number;
  currency: string;
  total_duration_minutes: number;
  stops: number;
  valid_until: string;
  outbound_segments: Segment[];
  return_segments: Segment[];
  baggage_included: boolean;
  fare_class: string;
  provider: string;
  score?: number;
  explainable_reasons?: string[];
  is_shortlisted?: boolean;
}

export interface FlightDeskRequest {
  client_name: string;
  client_email: string;
  client_phone?: string;
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  passengers: number;
  cabin_class: string;
  flexibility_days: number;
  budget_max?: number;
  preferred_airlines: string[];
  excluded_airlines: string[];
  max_stops?: number;
  baggage_required: boolean;
  time_window?: string;
  staff_notes?: string;
}

export interface Quote {
  id: string;
  quote_reference: string;
  client_name: string;
  client_email: string;
  flight_offers: FlightOffer[];
  valid_until: string;
  status: string;
  created_at: string;
}

export interface HotelOffer {
  hotel_id: string;
  name: string;
  destination: string;
  stars: number;
  rating: number;
  address: string;
  image_url: string;
  price_per_night: number;
  total_price: number;
  currency: string;
  room_type: string;
  cancellation_policy: string;
  amenities: string[];
  provider: string;
}

export interface TourDeparture {
  id: string;
  tour_id: string;
  start_date: string;
  end_date: string;
  total_seats: number;
  available_seats: number;
  price: number;
  status: string;
}

export interface ItineraryItem {
  day: number;
  title: string;
  description: string;
}

export interface Tour {
  id: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  destination: string;
  duration_days: number;
  price_from: number;
  deposit_amount: number;
  inclusions: string[];
  exclusions: string[];
  gallery: string[];
  faqs: { question: string; answer: string }[];
  itinerary: ItineraryItem[];
  status: string;
  is_featured: boolean;
  departures: TourDeparture[];
  created_at: string;
}

export interface Destination {
  id: string;
  name: string;
  slug: string;
  country: string;
  region?: string;
  summary: string;
  description: string;
  hero_image?: string;
  gallery: string[];
  highlights: string[];
  practical_info: Record<string, string>;
  is_featured: boolean;
  created_at: string;
}

export interface BlogBlock {
  id: string;
  type: string;
  content: any;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string[];
  cover_image?: string;
  gallery: string[];
  blocks: BlogBlock[];
  author: string;
  status: string;
  publish_at?: string;
  is_featured: boolean;
  seo_title?: string;
  seo_description?: string;
  created_at: string;
}

export interface Airline {
  id: string;
  code: string;
  name: string;
  logo_url?: string;
  is_active: boolean;
  is_preferred: boolean;
  is_featured: boolean;
  notes?: string;
  created_at: string;
}

export interface OrderItem {
  item_type: string;
  item_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  details?: Record<string, any>;
}

export interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  currency: string;
  status: string;
  payment_provider: string;
  items: OrderItem[];
  created_at: string;
}
