from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from geoalchemy2 import Geometry
from sqlalchemy.orm import relationship

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
    # reach = relationship(
    #     "Reach", back_populates="region", cascade="all,delete, delete-orphan"
    # )

    def __init__(self, wkt, name, region_type, user_name):
        """
        Constructor
        """
        # Add Spatial Reference ID
        self.name = name
        self.region_type = region_type
        self.user_name = user_name


# class Reach(Base):
#     """
#     SQLAlchemy table definition for storing Reaches.
#     """

#     __tablename__ = "reaches"

#     # Columns
#     id = Column(Integer, primary_key=True)
#     region_id = Column(Integer, ForeignKey("regions.id"))
#     region = relationship("Region", back_populates="reach")
#     raw_object_id = Column(String)
#     raw_shape = Column(Geometry("LINESTRING"))
#     raw_lat = Column(Float)
#     raw_lon = Column(Float)
#     raw_shape_length = Column(Float)
#     raw_feature_id = Column(Float)
#     raw_stream_order = Column(Integer)
#     raw_gnis_name = Column(String)
#     raw_tile_id = Column(Integer)
#     analysis_assim_object_id = Column(Integer)
#     analysis_assim_station_id = Column(Float)
#     analysis_assim_streamflow = Column(String)
#     analysis_assim_streamflow_anomaly = Column(String)
#     analysis_assim_flow_category = Column(Integer)
#     analysis_assim_anomaly_category = Column(Integer)
#     analysis_assim_local_flow_category = Column(Integer)

#     def __init__(
#         self,
#         raw_object_id,
#         raw_shape,
#         raw_lat,
#         raw_lon,
#         raw_shape_length,
#         raw_feature_id,
#         raw_stream_order,
#         raw_gnis_name,
#         raw_tile_id,
#         analysis_assim_object_id,
#         analysis_assim_station_id,
#         analysis_assim_streamflow,
#         analysis_assim_streamflow_anomaly,
#         analysis_assim_flow_category,
#         analysis_assim_anomaly_category,
#         analysis_assim_local_flow_category,
#     ):
#         """
#         Constructor
#         """

#         self.raw_object_id = raw_object_id
#         self.raw_shape = raw_shape
#         self.raw_lat = raw_lat
#         self.raw_lon = raw_lon
#         self.raw_shape_length = raw_shape_length
#         self.raw_feature_id = raw_feature_id
#         self.raw_feature_id = raw_feature_id
#         self.raw_stream_order = raw_stream_order
#         self.raw_gnis_name = raw_gnis_name
#         self.raw_tile_id = raw_tile_id
#         self.analysis_assim_object_id = analysis_assim_object_id
#         self.analysis_assim_station_id = analysis_assim_station_id
#         self.analysis_assim_streamflow = analysis_assim_streamflow
#         self.analysis_assim_streamflow_anomaly = analysis_assim_streamflow_anomaly
#         self.analysis_assim_flow_category = analysis_assim_flow_category
#         self.analysis_assim_anomaly_category = analysis_assim_anomaly_category
#         self.analysis_assim_local_flow_category = analysis_assim_local_flow_category
