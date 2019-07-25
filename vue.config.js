const { join } = require('path')

module.exports = {
  css: {
    loaderOptions: {
      stylus: {
        import: [join(__dirname, 'src/styles/variables.styl')]
      }
    }
  }
}
