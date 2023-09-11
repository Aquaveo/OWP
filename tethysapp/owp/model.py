from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean
from geoalchemy2 import Geometry



Base = declarative_base()



class Region(Base):
    """
    SQLAlchemy table definition for storing Regions polygons.
    """
    __tablename__ = 'flood_extents'

    # Columns
    id = Column(Integer, primary_key=True)
    name = Column(String)
    region_type = Column(String)
    default=Column(Boolean)
    geometry = Column(Geometry('MULTIPOLYGON'))
    user_name = Column(String)
    def __init__(self, wkt, comid):
        """
        Constructor
        """
        # Add Spatial Reference ID
        self.geometry = 'SRID=4326;{0}'.format(wkt)
