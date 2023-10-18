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
#     OBJECTID = Column(String)
#     FDATE = Column(String)
#     GNIS_ID = Column(String)
#     GNIS_NAME = Column(String)
#     LENGTHKM = Column(Float)
#     REACHCODE = Column(String)
#     FCODE = Column(Integer)
#     Shape_Length = Column(Float)
#     RESOLUTION = Column(String)
#     FLOWDIR = Column(String)
#     FTYPE = Column(String)
#     COMID = Column(Integer)
#     WBAREACOMI = Column(Integer)
#     StreamLeve = Column(Integer)
#     StreamOrde = Column(Integer)
#     StreamCalc = Column(Integer)
#     FromNode = Column(Float)
#     ToNode = Column(Float)
#     Hydroseq = Column(Float)
#     LevelPathI = Column(Float)
#     Pathlength = Column(Float)
#     TerminalPa = Column(Float)
#     ArbolateSu = Column(Float)
#     Divergence = Column(Integer)
#     StartFlag = Column(Integer)
#     TerminalFl = Column(Integer)
#     DnLevel = Column(Integer)
#     UpLevelPat = Column(Float)
#     UpHydroseq = Column(Float)
#     DnLevelPat = Column(Float)
#     DnMinorHyd = Column(Float)
#     DnDrainCou = Column(Integer)
#     DnHydroseq = Column(Float)
#     FromMeas = Column(Float)
#     ToMeas = Column(Float)
#     RtnDiv = Column(Integer)
#     VPUIn = Column(Integer)
#     VPUOut = Column(Integer)
#     AreaSqKM = Column(Float)
#     TotDASqKM = Column(Float)
#     DivDASqKM = Column(Float)
#     HWNodeSqKM = Column(Float)
#     MAXELEVRAW = Column(Float)
#     MAXELEVSMO = Column(Float)
#     MINELEVSMO = Column(Float)
#     SLOPE = Column(Float)
#     ELEVFIXED = Column(String)
#     HWTYPE = Column(String)
#     SLOPELENKM = Column(Float)
#     QA_MA = Column(Float)
#     VA_MA = Column(Float)
#     QC_MA = Column(Float)
#     VC_MA = Column(Float)
#     QE_MA = Column(Float)
#     VE_MA = Column(Float)
#     QA_01 = Column(Float)
#     VA_01 = Column(Float)
#     QC_01 = Column(Float)
#     VC_01 = Column(Float)
#     QE_01 = Column(Float)
#     VE_01 = Column(Float)
#     QA_02 = Column(Float)
#     VA_02 = Column(Float)
#     QC_02 = Column(Float)
#     VC_02 = Column(Float)
#     QE_02 = Column(Float)
#     VE_02 = Column(Float)
#     QA_03 = Column(Float)
#     VA_03 = Column(Float)
#     QC_03 = Column(Float)
#     VC_03 = Column(Float)
#     QE_03 = Column(Float)
#     VE_03 = Column(Float)
#     QA_04 = Column(Float)
#     VA_04 = Column(Float)
#     QC_04 = Column(Float)
#     VC_04 = Column(Float)
#     QE_04 = Column(Float)
#     VE_04 = Column(Float)
#     QA_05 = Column(Float)
#     VA_05 = Column(Float)
#     QC_05 = Column(Float)
#     VC_05 = Column(Float)
#     QE_05 = Column(Float)
#     VE_05 = Column(Float)
#     QA_06 = Column(Float)
#     VA_06 = Column(Float)
#     QC_06 = Column(Float)
#     VC_06 = Column(Float)
#     QE_06 = Column(Float)
#     VE_06 = Column(Float)
#     QA_07 = Column(Float)
#     VA_07 = Column(Float)
#     QC_07 = Column(Float)
#     VC_07 = Column(Float)
#     QE_07 = Column(Float)
#     VE_07 = Column(Float)
#     QA_08 = Column(Float)
#     VA_08 = Column(Float)
#     QC_08 = Column(Float)
#     VC_08 = Column(Float)
#     QE_08 = Column(Float)
#     VE_08 = Column(Float)
#     QA_09 = Column(Float)
#     VA_09 = Column(Float)
#     QC_09 = Column(Float)
#     VC_09 = Column(Float)
#     QE_09 = Column(Float)
#     VE_09 = Column(Float)
#     QA_10 = Column(Float)
#     VA_10 = Column(Float)
#     QC_10 = Column(Float)
#     VC_10 = Column(Float)
#     QE_10 = Column(Float)
#     VE_10 = Column(Float)
#     QA_11 = Column(Float)
#     VA_11 = Column(Float)
#     QC_11 = Column(Float)
#     VC_11 = Column(Float)
#     QE_11 = Column(Float)
#     VE_11 = Column(Float)
#     QA_12 = Column(Float)
#     VA_12 = Column(Float)
#     QC_12 = Column(Float)
#     VC_12 = Column(Float)
#     QE_12 = Column(Float)
#     VE_12 = Column(Float)
#     RPUID = Column(String)
#     VPUID = Column(String)
#     Enabled = Column(Integer)
#     keep_gaz_string = Column(String)

#     def __init__(
#         self,
#         OBJECTID,
#         FDATE,
#         GNIS_ID,
#         GNIS_NAME,
#         LENGTHKM,
#         REACHCODE,
#         FCODE,
#         Shape_Length,
#         RESOLUTION,
#         FLOWDIR,
#         FTYPE,
#         COMID,
#         WBAREACOMI,
#         StreamLeve,
#         StreamOrde,
#         StreamCalc,
#         FromNode,
#         ToNode,
#         Hydroseq,
#         LevelPathI,
#         Pathlength,
#         TerminalPa,
#         ArbolateSu,
#         Divergence,
#         StartFlag,
#         TerminalFl,
#         DnLevel,
#         UpLevelPat,
#         UpHydroseq,
#         DnLevelPat,
#         DnMinorHyd,
#         DnDrainCou,
#         DnHydroseq,
#         FromMeas,
#         ToMeas,
#         RtnDiv,
#         VPUIn,
#         VPUOut,
#         AreaSqKM,
#         TotDASqKM,
#         DivDASqKM,
#         HWNodeSqKM,
#         MAXELEVRAW,
#         MAXELEVSMO,
#         MINELEVSMO,
#         SLOPE,
#         ELEVFIXED,
#         HWTYPE,
#         SLOPELENKM,
#         QA_MA,
#         VA_MA,
#         QC_MA,
#         VC_MA,
#         QE_MA,
#         VE_MA,
#         QA_01,
#         VA_01,
#         QC_01,
#         VC_01,
#         QE_01,
#         VE_01,
#         QA_02,
#         VA_02,
#         QC_02,
#         VC_02,
#         QE_02,
#         VE_02,
#         QA_03,
#         VA_03,
#         QC_03,
#         VC_03,
#         QE_03,
#         VE_03,
#         QA_04,
#         VA_04,
#         QC_04,
#         VC_04,
#         QE_04,
#         VE_04,
#         QA_05,
#         VA_05,
#         QC_05,
#         VC_05,
#         QE_05,
#         VE_05,
#         QA_06,
#         VA_06,
#         QC_06,
#         VC_06,
#         QE_06,
#         VE_06,
#         QA_07,
#         VA_07,
#         QC_07,
#         VC_07,
#         QE_07,
#         VE_07,
#         QA_08,
#         VA_08,
#         QC_08,
#         VC_08,
#         QE_08,
#         VE_08,
#         QA_09,
#         VA_09,
#         QC_09,
#         VC_09,
#         QE_09,
#         VE_09,
#         QA_10,
#         VA_10,
#         QC_10,
#         VC_10,
#         QE_10,
#         VE_10,
#         QA_11,
#         VA_11,
#         QC_11,
#         VC_11,
#         QE_11,
#         VE_11,
#         QA_12,
#         VA_12,
#         QC_12,
#         VC_12,
#         QE_12,
#         VE_12,
#         RPUID,
#         VPUID,
#         Enabled,
#         keep_gaz_string,
#     ):
#         """
#         Constructor
#         """

#         self.OBJECTID = OBJECTID
#         self.FDATE = FDATE
#         self.GNIS_ID = GNIS_ID
#         self.GNIS_NAME = GNIS_NAME
#         self.LENGTHKM = LENGTHKM
#         self.REACHCODE = REACHCODE
#         self.FCODE = FCODE
#         self.Shape_Length = Shape_Length
#         self.RESOLUTION = RESOLUTION
#         self.FLOWDIR = RESOLUTION
#         self.FTYPE = FTYPE
#         self.COMID = COMID
#         self.WBAREACOMI = WBAREACOMI
#         self.StreamLeve = StreamLeve
#         self.StreamOrde = StreamOrde
#         self.StreamCalc = StreamCalc
#         self.FromNode = FromNode
#         self.ToNode = ToNode
#         self.Hydroseq = Hydroseq
#         self.LevelPathI = LevelPathI
#         self.Pathlength = Pathlength
#         self.TerminalPa = TerminalPa
#         self.ArbolateSu = ArbolateSu
#         self.Divergence = Divergence
#         self.StartFlag = StartFlag
#         self.TerminalFl = TerminalFl
#         self.DnLevel = DnLevel
#         self.UpLevelPat = UpLevelPat
#         self.UpHydroseq = UpHydroseq
#         self.DnLevelPat = DnLevelPat
#         self.DnMinorHyd = DnMinorHyd
#         self.DnDrainCou = DnDrainCou
#         self.DnHydroseq = DnHydroseq
#         self.FromMeas = FromMeas
#         self.ToMeas = ToMeas
#         self.RtnDiv = RtnDiv
#         self.VPUIn = VPUIn
#         self.VPUOut = VPUOut
#         self.AreaSqKM = AreaSqKM
#         self.TotDASqKM = TotDASqKM
#         self.DivDASqKM = DivDASqKM
#         self.HWNodeSqKM = HWNodeSqKM
#         self.MAXELEVRAW = MAXELEVRAW
#         self.MAXELEVSMO = MAXELEVSMO
#         self.MINELEVSMO = MINELEVSMO
#         self.SLOPE = SLOPE
#         self.ELEVFIXED = ELEVFIXED
#         self.HWTYPE = HWTYPE
#         self.SLOPELENKM = SLOPELENKM
#         self.QA_MA = QA_MA
#         self.VA_MA = VA_MA
#         self.QC_MA = QC_MA
#         self.VC_MA = VC_MA
#         self.QE_MA = QE_MA
#         self.VE_MA = VE_MA
#         self.QA_01 = QA_01
#         self.VA_01 = VA_01
#         self.QC_01 = QC_01
#         self.VC_01 = VC_01
#         self.QE_01 = QE_01
#         self.VE_01 = VE_01
#         self.QA_02 = QA_02
#         self.VA_02 = VA_02
#         self.QC_02 = QC_02
#         self.VC_02 = VC_02
#         self.QE_02 = QE_02
#         self.VE_02 = VE_02
#         self.QA_03 = QA_03
#         self.VA_03 = VA_03
#         self.QC_03 = QC_03
#         self.VC_03 = VC_03
#         self.QE_03 = QE_03
#         self.VE_03 = VE_03
#         self.QA_04 = QA_04
#         self.VA_04 = VA_04
#         self.QC_04 = QC_04
#         self.VC_04 = VC_04
#         self.QE_04 = QE_04
#         self.VE_04 = VE_04
#         self.QA_05 = QA_05
#         self.VA_05 = VA_05
#         self.QC_05 = QC_05
#         self.VC_05 = VC_05
#         self.QE_05 = QE_05
#         self.VE_05 = VE_05
#         self.QA_06 = QA_06
#         self.VA_06 = VA_06
#         self.QC_06 = QC_06
#         self.VC_06 = VC_06
#         self.QE_06 = QE_06
#         self.VE_06 = VE_06
#         self.QA_07 = QA_07
#         self.VA_07 = VA_07
#         self.QC_07 = QC_07
#         self.VC_07 = VC_07
#         self.QE_07 = QE_07
#         self.VE_07 = VE_07
#         self.QA_08 = QA_08
#         self.VA_08 = VA_08
#         self.QC_08 = QC_08
#         self.VC_08 = VC_08
#         self.QE_08 = QE_08
#         self.VE_08 = VE_08
#         self.QA_09 = QA_09
#         self.VA_09 = VA_09
#         self.QC_09 = QC_09
#         self.VC_09 = VC_09
#         self.QE_09 = QE_09
#         self.VE_09 = VE_09
#         self.QA_10 = QA_10
#         self.VA_10 = VA_10
#         self.QC_10 = QC_10
#         self.VC_10 = VC_10
#         self.QE_10 = QE_10
#         self.VE_10 = VE_10
#         self.QA_11 = QA_11
#         self.VA_11 = VA_11
#         self.QC_11 = QC_11
#         self.VC_11 = VC_11
#         self.QE_11 = QE_11
#         self.VE_11 = VE_11
#         self.QA_12 = QA_12
#         self.VA_12 = VA_12
#         self.QC_12 = QC_12
#         self.VC_12 = VC_12
#         self.QE_12 = QE_12
#         self.VE_12 = VE_12
#         self.RPUID = RPUID
#         self.VPUID = VPUID
#         self.Enabled = Enabled
#         self.keep_gaz_string = keep_gaz_string


'''
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

'''
