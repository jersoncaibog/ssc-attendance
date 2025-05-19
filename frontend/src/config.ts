interface Config {
  API_BASE_URL: string;
  SOCKET_URL: string;
}

const config: Config = {
  API_BASE_URL: 'http://192.168.1.11:5000/api',
  SOCKET_URL: 'http://192.168.1.11:5000'
};

export default config; 