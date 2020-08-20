const path = require('path');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const ZipPlugin = require('zip-webpack-plugin');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  const plugins = [new ForkTsCheckerWebpackPlugin()];

  if (isProd) {
    plugins.push(
      new HtmlWebpackPlugin({
        template: './index.html',
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeStyleLinkTypeAttributes: true,
          keepClosingSlash: true,
          minifyJS: true,
          minifyCSS: true,
          minifyURLs: true,
          inlineSource: '.(js|ts)$',
        },
      }),
      new ScriptExtHtmlWebpackPlugin({
        inline: 'main',
      }),
      new ZipPlugin({ filename: 'bundle.zip' })
    );
  } else {
    plugins.push(
      new HtmlWebpackPlugin({
        inject: true,
        template: './index.html',
      })
    );
  }

  return {
    entry: ['./main.ts'],
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].[hash].js',
    },
    module: {
      rules: [
        {
          test: /\.ts?$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                transpileOnly: true,
              },
            },
          ],
          exclude: /node_modules/,
        },
      ],
    },
    plugins,
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
  };
};
