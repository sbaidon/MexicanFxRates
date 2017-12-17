<template>
  <div id="app">
    <Chart :chartValues="chartValues"></Chart>
  </div>
</template>

<script>
import Chart from './components/Chart';
import api from './api';

export default {
  name: 'app',
  data() {
    return {
      firstYearInRecord: 2008,
      chartValues: {},
      currencies: ['GBP', 'JPY', 'USD', 'EUR']
    };
  },
  components: {
    Chart
  },
  async created() {
    const responses = await Promise.all(this.getYearlyRates());
    const xValues = responses.map(response => response.data.date);
    const valuesByCurrency = this.getValuesByCurrency(
      responses.map(response => response.data.rates)
    );
    const yValues = Object.keys(valuesByCurrency).map(
      currency => valuesByCurrency[currency]
    );
    this.chartValues = { xValues, yValues };
  },
  methods: {
    getYearlyRates() {
      const end = this.getCurrentYear();
      const years = [];
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let start = this.firstYearInRecord; start <= end; start++) {
        years.push(start);
      }
      return years.map(year => api.getRatesByDate(`${year}-12-31`));
    },
    getCurrentYear() {
      return new Date().getFullYear();
    },
    getValuesByCurrency(ratesList) {
      return ratesList.reduce((obj, rates) => {
        const currencies = Object.keys(rates);
        currencies.forEach(currency => {
          if (!obj.hasOwnProperty(currency)) {
            obj[currency] = [currency];
          }
          obj[currency].push(rates[currency]);
        });
        return obj;
      }, {});
    }
  }
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
