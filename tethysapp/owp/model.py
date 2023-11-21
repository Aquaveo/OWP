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
    geom = Column(Geometry("GEOMETRYCOLLECTION"))
    user_name = Column(String)
    layer_color = Column(String)
    number_reaches = Column(Integer)
    reach = relationship(
        "Reach", back_populates="region", cascade="all,delete, delete-orphan"
    )

    def __init__(self, name, region_type, user_name):
        """
        Constructor
        """
        # Add Spatial Reference ID
        self.name = name
        self.region_type = region_type
        self.user_name = user_name


class Reach(Base):
    """
    SQLAlchemy table definition for storing Reaches.
    """

    __tablename__ = "reaches"

    # Columns
    id = Column(Integer, primary_key=True)
    region_id = Column(Integer, ForeignKey("regions.id"))
    region = relationship("Region", back_populates="reach")
    geometry = Column(Geometry("LINESTRING"))
    fdate = Column(String)
    gnis_id = Column(String)
    gnis_name = Column(String)
    lengthkm = Column(Float)
    reachcode = Column(String)
    fcode = Column(Integer)
    shape_length = Column(Float)
    resolution = Column(String)
    flowdir = Column(String)
    ftype = Column(String)
    comid = Column(Integer)
    wbareacomi = Column(Integer)
    streamleve = Column(Integer)
    streamorde = Column(Integer)
    streamcalc = Column(Integer)
    fromnode = Column(Float)
    tonode = Column(Float)
    hydroseq = Column(Float)
    levelpathi = Column(Float)
    pathlength = Column(Float)
    terminalpa = Column(Float)
    arbolatesu = Column(Float)
    divergence = Column(Integer)
    startflag = Column(Integer)
    terminalfl = Column(Integer)
    dnlevel = Column(Integer)
    uplevelpat = Column(Float)
    uphydroseq = Column(Float)
    dnlevelpat = Column(Float)
    dnminorhyd = Column(Float)
    dndraincou = Column(Integer)
    dnhydroseq = Column(Float)
    frommeas = Column(Float)
    tomeas = Column(Float)
    rtndiv = Column(Integer)
    vpuin = Column(Integer)
    vpuout = Column(Integer)
    areasqkm = Column(Float)
    totdasqkm = Column(Float)
    divdasqkm = Column(Float)
    tidal = Column(Float)
    totma = Column(Float)
    wbareatype = Column(String)
    pathtimema = Column(Float)
    hwnodesqkm = Column(Float)
    maxelevraw = Column(Float)
    minelevraw = Column(Float)
    maxelevsmo = Column(Float)
    minelevsmo = Column(Float)
    slope = Column(Float)
    elevfixed = Column(String)
    hwtype = Column(String)
    slopelenkm = Column(Float)
    qa_ma = Column(Float)
    va_ma = Column(Float)
    qc_ma = Column(Float)
    vc_ma = Column(Float)
    qe_ma = Column(Float)
    ve_ma = Column(Float)
    qa_01 = Column(Float)
    va_01 = Column(Float)
    qc_01 = Column(Float)
    vc_01 = Column(Float)
    qe_01 = Column(Float)
    ve_01 = Column(Float)
    qa_02 = Column(Float)
    va_02 = Column(Float)
    qc_02 = Column(Float)
    vc_02 = Column(Float)
    qe_02 = Column(Float)
    ve_02 = Column(Float)
    qa_03 = Column(Float)
    va_03 = Column(Float)
    qc_03 = Column(Float)
    vc_03 = Column(Float)
    qe_03 = Column(Float)
    ve_03 = Column(Float)
    qa_04 = Column(Float)
    va_04 = Column(Float)
    qc_04 = Column(Float)
    vc_04 = Column(Float)
    qe_04 = Column(Float)
    ve_04 = Column(Float)
    qa_05 = Column(Float)
    va_05 = Column(Float)
    qc_05 = Column(Float)
    vc_05 = Column(Float)
    qe_05 = Column(Float)
    ve_05 = Column(Float)
    qa_06 = Column(Float)
    va_06 = Column(Float)
    qc_06 = Column(Float)
    vc_06 = Column(Float)
    qe_06 = Column(Float)
    ve_06 = Column(Float)
    qa_07 = Column(Float)
    va_07 = Column(Float)
    qc_07 = Column(Float)
    vc_07 = Column(Float)
    qe_07 = Column(Float)
    ve_07 = Column(Float)
    qa_08 = Column(Float)
    va_08 = Column(Float)
    qc_08 = Column(Float)
    vc_08 = Column(Float)
    qe_08 = Column(Float)
    ve_08 = Column(Float)
    qa_09 = Column(Float)
    va_09 = Column(Float)
    qc_09 = Column(Float)
    vc_09 = Column(Float)
    qe_09 = Column(Float)
    ve_09 = Column(Float)
    qa_10 = Column(Float)
    va_10 = Column(Float)
    qc_10 = Column(Float)
    vc_10 = Column(Float)
    qe_10 = Column(Float)
    ve_10 = Column(Float)
    qa_11 = Column(Float)
    va_11 = Column(Float)
    qc_11 = Column(Float)
    vc_11 = Column(Float)
    qe_11 = Column(Float)
    ve_11 = Column(Float)
    qa_12 = Column(Float)
    va_12 = Column(Float)
    qc_12 = Column(Float)
    vc_12 = Column(Float)
    qe_12 = Column(Float)
    ve_12 = Column(Float)
    lakefract = Column(Float)
    surfarea = Column(Float)
    rareahload = Column(Float)
    rpuid = Column(String)
    vpuid = Column(String)
    enabled = Column(Integer)
    keep_gaz_string = Column(String)

    def __init__(
        self,
        fdate,
        gnis_id,
        gnis_name,
        lengthkm,
        reachcode,
        fcode,
        shape_length,
        resolution,
        flowdir,
        ftype,
        comid,
        wbareacomi,
        streamleve,
        streamorde,
        streamcalc,
        fromnode,
        tonode,
        hydroseq,
        levelpathi,
        pathlength,
        terminalpa,
        arbolatesu,
        divergence,
        startflag,
        terminalfl,
        dnlevel,
        uplevelpat,
        uphydroseq,
        dnlevelpat,
        dnminorhyd,
        dndraincou,
        dnhydroseq,
        frommeas,
        tomeas,
        rtndiv,
        vpuin,
        vpuout,
        areasqkm,
        totdasqkm,
        divdasqkm,
        tidal,
        totma,
        wbareatype,
        pathtimema,
        hwnodesqkm,
        maxelevraw,
        minelevraw,
        maxelevsmo,
        minelevsmo,
        slope,
        elevfixed,
        hwtype,
        slopelenkm,
        qa_ma,
        va_ma,
        qc_ma,
        vc_ma,
        qe_ma,
        ve_ma,
        qa_01,
        va_01,
        qc_01,
        vc_01,
        qe_01,
        ve_01,
        qa_02,
        va_02,
        qc_02,
        vc_02,
        qe_02,
        ve_02,
        qa_03,
        va_03,
        qc_03,
        vc_03,
        qe_03,
        ve_03,
        qa_04,
        va_04,
        qc_04,
        vc_04,
        qe_04,
        ve_04,
        qa_05,
        va_05,
        qc_05,
        vc_05,
        qe_05,
        ve_05,
        qa_06,
        va_06,
        qc_06,
        vc_06,
        qe_06,
        ve_06,
        qa_07,
        va_07,
        qc_07,
        vc_07,
        qe_07,
        ve_07,
        qa_08,
        va_08,
        qc_08,
        vc_08,
        qe_08,
        ve_08,
        qa_09,
        va_09,
        qc_09,
        vc_09,
        qe_09,
        ve_09,
        qa_10,
        va_10,
        qc_10,
        vc_10,
        qe_10,
        ve_10,
        qa_11,
        va_11,
        qc_11,
        vc_11,
        qe_11,
        ve_11,
        qa_12,
        va_12,
        qc_12,
        vc_12,
        qe_12,
        ve_12,
        lakefract,
        surfarea,
        rareahload,
        rpuid,
        vpuid,
        enabled,
        keep_gaz_string,
    ):
        """
        Constructor
        """

        self.fdate = fdate
        self.gnis_id = gnis_id
        self.gnis_name = gnis_name
        self.lengthkm = lengthkm
        self.reachcode = reachcode
        self.fcode = fcode
        self.shape_length = shape_length
        self.resolution = resolution
        self.flowdir = flowdir
        self.ftype = ftype
        self.comid = comid
        self.wbareacomi = wbareacomi
        self.streamleve = streamleve
        self.streamorde = streamorde
        self.streamcalc = streamcalc
        self.fromnode = fromnode
        self.tonode = tonode
        self.hydroseq = hydroseq
        self.levelpathi = levelpathi
        self.pathlength = pathlength
        self.terminalpa = terminalpa
        self.arbolatesu = arbolatesu
        self.divergence = divergence
        self.startflag = startflag
        self.terminalfl = terminalfl
        self.dnlevel = dnlevel
        self.uplevelpat = uplevelpat
        self.uphydroseq = uphydroseq
        self.dnlevelpat = dnlevelpat
        self.dnminorhyd = dnminorhyd
        self.dndraincou = dndraincou
        self.dnhydroseq = dnhydroseq
        self.frommeas = frommeas
        self.tomeas = tomeas
        self.rtndiv = rtndiv
        self.vpuin = vpuin
        self.vpuout = vpuout
        self.areasqkm = areasqkm
        self.totdasqkm = totdasqkm
        self.divdasqkm = divdasqkm
        self.tidal = tidal
        self.totma = totma
        self.wbareatype = wbareatype
        self.pathtimema = pathtimema
        self.hwnodesqkm = hwnodesqkm
        self.maxelevraw = maxelevraw
        self.minelevraw = minelevraw
        self.maxelevsmo = maxelevsmo
        self.minelevsmo = minelevsmo
        self.slope = slope
        self.elevfixed = elevfixed
        self.hwtype = hwtype
        self.slopelenkm = slopelenkm
        self.qa_ma = qa_ma
        self.va_ma = va_ma
        self.qc_ma = qc_ma
        self.vc_ma = vc_ma
        self.qe_ma = qe_ma
        self.ve_ma = ve_ma
        self.qa_01 = qa_01
        self.va_01 = va_01
        self.qc_01 = qc_01
        self.vc_01 = vc_01
        self.qe_01 = qe_01
        self.ve_01 = ve_01
        self.qa_02 = qa_02
        self.va_02 = va_02
        self.qc_02 = qc_02
        self.vc_02 = vc_02
        self.qe_02 = qe_02
        self.ve_02 = ve_02
        self.qa_03 = qa_03
        self.va_03 = va_03
        self.qc_03 = qc_03
        self.vc_03 = vc_03
        self.qe_03 = qe_03
        self.ve_03 = ve_03
        self.qa_04 = qa_04
        self.va_04 = va_04
        self.qc_04 = qc_04
        self.vc_04 = vc_04
        self.qe_04 = qe_04
        self.ve_04 = ve_04
        self.qa_05 = qa_05
        self.va_05 = va_05
        self.qc_05 = qc_05
        self.vc_05 = vc_05
        self.qe_05 = qe_05
        self.ve_05 = ve_05
        self.qa_06 = qa_06
        self.va_06 = va_06
        self.qc_06 = qc_06
        self.vc_06 = vc_06
        self.qe_06 = qe_06
        self.ve_06 = ve_06
        self.qa_07 = qa_07
        self.va_07 = va_07
        self.qc_07 = qc_07
        self.vc_07 = vc_07
        self.qe_07 = qe_07
        self.ve_07 = ve_07
        self.qa_08 = qa_08
        self.va_08 = va_08
        self.qc_08 = qc_08
        self.vc_08 = vc_08
        self.qe_08 = qe_08
        self.ve_08 = ve_08
        self.qa_09 = qa_09
        self.va_09 = va_09
        self.qc_09 = qc_09
        self.vc_09 = vc_09
        self.qe_09 = qe_09
        self.ve_09 = ve_09
        self.qa_10 = qa_10
        self.va_10 = va_10
        self.qc_10 = qc_10
        self.vc_10 = vc_10
        self.qe_10 = qe_10
        self.ve_10 = ve_10
        self.qa_11 = qa_11
        self.va_11 = va_11
        self.qc_11 = qc_11
        self.vc_11 = vc_11
        self.qe_11 = qe_11
        self.ve_11 = ve_11
        self.qa_12 = qa_12
        self.va_12 = va_12
        self.qc_12 = qc_12
        self.vc_12 = vc_12
        self.qe_12 = qe_12
        self.ve_12 = ve_12
        self.lakefract = lakefract
        self.surfarea = surfarea
        self.rareahload = rareahload
        self.rpuid = rpuid
        self.vpuid = vpuid
        self.enabled = enabled
        self.keep_gaz_string = keep_gaz_string


'''
class Reach(Base):


    __tablename__ = "reaches"

    # Columns
    id = Column(Integer, primary_key=True)
    region_id = Column(Integer, ForeignKey("regions.id"))
    region = relationship("Region", back_populates="reach")
    geometry = Column(Geometry("LINESTRING"))
    OBJECTID = Column(String)
    FDATE = Column(String)
    GNIS_ID = Column(String)
    GNIS_NAME = Column(String)
    LENGTHKM = Column(Float)
    REACHCODE = Column(String)
    FCODE = Column(Integer)
    Shape_Length = Column(Float)
    RESOLUTION = Column(String)
    FLOWDIR = Column(String)
    FTYPE = Column(String)
    COMID = Column(Integer)
    WBAREACOMI = Column(Integer)
    StreamLeve = Column(Integer)
    StreamOrde = Column(Integer)
    StreamCalc = Column(Integer)
    FromNode = Column(Float)
    ToNode = Column(Float)
    Hydroseq = Column(Float)
    LevelPathI = Column(Float)
    Pathlength = Column(Float)
    TerminalPa = Column(Float)
    ArbolateSu = Column(Float)
    Divergence = Column(Integer)
    StartFlag = Column(Integer)
    TerminalFl = Column(Integer)
    DnLevel = Column(Integer)
    UpLevelPat = Column(Float)
    UpHydroseq = Column(Float)
    DnLevelPat = Column(Float)
    DnMinorHyd = Column(Float)
    DnDrainCou = Column(Integer)
    DnHydroseq = Column(Float)
    FromMeas = Column(Float)
    ToMeas = Column(Float)
    RtnDiv = Column(Integer)
    VPUIn = Column(Integer)
    VPUOut = Column(Integer)
    AreaSqKM = Column(Float)
    TotDASqKM = Column(Float)
    DivDASqKM = Column(Float)
    HWNodeSqKM = Column(Float)
    MAXELEVRAW = Column(Float)
    MINELEVRAW = Column(Float)
    MAXELEVSMO = Column(Float)
    MINELEVSMO = Column(Float)
    SLOPE = Column(Float)
    ELEVFIXED = Column(String)
    HWTYPE = Column(String)
    slopelenkm = Column(Float)
    qa_ma = Column(Float)
    va_ma = Column(Float)
    qc_ma = Column(Float)
    vc_ma = Column(Float)
    qe_ma = Column(Float)
    ve_ma = Column(Float)
    qa_01 = Column(Float)
    va_01 = Column(Float)
    qc_01 = Column(Float)
    vc_01 = Column(Float)
    qe_01 = Column(Float)
    ve_01 = Column(Float)
    QA_02 = Column(Float)
    VA_02 = Column(Float)
    QC_02 = Column(Float)
    VC_02 = Column(Float)
    QE_02 = Column(Float)
    VE_02 = Column(Float)
    QA_03 = Column(Float)
    VA_03 = Column(Float)
    QC_03 = Column(Float)
    VC_03 = Column(Float)
    QE_03 = Column(Float)
    VE_03 = Column(Float)
    QA_04 = Column(Float)
    VA_04 = Column(Float)
    QC_04 = Column(Float)
    VC_04 = Column(Float)
    QE_04 = Column(Float)
    VE_04 = Column(Float)
    QA_05 = Column(Float)
    VA_05 = Column(Float)
    QC_05 = Column(Float)
    VC_05 = Column(Float)
    QE_05 = Column(Float)
    VE_05 = Column(Float)
    QA_06 = Column(Float)
    VA_06 = Column(Float)
    QC_06 = Column(Float)
    VC_06 = Column(Float)
    QE_06 = Column(Float)
    VE_06 = Column(Float)
    QA_07 = Column(Float)
    VA_07 = Column(Float)
    QC_07 = Column(Float)
    VC_07 = Column(Float)
    QE_07 = Column(Float)
    VE_07 = Column(Float)
    QA_08 = Column(Float)
    VA_08 = Column(Float)
    QC_08 = Column(Float)
    VC_08 = Column(Float)
    QE_08 = Column(Float)
    VE_08 = Column(Float)
    QA_09 = Column(Float)
    VA_09 = Column(Float)
    QC_09 = Column(Float)
    VC_09 = Column(Float)
    QE_09 = Column(Float)
    VE_09 = Column(Float)
    QA_10 = Column(Float)
    VA_10 = Column(Float)
    QC_10 = Column(Float)
    VC_10 = Column(Float)
    QE_10 = Column(Float)
    VE_10 = Column(Float)
    QA_11 = Column(Float)
    VA_11 = Column(Float)
    QC_11 = Column(Float)
    VC_11 = Column(Float)
    QE_11 = Column(Float)
    VE_11 = Column(Float)
    QA_12 = Column(Float)
    VA_12 = Column(Float)
    QC_12 = Column(Float)
    VC_12 = Column(Float)
    QE_12 = Column(Float)
    VE_12 = Column(Float)
    RPUID = Column(String)
    VPUID = Column(String)
    Enabled = Column(Integer)
    keep_gaz_string = Column(String)

    def __init__(
        self,
        OBJECTID,
        FDATE,
        GNIS_ID,
        GNIS_NAME,
        LENGTHKM,
        REACHCODE,
        FCODE,
        Shape_Length,
        RESOLUTION,
        FLOWDIR,
        FTYPE,
        COMID,
        WBAREACOMI,
        StreamLeve,
        StreamOrde,
        StreamCalc,
        FromNode,
        ToNode,
        Hydroseq,
        LevelPathI,
        Pathlength,
        TerminalPa,
        ArbolateSu,
        Divergence,
        StartFlag,
        TerminalFl,
        DnLevel,
        UpLevelPat,
        UpHydroseq,
        DnLevelPat,
        DnMinorHyd,
        DnDrainCou,
        DnHydroseq,
        FromMeas,
        ToMeas,
        RtnDiv,
        VPUIn,
        VPUOut,
        AreaSqKM,
        TotDASqKM,
        DivDASqKM,
        HWNodeSqKM,
        MAXELEVRAW,
        MINELEVRAW,
        MAXELEVSMO,
        MINELEVSMO,
        SLOPE,
        ELEVFIXED,
        HWTYPE,
        slopelenkm,
        qa_ma,
        va_ma,
        qc_ma,
        vc_ma,
        qe_ma,
        ve_ma,
        qa_01,
        va_01,
        qc_01,
        vc_01,
        qe_01,
        ve_01,
        QA_02,
        VA_02,
        QC_02,
        VC_02,
        QE_02,
        VE_02,
        QA_03,
        VA_03,
        QC_03,
        VC_03,
        QE_03,
        VE_03,
        QA_04,
        VA_04,
        QC_04,
        VC_04,
        QE_04,
        VE_04,
        QA_05,
        VA_05,
        QC_05,
        VC_05,
        QE_05,
        VE_05,
        QA_06,
        VA_06,
        QC_06,
        VC_06,
        QE_06,
        VE_06,
        QA_07,
        VA_07,
        QC_07,
        VC_07,
        QE_07,
        VE_07,
        QA_08,
        VA_08,
        QC_08,
        VC_08,
        QE_08,
        VE_08,
        QA_09,
        VA_09,
        QC_09,
        VC_09,
        QE_09,
        VE_09,
        QA_10,
        VA_10,
        QC_10,
        VC_10,
        QE_10,
        VE_10,
        QA_11,
        VA_11,
        QC_11,
        VC_11,
        QE_11,
        VE_11,
        QA_12,
        VA_12,
        QC_12,
        VC_12,
        QE_12,
        VE_12,
        RPUID,
        VPUID,
        Enabled,
        keep_gaz_string,
    ):
        """
        Constructor
        """

        self.OBJECTID = OBJECTID
        self.FDATE = FDATE
        self.GNIS_ID = GNIS_ID
        self.GNIS_NAME = GNIS_NAME
        self.LENGTHKM = LENGTHKM
        self.REACHCODE = REACHCODE
        self.FCODE = FCODE
        self.Shape_Length = Shape_Length
        self.RESOLUTION = RESOLUTION
        self.FLOWDIR = RESOLUTION
        self.FTYPE = FTYPE
        self.COMID = COMID
        self.WBAREACOMI = WBAREACOMI
        self.StreamLeve = StreamLeve
        self.StreamOrde = StreamOrde
        self.StreamCalc = StreamCalc
        self.FromNode = FromNode
        self.ToNode = ToNode
        self.Hydroseq = Hydroseq
        self.LevelPathI = LevelPathI
        self.Pathlength = Pathlength
        self.TerminalPa = TerminalPa
        self.ArbolateSu = ArbolateSu
        self.Divergence = Divergence
        self.StartFlag = StartFlag
        self.TerminalFl = TerminalFl
        self.DnLevel = DnLevel
        self.UpLevelPat = UpLevelPat
        self.UpHydroseq = UpHydroseq
        self.DnLevelPat = DnLevelPat
        self.DnMinorHyd = DnMinorHyd
        self.DnDrainCou = DnDrainCou
        self.DnHydroseq = DnHydroseq
        self.FromMeas = FromMeas
        self.ToMeas = ToMeas
        self.RtnDiv = RtnDiv
        self.VPUIn = VPUIn
        self.VPUOut = VPUOut
        self.AreaSqKM = AreaSqKM
        self.TotDASqKM = TotDASqKM
        self.DivDASqKM = DivDASqKM
        self.HWNodeSqKM = HWNodeSqKM
        self.MAXELEVRAW = MAXELEVRAW
        self.MINELEVRAW = MINELEVRAW
        self.MAXELEVSMO = MAXELEVSMO
        self.MINELEVSMO = MINELEVSMO
        self.SLOPE = SLOPE
        self.ELEVFIXED = ELEVFIXED
        self.HWTYPE = HWTYPE
        self.slopelenkm = slopelenkm
        self.qa_ma = qa_ma
        self.va_ma = va_ma
        self.qc_ma = qc_ma
        self.vc_ma = vc_ma
        self.qe_ma = qe_ma
        self.ve_ma = ve_ma
        self.qa_01 = qa_01
        self.va_01 = va_01
        self.qc_01 = qc_01
        self.vc_01 = vc_01
        self.qe_01 = qe_01
        self.ve_01 = ve_01
        self.QA_02 = QA_02
        self.VA_02 = VA_02
        self.QC_02 = QC_02
        self.VC_02 = VC_02
        self.QE_02 = QE_02
        self.VE_02 = VE_02
        self.QA_03 = QA_03
        self.VA_03 = VA_03
        self.QC_03 = QC_03
        self.VC_03 = VC_03
        self.QE_03 = QE_03
        self.VE_03 = VE_03
        self.QA_04 = QA_04
        self.VA_04 = VA_04
        self.QC_04 = QC_04
        self.VC_04 = VC_04
        self.QE_04 = QE_04
        self.VE_04 = VE_04
        self.QA_05 = QA_05
        self.VA_05 = VA_05
        self.QC_05 = QC_05
        self.VC_05 = VC_05
        self.QE_05 = QE_05
        self.VE_05 = VE_05
        self.QA_06 = QA_06
        self.VA_06 = VA_06
        self.QC_06 = QC_06
        self.VC_06 = VC_06
        self.QE_06 = QE_06
        self.VE_06 = VE_06
        self.QA_07 = QA_07
        self.VA_07 = VA_07
        self.QC_07 = QC_07
        self.VC_07 = VC_07
        self.QE_07 = QE_07
        self.VE_07 = VE_07
        self.QA_08 = QA_08
        self.VA_08 = VA_08
        self.QC_08 = QC_08
        self.VC_08 = VC_08
        self.QE_08 = QE_08
        self.VE_08 = VE_08
        self.QA_09 = QA_09
        self.VA_09 = VA_09
        self.QC_09 = QC_09
        self.VC_09 = VC_09
        self.QE_09 = QE_09
        self.VE_09 = VE_09
        self.QA_10 = QA_10
        self.VA_10 = VA_10
        self.QC_10 = QC_10
        self.VC_10 = VC_10
        self.QE_10 = QE_10
        self.VE_10 = VE_10
        self.QA_11 = QA_11
        self.VA_11 = VA_11
        self.QC_11 = QC_11
        self.VC_11 = VC_11
        self.QE_11 = QE_11
        self.VE_11 = VE_11
        self.QA_12 = QA_12
        self.VA_12 = VA_12
        self.QC_12 = QC_12
        self.VC_12 = VC_12
        self.QE_12 = QE_12
        self.VE_12 = VE_12
        self.RPUID = RPUID
        self.VPUID = VPUID
        self.Enabled = Enabled
        self.keep_gaz_string = keep_gaz_string



'''
