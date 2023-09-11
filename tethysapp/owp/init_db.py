# Put your persistent store initializer functions in here
import os
from sqlalchemy.orm import sessionmaker
from .model import Base, Region

from requests import Request
import geopandas as gpd
from geoalchemy2 import Geometry, WKTElement

def init_user_data_db(engine,first_time):
	"""
	Initialize the flooded addresses database.
	"""
	# STEP 1: Create database tables
	Base.metadata.create_all(engine)
	# STEP 2: Add data to the database
	if first_time:
		print("initializing database")
		# Find path of parent directory relative to this file
		
		# Create a session object in preparation for interacting with the database
		SessionMaker = sessionmaker(bind=engine)
		session = SessionMaker()
	
		session.commit()

		# Close the connection to prevent issues
		session.close()
