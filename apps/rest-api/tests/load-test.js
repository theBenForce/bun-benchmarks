import http from 'k6/http';

const PORT = 3000;
const URL = `http://${__ENV.MY_HOSTNAME}:${PORT}`;

export const options = {
  vus: 1,
  duration: '1m'
};

export default () => {
  http.get(URL);
};