module.exports = {
 entry: [
   './src/index.js'
 ],
 output: {
   path: __dirname,
   publicPath: 'src/',
   filename: 'index.min.js'
 },
 module: {
   loaders: [{
     exclude: /node_modules/,
     loader: 'babel',
     query: {
       presets: ["react", "es2015", "stage-1"]
     }
   }]
 },
 externals: {
    jsdom: 'window',
    cheerio: 'window',
    'react/lib/ExecutionEnvironment': true,
    'react/lib/ReactContext': 'window',
    'react/addons': true
  },
 resolve: {
   extensions: ['', '.js', '.jsx']
 },
 devServer: {
   historyApiFallback: true,
   contentBase: './'
 }
}
