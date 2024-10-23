const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

const PATHS = {
  src: path.join(__dirname, '..', 'src'),
  js: path.join(__dirname, '..', 'src', 'js'),
  style: path.join(__dirname, '..', 'src', 'style'),
  build: path.join(__dirname, '..', 'docs', 'dist'),
  docs: path.join(__dirname, '..', 'docs')
}

const config = {
  mode: 'production',
  entry: [PATHS.docs + '/src/js/entry.js'],
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM'
  },
  output: {
    path: PATHS.docs + '/dist',
    filename: 'main.js',
    library: 'reactJsonView',
    libraryTarget: 'umd'
  },
  resolve: {
    extensions: ['.js', '.json', '.css', '.scss']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        include: [PATHS.js, PATHS.docs]
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false
      })
    ]
  }
}

module.exports = config
