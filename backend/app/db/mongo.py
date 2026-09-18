import logging
from typing import Optional
from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from app.core.config import settings

logger = logging.getLogger(__name__)

class MongoDatabase:
    client: Optional[AsyncIOMotorClient] = None
    db: Optional[AsyncIOMotorDatabase] = None

db_instance = MongoDatabase()

async def connect_to_mongo():
    try:
        logger.info(f"Connecting to MongoDB at {settings.MONGODB_URI}...")
        db_instance.client = AsyncIOMotorClient(settings.MONGODB_URI)
        db_instance.db = db_instance.client[settings.MONGODB_DB]
        
        # Test connection ping
        await db_instance.client.admin.command('ping')
        logger.info("Successfully connected to MongoDB.")
        
        # Ensure collection indexes
        await init_db_indexes()
    except Exception as e:
        logger.warning(f"Could not connect to MongoDB ({e}). Falling back to mock/in-memory mode if DB is unreachable.")

async def close_mongo_connection():
    if db_instance.client:
        logger.info("Closing MongoDB connection...")
        db_instance.client.close()
        logger.info("MongoDB connection closed.")

def get_db() -> Optional[AsyncIOMotorDatabase]:
    return db_instance.db

async def init_db_indexes():
    if db_instance.db is None:
        return
    
    try:
        # User email index
        await db_instance.db.admin_users.create_index("email", unique=True)
        # Slug indexes for CMS
        await db_instance.db.tours.create_index("slug", unique=True)
        await db_instance.db.destinations.create_index("slug", unique=True)
        await db_instance.db.blog_posts.create_index("slug", unique=True)
        await db_instance.db.events.create_index("slug", unique=True)
        # Airline code index
        await db_instance.db.airlines.create_index("code", unique=True)
        # Orders reference index
        await db_instance.db.orders.create_index("order_id", unique=True)
        # Audit log index
        await db_instance.db.audit_logs.create_index("timestamp")
        logger.info("MongoDB indexes created successfully.")
    except Exception as e:
        logger.error(f"Error creating MongoDB indexes: {e}")
