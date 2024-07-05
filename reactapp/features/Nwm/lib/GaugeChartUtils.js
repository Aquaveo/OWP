class NWMGaugeChart{
    constructor(){
        this.legendObject = new NWMGaugeLegend();
    }

    initializeChart(containerId, title, subtitle){
        // //console.log(containerId,data, onClickLegend);
        const root = am5.Root.new(containerId);
        root.setThemes([am5themes_Animated.new(root)]);
        
        // Create chart
        const chart = root.container.children.push(am5xy.XYChart.new(root, {
          panX: true,
          panY: true,
          wheelX: 'panX',
          wheelY: 'zoomX',
          pinchZoomX:true,
          layout: root.verticalLayout
        }));
      
        // Create axes
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
            renderer: am5xy.AxisRendererY.new(root, {pan:"zoom"}),
            tooltip: am5.Tooltip.new(root, {})
          })
        );
      
        yAxis.children.unshift(am5.Label.new(root, {
          text: 'Flow (kcfs)',
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
    
        //Today date line
        var rangeDataItem = xAxis.makeDataItem({
          value: new Date().setHours(20),
          above: false
        });
    
        var range = xAxis.createAxisRange(rangeDataItem);
        
        rangeDataItem.get("grid").set("visible", true);
        
        range.get("grid").setAll({
          stroke: '#88d318',
          strokeOpacity: 1,
          strokeWidth:2,
          width: 40,
          location: 1
        });
      
        // Add scrollbar
        // https://www.amcharts.com/docs/v5/charts/xy-chart/scrollbars/
        chart.set("scrollbarX", am5.Scrollbar.new(root, {
          orientation: "horizontal",
          
        }));
      
        // Add cursor
        var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
        cursor.lineX.set("forceHidden", true);
        cursor.lineY.set("forceHidden", true);
      
      
        chart.events.on("datavalidated", function(ev) {
          // Get objects of interest
          var chart = ev.target;
          var categoryAxis = chart.yAxes.getIndex(0);
        
          // Calculate how we need to adjust chart height
          var adjustHeight = chart.data.length * cellSize - categoryAxis.pixelHeight;
        
          // get current chart height
          var targetHeight = chart.pixelHeight + adjustHeight;
        
          // Set it on chart's container
          chart.svgContainer.htmlElement.style.height = targetHeight + "px";
        });
          
        // add title and subtitle
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

    handleUpdate(gaugeDataType, chartRef, nwmGuageData, legendContainerRef, toggleSeries) {
        if (chartRef.current && nwmGuageData) {
            this._updateSeries(chartRef.current, nwmGuageData.gauges[gaugeDataType],legendContainerRef,toggleSeries);
        }
    };

    _updateSeries (chart,seriesItem,legendContainerRef,toggleSeries){
        const series = chart.series.values.find(s => s.get('name') === seriesItem['name']);
      
        var tooltip = am5.Tooltip.new(chart.root, {
          labelText: `${seriesItem['tooltip_text']}: {valueY}`
        })
        
        // if we have data in the gauge data (observed/forecasted) then create the series, and added it to the legend.
        if(seriesItem.data.length > 0){
          if (!series) {
            const series = chart.series.push(am5xy.LineSeries.new(chart.root, {
              name: seriesItem.name_product,
              xAxis: chart.xAxes.values[0],
              yAxis: chart.yAxes.values[0],
              valueYField: "secondary",
              valueXField: "validTime",
              stroke: am5.color(seriesItem.color),
              fill: am5.color(seriesItem.color),
              maxDeviation:1,
              tooltip: tooltip,
              legendLabelText: `[{stroke}]${seriesItem['tooltip_text']}[/]`,
              legendRangeLabelText: `[{stroke}]${seriesItem['tooltip_text']}[/]`,
            }));
        
            this._defineSeries(seriesItem,series)
            // chart.children.values[chart.children.values.length-1].data.push(series)
            this._createOrAddLegend(legendContainerRef,chart.root,chart, toggleSeries,series)
          }
          // if the product data is already in the chart, then update the data and show or hide the serie.
          else{
            this._defineSeries(seriesItem,series)
          }
        }
        this._makeExportData(chart)
      
      }


    _createOrAddLegend(legendContainerRef,root,chart,toggleSeries,series ){      
        // Determine the legend name based on the product name.
        let nameLegend = 'Gauge Streamflow Data';
      
        const legend = legendContainerRef.children.values.find(s => s.get('name','').includes(nameLegend) || s.get('name','') === nameLegend);
      
        if(legend){
          legend.data.push(series)
        }
        else{
          let new_legend = this.legendObject.createIndividualLegend(legendContainerRef, root, chart,nameLegend,toggleSeries)
          new_legend.data.push(series)
        }
    }


    _makeExportData(chart){
        var seriesData = [];
        chart.series.each(function (s) {
          for (var i = 0; i < s.dataItems.length; i++) {
            var dataItem = s.dataItems[i];
            var seriesName = s.get('name');
            const date = new Date(dataItem.get('valueX'));
            // Get the date string in the desired format (YYYY-MM-DD HH:MM:SS)
            const dateString = date.toISOString().slice(0, 19).replace('T', ' ');
            var dataItemObject = {};
            dataItemObject['time'] = dateString,
            dataItemObject[seriesName] = dataItem.get('valueY'),
            seriesData.push(dataItemObject);
          }
        });
        // Create an object to store the merged values
        const mergedData = {};
      
        // Iterate through the data array
        seriesData.forEach((item) => {
          const { dataTime, ...values } = item;
      
          if (!mergedData[dataTime]) {
            mergedData[dataTime] = { dataTime, ...values };
          } else {
            mergedData[dataTime] = { dataTime, ...mergedData[dataTime], ...values };
          }
        });
      
        // Convert the mergedData object back to an array
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


    createLegendContainer(root,chart){
        return this.legendObject.createLegendContainer(root,chart)
    }
    initializeLegend(root,chart,onClick){
        return this.legendObject.initializeLegend(root,chart,onClick)
    }
    getLegendContainer(){
        return this.legendObject.getLegendRef();
    }
    
}

class NWMGaugeLegend{
    constructor(){
     this.legendRef = null;
    }   
   
   _onPointerOver(event,chart){
     var itemContainer = event.target;
     // As series list is data of a legend, dataContext is series
     var currentSeries = itemContainer.dataItem.dataContext;
   
     chart.series.each(function(chartSeries) {
       if (chartSeries != currentSeries) {
         chartSeries.strokes.template.setAll({
           strokeOpacity: 0.5,
         });
       } else {
         chartSeries.strokes.template.setAll({
           strokeWidth: 3,
   
         });
       }
     })
   }
   
   _onPointerOut(event,chart){
     // As series list is data of a legend, dataContext is series
     chart.series.each(function(chartSeries) {
       let strokeWidth = 1
       if(chartSeries.get('name').includes("forecast")){
         strokeWidth = 2
       }
       chartSeries.strokes.template.setAll({
         strokeOpacity: 1,
         strokeWidth: strokeWidth,
       });
     });
   }
 
   initializeLegend(root,chart,onClick){
     // create legend container ref
     this._createLegendContainer(root,chart)
     // create legend
     
     var legend = chart.children.push(am5.Legend.new(root, {
       width: am5.percent(100),
       centerY: am5.percent(50),
       useDefaultMarker: true,
       centerX: am5.percent(50),
       x: am5.percent(50),
       layout: am5.GridLayout.new(root, {
         maxColumns: 7,
         fixedWidthGrid: true
       })
   
     }));
     legend.markerRectangles.template.setAll({});
   
     // When legend item container is hovered, dim all the series except the hovered one
     legend.itemContainers.template.events.on("pointerover", function(e) {
       this._onPointerOver(e,chart);
     })
   
     // When legend item container is unhovered, make all series as they are
     legend.itemContainers.template.events.on("pointerout", function(e) {
       this.onPointerOut(e,chart);
     })
   
     legend.itemContainers.template.events.on("click", function(e) {
       var targetSeries = e.target.dataItem.dataContext;
       var name_series = targetSeries.get('name');
       onClick(name_series);
     });
   
     legend.data.setAll(chart.series.values);
   
     return legend
   }
 
   getLegendRef(){
     return this.legendRef;
   }
 
   _createLegendContainer(root,chart){
     
     let legendContainer = chart.children.push(am5.Container.new(root, {
       layout: am5.GridLayout.new(root, {
         maxColumns: 3,
         fixedWidthGrid: true
       })
     
     }));
     this.legendRef = legendContainer;
   }
 
   createIndividualLegend(
     legendContainer,
     root,
     chart,
     heading,
     onClick
   ){
       //create label
       legendContainer.children.push(am5.Label.new(root, {
         text: heading,
         fontWeight: "bold",
       }));
 
       // create legend
       var legend = legendContainer.children.push(am5.Legend.new(root, {
         width: am5.percent(100),
         useDefaultMarker: true,
         layout: root.horizontalLayout
       }));
       legend.set('name',heading)
 
       legend.markerRectangles.template.setAll({});
     
       // When legend item container is hovered, dim all the series except the hovered one
       legend.itemContainers.template.events.on("pointerover", function(e) {
         onPointerOver(e,chart);
       })
     
       // When legend item container is unhovered, make all series as they are
       legend.itemContainers.template.events.on("pointerout", function(e) {
         onPointerOut(e,chart);
       })
     
       legend.itemContainers.template.events.on("click", function(e) {
         var targetSeries = e.target.dataItem.dataContext;
         var name_series = targetSeries.get('name');
         onClick(name_series);
       });
         
       return legend
   }
 }



export {NWMGaugeChart, NWMGaugeLegend}