interface Config {
  API_BASE_URL: string;
}

// Get the current hostname and protocol
const getBaseUrl = () => {
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;

  // Production
  if (hostname === 'ssc-attendance-sigma.vercel.app') {
    return 'https://ssc-attendance-sigma.vercel.app/api';
  }

  // Development environment
  return `${protocol}//${hostname}:5000/api`;
};

const config: Config = {
  API_BASE_URL: getBaseUrl(),
};

export default config; 