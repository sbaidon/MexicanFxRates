<template>
<div>
  <div id="chart">
  </div>
</div>
</template>

<script>
import c3 from 'c3';

export default {
  name: 'Chart',
  props: ['chartValues'],
  data() {
    return {};
  },
  watch: {
    chartValues() {
      this.drawChart(this.chartValues.xValues, this.chartValues.yValues);
    }
  },
  methods: {
    drawChart(xValues, yValues) {
      c3.generate({
        bindto: '#chart',
        data: {
          x: 'x',
          columns: [['x', ...xValues], ...yValues]
        },
        axis: {
          x: {
            type: 'timeseries',
            tick: {
              format: '%Y-%m-%d'
            }
          }
        }
      });
    }
  }
};
</script>

<style scoped>

</style>
