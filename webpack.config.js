const path = require('path');

module.exports = {
  entry: {
    index: './src/index.tsx'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'babel-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'react-cache': path.resolve(__dirname, 'libs/react-cache.development.js')
    },
    extensions: ['.js', '.ts', '.tsx']
  },
  devServer: {
    contentBase: './public'
  }
};
