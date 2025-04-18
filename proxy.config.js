module.exports = {
  '/api': {
    target: 'https://opapi-lyart.vercel.app',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/api': '/api'
    }
  },
  '/images': {
    target: 'https://api.allorigins.win',
    changeOrigin: true,
    secure: false,
    pathRewrite: {
      '^/images': '/raw'
    }
  }
}; 