import axios from 'axios';

const BaseUrl = 'https://api.fixer.io';

export default {
  getRatesByDate(date) {
    return axios.get(`${BaseUrl}/${date}?base=MXN`);
  }
};
