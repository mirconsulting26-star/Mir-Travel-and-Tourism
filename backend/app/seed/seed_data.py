import asyncio
import logging
from datetime import datetime, timedelta
from app.core.security import hash_password
from app.core.config import settings
from app.db.mongo import get_db, connect_to_mongo

logger = logging.getLogger(__name__)

async def seed_database():
    db = get_db()
    if db is None:
        logger.warning("Database connection unavailable. Skipping DB seed.")
        return

    # 1. Admin Superuser
    admin_email = settings.ADMIN_BOOTSTRAP_EMAIL
    admin_exists = await db.admin_users.find_one({"email": admin_email})
    if not admin_exists:
        await db.admin_users.insert_one({
            "email": admin_email,
            "full_name": "MIR Admin Superuser",
            "password_hash": hash_password(settings.ADMIN_BOOTSTRAP_PASSWORD),
            "role": "SUPER_ADMIN",
            "is_active": True,
            "created_at": datetime.utcnow().isoformat()
        })
        logger.info(f"Seeded admin superuser: {admin_email}")

    # 2. Demo Destinations
    dest_count = await db.destinations.count_documents({})
    if dest_count == 0:
        destinations = [
            {
                "name": "Benidorm & Costa Blanca [DEMO]",
                "slug": "benidorm-costa-blanca-demo",
                "country": "Spain",
                "region": "Alicante / Valencian Community",
                "summary": "Golden Mediterranean beaches, vibrant nightlife, theme parks, and stunning coastal cliffs.",
                "description": "Benidorm is renowned for its sun-drenched coastline, iconic skyscrapers, and crystal-clear Mediterranean waters. Explore the charming old town or venture into the nearby Serra Gelada Natural Park.",
                "hero_image": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                ],
                "highlights": ["Levante Beach Promenade", "Balcón del Mediterráneo", "Serra Gelada Cliff Hike", "Tabarca Island Boat Trip"],
                "practical_info": {"currency": "EUR (€)", "language": "Spanish, Catalan", "best_time": "May to October"},
                "is_featured": True,
                "created_at": datetime.utcnow().isoformat()
            },
            {
                "name": "Barcelona & Costa Brava [DEMO]",
                "slug": "barcelona-costa-brava-demo",
                "country": "Spain",
                "region": "Catalonia",
                "summary": "Architectural wonders by Gaudí, world-class gastronomy, and picturesque hidden coves.",
                "description": "Discover Barcelona's Gothic Quarter, Sagrada Família, and Park Güell before relaxing along the rugged coastal coves of the Costa Brava.",
                "hero_image": "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=800&q=80"
                ],
                "highlights": ["Sagrada Família", "Park Güell", "Gothic Quarter Walking Tour", "Tossa de Mar Fortress"],
                "practical_info": {"currency": "EUR (€)", "language": "Spanish, Catalan", "best_time": "April to November"},
                "is_featured": True,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        await db.destinations.insert_many(destinations)
        logger.info(f"Seeded {len(destinations)} demo destinations.")

    # 3. Demo Airlines
    airline_count = await db.airlines.count_documents({})
    if airline_count == 0:
        airlines = [
            {"code": "IB", "name": "Iberia", "logo_url": "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=200&q=80", "is_active": True, "is_preferred": True, "is_featured": True, "notes": "Spanish flag carrier - high client satisfaction", "created_at": datetime.utcnow().isoformat()},
            {"code": "VY", "name": "Vueling", "logo_url": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=200&q=80", "is_active": True, "is_preferred": True, "is_featured": True, "notes": "Great direct point-to-point Mediterranean routes", "created_at": datetime.utcnow().isoformat()},
            {"code": "UX", "name": "Air Europa", "logo_url": "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?auto=format&fit=crop&w=200&q=80", "is_active": True, "is_preferred": False, "is_featured": False, "notes": "Reliable domestic & transatlantic flights", "created_at": datetime.utcnow().isoformat()},
            {"code": "LH", "name": "Lufthansa", "logo_url": "https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=200&q=80", "is_active": True, "is_preferred": False, "is_featured": False, "notes": "Premier hub connections via FRA & MUC", "created_at": datetime.utcnow().isoformat()}
        ]
        await db.airlines.insert_many(airlines)
        logger.info(f"Seeded {len(airlines)} demo airlines.")

    # 4. Demo Tours & Departures
    tour_count = await db.tours.count_documents({})
    if tour_count == 0:
        tours = [
            {
                "title": "Costa Blanca Coastal Sun & Heritage Tour [DEMO]",
                "slug": "costa-blanca-coastal-sun-heritage-demo",
                "summary": "7-day guided small-group tour exploring Alicante, Benidorm, Altea, and Tabarca Island.",
                "description": "Experience the ultimate Mediterranean holiday. Includes 4-star hotel stays, daily breakfast, guided historic tours, and private catamaran cruises.",
                "destination": "Benidorm & Costa Blanca [DEMO]",
                "duration_days": 7,
                "price_from": 890.0,
                "deposit_amount": 150.0,
                "inclusions": ["6 nights 4-star hotel accommodation", "Daily buffet breakfast", "Catamaran cruise to Tabarca Island", "Guided walking tour of Altea Old Town", "Airport transfers"],
                "exclusions": ["International flight tickets", "Personal expenses & tips", "Travel insurance"],
                "gallery": [
                    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                ],
                "faqs": [
                    {"question": "What is the group size?", "answer": "Small groups up to a maximum of 14 travellers."},
                    {"question": "Is breakfast included?", "answer": "Yes, full daily breakfast at all hotels is included."}
                ],
                "itinerary": [
                    {"day": 1, "title": "Arrival in Alicante & Welcome Dinner", "description": "Meet your tour leader at Alicante Airport, check into your hotel, and enjoy a seaside welcome dinner."},
                    {"day": 2, "title": "Historic Alicante & Santa Bárbara Castle", "description": "Explore Santa Bárbara Castle with panoramic sea views followed by lunch at Explanada de España."},
                    {"day": 3, "title": "Coastal Benidorm & Balcón del Mediterráneo", "description": "Visit Benidorm's famous lookout point and enjoy free time on Levante Beach."},
                    {"day": 4, "title": "Catamaran Cruise to Tabarca Island", "description": "Set sail to Spain's smallest inhabited island, famous for crystal clear snorkeling and Caldero stew."},
                    {"day": 5, "title": "Altea White Village Walking Tour", "description": "Stroll through cobbled streets, whitewashed homes, and artisan boutiques in charming Altea."},
                    {"day": 6, "title": "Serra Gelada Nature Walk & Leisure Day", "description": "Optional cliffside nature hike or relaxing spa day at the resort."},
                    {"day": 7, "title": "Farewell & Departure", "description": "Check out and private transfer back to Alicante Airport."}
                ],
                "status": "PUBLISHED",
                "is_featured": True,
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        res = await db.tours.insert_many(tours)
        tour_id = str(res.inserted_ids[0])
        
        # Seed departures
        departures = [
            {
                "tour_id": tour_id,
                "start_date": (datetime.utcnow() + timedelta(days=30)).strftime("%Y-%m-%d"),
                "end_date": (datetime.utcnow() + timedelta(days=37)).strftime("%Y-%m-%d"),
                "total_seats": 14,
                "available_seats": 8,
                "price": 890.0,
                "status": "AVAILABLE"
            },
            {
                "tour_id": tour_id,
                "start_date": (datetime.utcnow() + timedelta(days=60)).strftime("%Y-%m-%d"),
                "end_date": (datetime.utcnow() + timedelta(days=67)).strftime("%Y-%m-%d"),
                "total_seats": 14,
                "available_seats": 14,
                "price": 920.0,
                "status": "AVAILABLE"
            }
        ]
        await db.tour_departures.insert_many(departures)
        logger.info("Seeded demo tours and departures.")

    # 5. Demo Blog Posts with Rich Blocks
    blog_count = await db.blog_posts.count_documents({})
    if blog_count == 0:
        blog_posts = [
            {
                "title": "Top 10 Hidden Gems Along Spain's Mediterranean Coast [DEMO]",
                "slug": "top-10-hidden-gems-spain-mediterranean-demo",
                "excerpt": "Discover secluded coves, ancient castles, and culinary delights away from the crowded tourist routes.",
                "category": "Travel Journal",
                "tags": ["Spain", "Costa Blanca", "Beach", "Culture"],
                "cover_image": "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=1200&q=80",
                "gallery": [
                    "https://images.unsplash.com/photo-1543783207-ec64e4d95325?auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80"
                ],
                "blocks": [
                    {
                        "id": "blk-1",
                        "type": "heading",
                        "content": {"level": 2, "text": "Unveiling the Secret Coastline"}
                    },
                    {
                        "id": "blk-2",
                        "type": "paragraph",
                        "content": {"text": "Spain's Mediterranean shoreline extends for over 1,600 kilometers, offering far more than popular resort beaches. Beyond the major hubs lie whitewashed cliff villages, pristine marine reserves, and centuries-old fortresses."}
                    },
                    {
                        "id": "blk-3",
                        "type": "callout",
                        "content": {"title": "Traveler Tip", "text": "Visit Tabarca Island during spring or early autumn for calm seas and uncrowded beaches.", "style": "info"}
                    },
                    {
                        "id": "blk-4",
                        "type": "quote",
                        "content": {"quote": "The Mediterranean is not a sea; it is an emotion.", "author": "Famous Traveler"}
                    }
                ],
                "author": "MIR Travel Editorial Desk",
                "status": "PUBLISHED",
                "publish_at": datetime.utcnow().isoformat(),
                "is_featured": True,
                "seo_title": "Hidden Gems of Spain's Mediterranean Coast | MIR Travel Journal",
                "seo_description": "Explore secret coves, authentic villages, and historic spots along the Spanish coast with MIR Travel.",
                "created_at": datetime.utcnow().isoformat()
            }
        ]
        await db.blog_posts.insert_many(blog_posts)
        logger.info("Seeded demo blog post.")

if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    asyncio.run(connect_to_mongo())
    asyncio.run(seed_database())
