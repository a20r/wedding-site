const BASE_URL = process.env.BASE_URL || '';

const siteData = {
  BASE_URL,
  build: {
    timestamp: new Date().toISOString()
  }
};

export default siteData;
