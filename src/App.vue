<template>
  <div id="app">
    <Chart :chartValues="chartValues"></Chart>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Years</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select v-model="selectYear">
                <option value="All years">All Years</option>
                <option v-once v-for="(value, index) in years" :key="index" :value="value">{{ value }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="field is-horizontal">
      <div class="field-label is-normal">
        <label class="label">Months</label>
      </div>
      <div class="field-body">
        <div class="field is-narrow">
          <div class="control">
            <div class="select is-fullwidth">
              <select name="months" v-model="selectMonth" :disabled="isAllYearsSelected">
                <option value="">Select a Month</option>
                <option v-for="(value, index) in months" :key="index" :value="value"> {{ value }}</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

<div class="field is-horizontal">
  <div class="field-label is-normal">
      <label class="label">Currencies</label>
   </div>
  <div class="field-body">
    <div class="field is-narrow">
      <label class="label checkbox" v-for="(currency, index) in allCurrencies" :key="index">
        <input type="checkbox" :value="currency" v-model="currencies">
        {{ currency }}
      </label>
    </div>
  </div>
</div>


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
      allCurrencies: ['GBP', 'USD', 'EUR', 'AUD', 'JPY', 'CAD'],
      currencies: ['GBP', 'USD', 'EUR'],
      selectYear: 'All years',
      selectMonth: '',
      rates: [],
      years: [],
      months: [
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
      ]
    };
  },
  async created() {
    this.rates = await this.getYearlyRates();
  },
  watch: {
    async selectYear(year) {
      if (this.isAllYearsSelected) {
        this.rates = await this.getYearlyRates().catch(this.handleError);
        return;
      }
      this.rates = await this.getMonthlyRates(year).catch(this.handleError);
    },
    async selectMonth(month) {
      if (month === '') return;

      this.rates = await this.getDailyRates(this.selectYear, month).catch(
        this.handleError
      );
    }
  },
  computed: {
    isAllYearsSelected() {
      return this.selectYear === 'All years';
    },
    xValues() {
      if (!this.rates) return [];

      return this.rates.map(rate => rate.date);
    },
    yValues() {
      return Object.keys(this.valuesByCurrency).map(
        currency => this.valuesByCurrency[currency]
      );
    },
    valuesByCurrency() {
      if (!this.rates) return {};

      const currencies = this.currencies;
      return this.rates.map(rate => rate.rates).reduce((obj, rates) => {
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
    },
    days() {
      const days = [];
      for (let i = 1; i < 10; i++) {
        days.push(`0${i.toString()}`);
      }

      for (let i = 10; i <= 31; i++) {
        days.push(i.toString());
      }
      return days;
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
      const responses = await Promise.all(
        this.months.map(month => api.getRatesByDate(`${year}-${month}-15`))
      );
      return responses.map(response => response.data);
    },
    async getDailyRates(year, month) {
      const responses = await Promise.all(
        this.days.map(day => api.getRatesByDate(`${year}-${month}-${day}`))
      );
      return responses.map(response => response.data);
    },
    getCurrentYear() {
      return new Date().getFullYear();
    },
    handleError() {
      this.selectMonth = '';
      this.selectYear = 'All years';
    },
    isSelectedCurrency(currency) {
      return this.currencies.includes(currency);
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
