import os

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/")
DB_NAME = os.getenv("MONGO_DB_NAME", "mydatabase")


class Settings(BaseSettings):
    MONGODB_URI: str
    MONGO_DB_NAME: str

    def __repr__(self) -> str:
        """Return a string representation of the model."""
        attrs = []
        for field_name in self.model_fields:
            value = getattr(self, field_name)
            attrs.append(f"{field_name}={repr(value)}")
        return f"{self.__class__.__name__}({', '.join(attrs)})"


settings = Settings(MONGODB_URI=MONGODB_URI, MONGO_DB_NAME=DB_NAME)
