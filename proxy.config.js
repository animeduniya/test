export const proxyConfig = {
  '/api': {
    target: 'https://opapi-lyart.vercel.app',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api'
    }
  }
}; 