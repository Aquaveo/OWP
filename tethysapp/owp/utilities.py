from functools import wraps
from time import process_time
from time import time
import asyncio


# synchronious function mesuare time
def measure_sync(func):
    @wraps(func)
    def _time_it(*args, **kwargs):
        start = int(round(process_time() * 1000))
        try:
            return func(*args, **kwargs)
        finally:
            end_ = int(round(process_time() * 1000)) - start
            print(f"Total execution time {func.__name__}: {end_ if end_ > 0 else 0} ms")

    return _time_it


# https://gist.github.com/Integralist/77d73b2380e4645b564c28c53fae71fb
# asynchronious function mesuare time
def measure_async(func):
    async def process(func, *args, **params):
        if asyncio.iscoroutinefunction(func):
            print("this function is a coroutine: {}".format(func.__name__))
            return await func(*args, **params)
        else:
            print("this is not a coroutine")
            return func(*args, **params)

    async def helper(*args, **params):
        print("{}.time".format(func.__name__))
        start = time()
        result = await process(func, *args, **params)

        # Test normal function route...
        # result = await process(lambda *a, **p: print(*a, **p), *args, **params)
        print(f"Total execution time {func.__name__}: {time() - start} ms")

        return result

    return helper
