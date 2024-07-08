import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
import * as am5plugins_exporting from "@amcharts/amcharts5/plugins/exporting";
import {nwmActionsTypes} from "../store/actions/actionsTypes";
class NWMReachChart {
  constructor() {
    this.legendObject = new NWMReachLegend();
    this.forecastNames = [
      'reach_analysis_assimilation',
      'reach_short_range',
      'reach_medium_range_ensemble_mean',
      'reach_medium_range_ensemble_member_1',
      'reach_medium_range_ensemble_member_2',
      'reach_medium_range_ensemble_member_3',
      'reach_medium_range_ensemble_member_4',
      'reach_medium_range_ensemble_member_5',
      'reach_medium_range_ensemble_member_6',
      'reach_medium_range_blend',
      'reach_long_range_ensemble_mean',
      'reach_long_range_ensemble_member_2',
      'reach_long_range_ensemble_member_2',
      'reach_long_range_ensemble_member_3',
      'reach_long_range_ensemble_member_4',
    ];
  }

  getforecastNames() {
    return this.forecastNames;
  }

  handleUpdate(forecastName, chartRef, nwmReachData, legendContainerRef, toggleSeries) {
    if (chartRef.current && nwmReachData.products[forecastName]) {
      this._updateSeries(chartRef.current, nwmReachData.products[forecastName], legendContainerRef, toggleSeries);
    }
  };

  initializeChart(containerId, title, subtitle) {
    const root = am5.Root.new(containerId);
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(am5xy.XYChart.new(root, {
      panX: true,
      panY: true,
      wheelX: 'panX',
      wheelY: 'zoomX',
      pinchZoomX: true,
      layout: root.verticalLayout
    }));

    let xAxis = chart.xAxes.push(
      am5xy.DateAxis.new(root, {
        baseInterval: { timeUnit: "hour", count: 1 },
        renderer: am5xy.AxisRendererX.new(root, {}),
        tooltip: am5.Tooltip.new(root, {}),
        tooltipDateFormat: "MM/dd HH:mm"
      })
    );
    let yAxis = chart.yAxes.push(
      am5xy.ValueAxis.new(root, {
        renderer: am5xy.AxisRendererY.new(root, { pan: "zoom" }),
        tooltip: am5.Tooltip.new(root, {})
      })
    );

    yAxis.children.unshift(am5.Label.new(root, {
      text: 'Flow (CFS)',
      textAlign: 'center',
      y: am5.p50,
      rotation: -90,
      fontWeight: 'bold'
    }));

    xAxis.children.push(am5.Label.new(root, {
      text: 'Date',
      textAlign: 'center',
      x: am5.p50,
      fontWeight: 'bold'
    }));

    var rangeDataItem = xAxis.makeDataItem({
      value: new Date().setHours(20),
      above: false
    });

    var range = xAxis.createAxisRange(rangeDataItem);

    rangeDataItem.get("grid").set("visible", true);

    range.get("grid").setAll({
      stroke: '#88d318',
      strokeOpacity: 1,
      strokeWidth: 2,
      width: 40,
      location: 1
    });

    chart.set("scrollbarX", am5.Scrollbar.new(root, {
      orientation: "horizontal",
    }));

    var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineX.set("forceHidden", true);
    cursor.lineY.set("forceHidden", true);

    chart.events.on("datavalidated", function (ev) {
      var chart = ev.target;
      var categoryAxis = chart.yAxes.getIndex(0);

      var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
      var targetHeight = chart.pixelHeight + adjustHeight;

      chart.svgContainer.htmlElement.style.height = targetHeight + "px";
    });

    chart.children.unshift(am5.Label.new(root, {
      text: subtitle,
      fontSize: 14,
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50)
    }));

    chart.children.unshift(am5.Label.new(root, {
      text: title,
      fontSize: 25,
      fontWeight: "500",
      textAlign: "center",
      x: am5.percent(50),
      centerX: am5.percent(50),
      paddingTop: 0,
      paddingBottom: 0
    }));

    return chart;
  };

  _defineSeries(item, series) {
    if (item.is_visible) {
      if (series) {
        series.data.setAll(item.data);

        series.show();
        series.strokes.template.setAll({
          strokeWidth: 2
        });
      }
    } else {
      if (series) {
        series.hide();
        series.data.setAll([]);
      }
    }
  }

  _createOrAddLegend(legendContainerRef, root, chart, seriesItem, toggleSeries, series) {
    let nameLegend;
    
    if ([nwmActionsTypes.reach_analysis_assimilation, nwmActionsTypes.reach_short_range, nwmActionsTypes.reach_medium_range_blend].includes(seriesItem.name_product)) {
      nameLegend = 'National Water Model';
    } else {
      nameLegend = `${seriesItem.name_product.split('_')[0][0].toUpperCase() + seriesItem.name_product.split('_')[0].slice(1)} Range Ensembles`;
    }

    const legend = legendContainerRef.children.values.find(s => s.get('name', '').includes(nameLegend) || s.get('name', '') === nameLegend);

    if (legend) {
      legend.data.push(series)
    } else {
      let new_legend = this.legendObject.createIndividualLegend(legendContainerRef, root, chart, nameLegend, toggleSeries)
      new_legend.data.push(series)
    }
  }

  _updateSeries(chart, seriesItem, legendContainerRef, toggleSeries) {
    const series = chart.series.values.find(s => s.get('name') === seriesItem.name_product);

    var tooltip = am5.Tooltip.new(chart.root, {
      labelText: `${seriesItem['tooltip_text']}: {valueY}`
    })

    if (seriesItem.data.length > 0) {
      if (!series) {
        const series = chart.series.push(am5xy.LineSeries.new(chart.root, {
          name: seriesItem.name_product,
          xAxis: chart.xAxes.values[0],
          yAxis: chart.yAxes.values[0],
          valueYField: "value",
          valueXField: "forecast-time",
          stroke: am5.color(seriesItem.color),
          fill: am5.color(seriesItem.color),
          maxDeviation: 1,
          tooltip: tooltip,
          legendLabelText: `[{stroke}]${seriesItem['tooltip_text']}[/]`,
          legendRangeLabelText: `[{stroke}]${seriesItem['tooltip_text']}[/]`,
        }));

        this._defineSeries(seriesItem, series)
        this._createOrAddLegend(legendContainerRef, chart.root, chart, seriesItem, toggleSeries, series)
      } else {
        this._defineSeries(seriesItem, series)
      }
    }
    this._makeExportData(chart)
  }

  _makeExportData(chart) {
    var seriesData = [];
    chart.series.each(function (s) {
      for (var i = 0; i < s.dataItems.length; i++) {
        var dataItem = s.dataItems[i];
        var seriesName = s.get('name');
        const date = new Date(dataItem.get('valueX'));
        const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
        var dataItemObject = {};
        dataItemObject['forecastTime'] = dateString,
        dataItemObject[seriesName] = dataItem.get('valueY'),
        seriesData.push(dataItemObject);
      }
    });

    const mergedData = {};

    seriesData.forEach((item) => {
      const { forecastTime, ...values } = item;

      if (!mergedData[forecastTime]) {
        mergedData[forecastTime] = { forecastTime, ...values };
      } else {
        mergedData[forecastTime] = { forecastTime, ...mergedData[forecastTime], ...values };
      }
    });

    const mergedDataArray = Object.values(mergedData);

    var exporting = am5plugins_exporting.Exporting.new(chart.root, {
      menu: am5plugins_exporting.ExportingMenu.new(chart.root, {}),
      dataSource: mergedDataArray
    });
    var annotator = am5plugins_exporting.Annotator.new(chart.root, {});

    var menuitems = exporting.get("menu").get("items");

    menuitems.push({
      type: "separator"
    });

    menuitems.push({
      type: "custom",
      label: "Annotate",
      callback: function () {
        this.close();
        annotator.toggle();
      }
    });
  }

  createLegendContainer(root, chart) {
    return this.legendObject.createLegendContainer(root, chart)
  }
  initializeLegend(root, chart, onClick) {
    return this.legendObject.initializeLegend(root, chart, onClick)
  }
  getLegendContainer() {
    return this.legendObject.getLegendRef();
  }
}

class NWMReachLegend {
  constructor() {
    this.legendRef = null;
    // Bind methods to the class instance
    this._onPointerOver = this._onPointerOver.bind(this);
    this._onPointerOut = this._onPointerOut.bind(this);
  }

  _onPointerOver(event, chart) {
    var itemContainer = event.target;
    var currentSeries = itemContainer.dataItem.dataContext;

    chart.series.each(function (chartSeries) {
      if (chartSeries != currentSeries) {
        chartSeries.strokes.template.setAll({
          strokeOpacity: 0.5,
        });
      } else {
        chartSeries.strokes.template.setAll({
          strokeWidth: 3,
        });
      }
    });
  }

  _onPointerOut(event, chart) {
    chart.series.each(function (chartSeries) {
      let strokeWidth = 1;
      if (chartSeries.get('name').includes("mean") || chartSeries.get('name') === "analysis_assimilation" || chartSeries.get('name') === "short_range") {
        strokeWidth = 2;
      }
      chartSeries.strokes.template.setAll({
        strokeOpacity: 1,
        strokeWidth: strokeWidth,
      });
    });
  }

  initializeLegend(root, chart, onClick) {
    this._createLegendContainer(root, chart);

    var legend = chart.children.push(am5.Legend.new(root, {
      width: am5.percent(100),
      centerY: am5.percent(50),
      useDefaultMarker: true,
      centerX: am5.percent(50),
      x: am5.percent(50),
      layout: root.horizontalLayout
    }));
    legend.markerRectangles.template.setAll({});

    legend.itemContainers.template.events.on("pointerover", (e) => this._onPointerOver(e, chart));
    legend.itemContainers.template.events.on("pointerout", (e) => this._onPointerOut(e, chart));
    legend.itemContainers.template.events.on("click", (e) => {
      var targetSeries = e.target.dataItem.dataContext;
      var name_series = targetSeries.get('name');
      onClick(name_series);
    });

    legend.data.setAll(chart.series.values);

    return legend;
  }

  getLegendRef() {
    return this.legendRef;
  }

  _createLegendContainer(root, chart) {
    let legendContainer = chart.children.push(am5.Container.new(root, {
      width: am5.percent(100),
      layout: am5.GridLayout.new(root, {
        maxColumns: 1,
        fixedWidthGrid: true
      })
    }));
    this.legendRef = legendContainer;
  }

  createIndividualLegend(legendContainer, root, chart, heading, onClick) {
    legendContainer.children.push(am5.Label.new(root, {
      text: heading,
      fontWeight: "bold",
    }));

    var legend = legendContainer.children.push(am5.Legend.new(root, {
      width: am5.percent(100),
      useDefaultMarker: true,
      layout: am5.GridLayout.new(root, {
        maxColumns: 7,
        fixedWidthGrid: true
      })
      // layout: root.horizontalLayout
    }));
    legend.set('name', heading);

    legend.markerRectangles.template.setAll({});

    legend.itemContainers.template.events.on("pointerover", (e) => this._onPointerOver(e, chart));
    legend.itemContainers.template.events.on("pointerout", (e) => this._onPointerOut(e, chart));
    legend.itemContainers.template.events.on("click", (e) => {
      var targetSeries = e.target.dataItem.dataContext;
      var name_series = targetSeries.get('name');
      onClick(name_series);
    });

    return legend;
  }
}

export { NWMReachChart };
