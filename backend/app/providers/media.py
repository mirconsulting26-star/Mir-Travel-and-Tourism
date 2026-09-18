import uuid
from typing import Dict, Any
from app.providers.base import BaseMediaProvider

class MockMediaProvider(BaseMediaProvider):
    async def upload_image(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        asset_id = uuid.uuid4().hex[:10]
        # Return standard media structure
        return {
            "public_id": f"mir_cms/{asset_id}",
            "url": f"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
            "filename": filename,
            "format": filename.split(".")[-1] if "." in filename else "jpg",
            "size": len(file_content) or 204800,
            "created_at": "2026-09-18T12:00:00Z"
        }

class CloudinaryAdapter(BaseMediaProvider):
    def __init__(self, cloud_name: str, api_key: str, api_secret: str):
        self.cloud_name = cloud_name
        self.mock = MockMediaProvider()

    async def upload_image(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        return await self.mock.upload_image(file_content, filename)
