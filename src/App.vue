<template>
  <div id="app">
    <Chart :chartValues="chartValues"></Chart>
    <select v-model="selectYear">
      <option value="All years">All Years</option>
      <option v-once v-for="(value, index) in years" :key="index" :value="value">{{ value }}</option>
    </select>
  </div>
</template>

<script>
import Chart from './components/Chart';
import api from './api';

export default {
  name: 'app',
  components: {
    Chart
  },
  data() {
    return {
      firstYearInRecord: 2008,
      currencies: ['GBP', 'USD', 'EUR'],
      selectYear: 'All years',
      rates: [],
      years: []
    };
  },
  async created() {
    this.rates = await this.getYearlyRates();
  },
  watch: {
    async selectYear(year) {
      if (year === 'All years') {
        this.rates = await this.getYearlyRates();
        return;
      }
      this.rates = await this.getMonthlyRates(year);
    }
  },
  computed: {
    xValues() {
      return this.rates.map(rates => rates.date);
    },
    yValues() {
      return Object.keys(this.valuesByCurrency).map(
        currency => this.valuesByCurrency[currency]
      );
    },
    valuesByCurrency() {
      return this.rates.map(rate => rate.rates).reduce((obj, rates) => {
        const currencies = this.currencies;
        currencies.forEach(currency => {
          if (!obj.hasOwnProperty(currency)) {
            obj[currency] = [currency];
          }
          obj[currency].push(rates[currency]);
        });
        return obj;
      }, {});
    },
    chartValues() {
      return { xValues: this.xValues, yValues: this.yValues };
    }
  },
  methods: {
    async getYearlyRates() {
      const end = this.getCurrentYear();
      this.years = [];
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let start = this.firstYearInRecord; start <= end; start++) {
        this.years.push(start);
      }
      const responses = await Promise.all(
        this.years.map(year => api.getRatesByDate(`${year}-12-31`))
      );
      return responses.map(response => response.data);
    },
    async getMonthlyRates(year) {
      const months = [
        '01',
        '02',
        '03',
        '04',
        '05',
        '06',
        '07',
        '08',
        '09',
        '10',
        '11',
        '12'
      ];
      const responses = await Promise.all(
        months.map(month => api.getRatesByDate(`${year}-${month}-15`))
      );
      return responses.map(response => response.data);
    },
    getCurrentYear() {
      return new Date().getFullYear();
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
