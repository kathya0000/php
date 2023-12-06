const PROXY_CONFIG = {
  '/api/*': {
    target: 'http://127.0.0.1:8000',
    secure: false,
    pathRewrite: {
      '^/api': '/api',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/storage/*': {
    target: 'http://127.0.0.1:8000',
    secure: false,
    pathRewrite: {
      '^/storage': '/storage',
    },
    changeOrigin: true,
    logLevel: 'debug',
  },
};

module.exports = PROXY_CONFIG;
