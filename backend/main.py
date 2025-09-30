import asyncio

from models import user_collection
from models.user import User

import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


async def main():
    try:
        user_1 = User.model_validate(
            {"firstName": "Jerzy", "lastName": "Wnicniewierzy"}
        )
        result_1 = await user_collection.insert_one(user_1)
        logger.info(f"{1:_<2}. added {result_1} to MongoDB.")
    except ValueError as e:
        logger.error(e)

    try:
        print(await user_collection.find({"first_name": {"$regex": "an"}}))
        print(await user_collection.count_documents())
    except ValueError as e:
        logger.error(e)


if __name__ == "__main__":
    asyncio.run(main())