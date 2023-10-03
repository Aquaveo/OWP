from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean
from geoalchemy2 import Geometry


Base = declarative_base()


class Region(Base):
    """
    SQLAlchemy table definition for storing Regions polygons.
    """

    __tablename__ = "regions"

    # Columns
    id = Column(Integer, primary_key=True)
    name = Column(String)
    region_type = Column(String)
    default = Column(Boolean)
    geom = Column(Geometry("GEOMETRYCOLLECTION"))
    user_name = Column(String)
    layer_color = Column(String)

    def __init__(self, wkt, name, region_type, user_name):
        """
        Constructor
        """
        # Add Spatial Reference ID
        self.name = name
        self.region_type = region_type
        self.user_name = user_name
