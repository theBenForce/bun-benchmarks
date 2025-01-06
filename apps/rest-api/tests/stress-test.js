import http from 'k6/http';
import { sleep } from 'k6';

const PORT = 3000;
const URL = `http://${__ENV.MY_HOSTNAME}:${PORT}`;

export const options = {
  stages: [
    { duration: '1m', target: 200 },
    { duration: '1m', target: 1000 },
    { duration: '2m', target: 1000 },
    { duration: '1m', target: 0 },
  ],
  noConnectionReuse: true,
};

export default () => {
  http.get(URL);
  sleep(1); // Wait for 1 second
};