export const proxyConfig = {
  '/api': {
    target: 'https://opapi-lyart.vercel.app',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api'
    }
  },
  '/images': {
    target: 'https://wsrv.nl',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/images': ''
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  }
}; 