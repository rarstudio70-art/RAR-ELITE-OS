from sqlalchemy import Column, String, DateTime, Boolean, Integer
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime
import uuid

Base = declarative_base()

def generate_api_key():
    return uuid.uuid4().hex

class ApiKey(Base):
    __tablename__ = "api_keys"

    key = Column(String, primary_key=True, index=True)
    owner_email = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_used = Column(DateTime, nullable=True)
    usage_count = Column(Integer, default=0)
    active = Column(Boolean, default=True)
    revoked = Column(Boolean, default=False)
