<template>
<div id="app">

  <div class="notification" v-if="notification">
    <button class="delete" @click="notification = ''"></button>
    {{ notification }}
  </div>

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
          <input type="checkbox" :value="currency" v-model="currencies"> {{ currency }}
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
      notification: '',
      rates: []
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
    firstTen() {
      const firstTen = [];
      for (let i = 1; i < 10; i++) {
        firstTen.push(`0${i.toString()}`);
      }
      return firstTen;
    },
    days() {
      const days = [...this.firstTen];
      for (let i = 10; i <= 31; i++) {
        days.push(i.toString());
      }
      return days;
    },
    months() {
      const months = [...this.firstTen];
      months.push('10');
      months.push('11');
      months.push('12');
      return months;
    },
    years() {
      const end = this.getCurrentYear();
      const years = [];
      /* eslint no-plusplus: ["error", { "allowForLoopAfterthoughts": true }] */
      for (let start = this.firstYearInRecord; start <= end; start++) {
        years.push(start);
      }
      return years;
    }
  },
  methods: {
    async getYearlyRates() {
      const yearlyRates = this.retrieve('yearlyRates');
      if (yearlyRates) {
        return yearlyRates;
      }

      const responses = await Promise.all(
        this.years.map(year => api.getRatesByDate(`${year}-12-31`))
      );
      const data = responses.map(response => response.data);
      this.store('yearlyRates', data);
      return data;
    },
    async getMonthlyRates(year) {
      const monthlyRates = this.retrieve(year);
      if (monthlyRates) {
        return monthlyRates;
      }

      const responses = await Promise.all(
        this.months.map(month => api.getRatesByDate(`${year}-${month}-15`))
      );
      const data = responses.map(response => response.data);
      this.store(year, data);
      return data;
    },
    async getDailyRates(year, month) {
      const dailyRates = this.retrieve(`${year}-${month}`);
      if (dailyRates) {
        return dailyRates;
      }

      const responses = await Promise.all(
        this.days.map(day => api.getRatesByDate(`${year}-${month}-${day}`))
      );
      const data = responses.map(response => response.data);
      this.store(`${year}-${month}`);
      return data;
    },
    retrieve(key) {
      return JSON.parse(localStorage.getItem(key));
    },
    store(key, item) {
      localStorage.setItem(key, JSON.stringify(item));
    },
    getCurrentYear() {
      return new Date().getFullYear();
    },
    handleError(error) {
      this.selectMonth = '';
      this.selectYear = 'All years';
      this.setNotification(
        `There was a ${error.message}, therefore there is missing data, please select another date`
      );
    },
    setNotification(message) {
      this.notification = message;
      this.timeout = setTimeout(() => {
        this.notification = '';
        clearTimeout(this.timeout);
      }, 5000);
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
