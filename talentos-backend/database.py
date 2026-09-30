import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Humne yahan tumhara direct Neon connection string daal diya hai
DATABASE_URL = "postgresql+psycopg://neondb_owner:npg_1F9woKsqQvNj@ep-jolly-leaf-b3tc69sh-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()