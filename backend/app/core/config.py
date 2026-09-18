import os
from typing import List
from pydantic import ConfigDict
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    model_config = ConfigDict(
        env_file=".env",
        extra="ignore"
    )

    APP_NAME: str = "MIR Travel & Tourism API"
    APP_ENV: str = "development"
    DEBUG: bool = True
    
    SECRET_KEY: str = "DUMMY_SECRET_KEY_CHANGE_IN_PROD_12345"
    JWT_SECRET: str = "DUMMY_JWT_SECRET_CHANGE_IN_PROD_67890"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    MONGODB_URI: str = "mongodb+srv://mirconsulting26_db_user:HHRaJBTryQBuSy0f@mir-consulting-database.yoq7moa.mongodb.net/?appName=Mir-Consulting-Database"
    MONGODB_DB: str = "mir_travel_db"
    
    FRONTEND_URL: str = "http://localhost:5173"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"
    
    ADMIN_BOOTSTRAP_EMAIL: str = "admin@mirtravel.es"
    ADMIN_BOOTSTRAP_PASSWORD: str = "AdminPass123!"
    
    # Provider credentials (with safe dummy defaults for Mock Mode)
    AMADEUS_CLIENT_ID: str = "DUMMY_AMADEUS_CLIENT_ID"
    AMADEUS_CLIENT_SECRET: str = "DUMMY_AMADEUS_CLIENT_SECRET"
    AMADEUS_BASE_URL: str = "https://test.api.amadeus.com"
    
    STRIPE_SECRET_KEY: str = "DUMMY_STRIPE_SECRET_KEY"
    STRIPE_WEBHOOK_SECRET: str = "DUMMY_STRIPE_WEBHOOK_SECRET"
    
    PAYPAL_CLIENT_ID: str = "DUMMY_PAYPAL_CLIENT_ID"
    PAYPAL_CLIENT_SECRET: str = "DUMMY_PAYPAL_CLIENT_SECRET"
    
    CLOUDINARY_CLOUD_NAME: str = "DUMMY_CLOUDINARY_CLOUD_NAME"
    CLOUDINARY_API_KEY: str = "DUMMY_CLOUDINARY_API_KEY"
    CLOUDINARY_API_SECRET: str = "DUMMY_CLOUDINARY_API_SECRET"
    
    PEXELS_API_KEY: str = "DUMMY_PEXELS_API_KEY"
    BREVO_API_KEY: str = "DUMMY_BREVO_API_KEY"

    @property
    def cors_origin_list(self) -> List[str]:
        if not self.CORS_ORIGINS:
            return ["*"]
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
