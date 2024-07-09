class BaseLegendUtils {
  constructor() {
    this.legend = {};
  }

  getLegend() {
    return this.legend;
  }

  setLegend(legend) {
    this.legend = legend;
  }

  getLegendItem(key) {
    return this.legend[key];
  }

  setLegendItem(key, value) {
    this.legend[key] = value;
  }


}
class BaseChartUtils {
  constructor() {
    this.chart = {};
  }

  getChart() {
    return this.chart;
  }

  setChart(chart) {
    this.chart = chart;
  }
}

export {BaseLegendUtils, BaseChartUtils}