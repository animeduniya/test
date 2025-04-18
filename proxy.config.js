export const proxyConfig = {
  '/api': {
    target: 'https://opapi-lyart.vercel.app',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api'
    }
  },
  '/proxy-image': {
    target: 'https://opapi-lyart.vercel.app',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/proxy-image': ''
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
    }
  }
}; 