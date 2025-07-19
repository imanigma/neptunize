"""
Database configuration and session management.
"""
import os
import logging
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError

from app.config import get_settings

settings = get_settings()

def create_database_engine():
    """Create database engine with fallback to SQLite if PostgreSQL unavailable."""
    try:
        # Try PostgreSQL first
        engine = create_engine(
            settings.database_url,
            pool_pre_ping=True,
            pool_size=10,
            max_overflow=20,
            pool_recycle=3600,
            echo=settings.debug
        )
        # Test connection
        with engine.connect() as conn:
            conn.execute("SELECT 1")
        logging.info("Connected to PostgreSQL database")
        return engine
    except (OperationalError, Exception) as e:
        logging.warning(f"PostgreSQL not available ({e}), falling back to SQLite")
        # Fallback to SQLite
        sqlite_url = "sqlite:///./neptunize.db"
        engine = create_engine(
            sqlite_url,
            connect_args={"check_same_thread": False},  # For SQLite
            echo=settings.debug
        )
        logging.info("Using SQLite database for development")
        return engine

# Create database engine with fallback
engine = create_database_engine()

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Database dependency for FastAPI routes."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Test database configuration
def get_test_engine():
    """Get test database engine."""
    test_url = settings.database_url_test or settings.database_url.replace("neptunize_db", "neptunize_test_db")
    return create_engine(test_url, pool_pre_ping=True)


def get_test_db() -> Generator[Session, None, None]:
    """Test database dependency."""
    test_engine = get_test_engine()
    TestSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()
