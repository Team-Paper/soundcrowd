module.exports = {
  entry: './client/index.js',
  output: {
    path: __dirname,
    filename: './public/bundle.js'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          { loader: 'postcss-loader', options: { plugins: [require('postcss-reset-scrollbar')] } },
        ]
      },
      {
        test: /\.svg$|\.ttf?|\.woff$|\.woff2|\.eof|\.eot|\.png/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'public/assets/[name].[ext]',
              publicPath: url => url.replace(/public/, ''),
            },
          },
        ],
      }
    ]
  }
}
