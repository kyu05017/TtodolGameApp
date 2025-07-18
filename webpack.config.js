const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: './index.web.js',
    mode: isProduction ? 'production' : 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 3000,
      host: '0.0.0.0',
      hot: true,
      liveReload: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
      },
    },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              ['@babel/preset-react', { runtime: 'automatic' }],
              '@babel/preset-typescript'
            ],
          },
        },
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/images/[name][ext]'
        }
      },
      {
        test: /\.(mp3|wav|ogg)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'assets/audio/[name][ext]'
        }
      },
    ],
  },
  resolve: {
    extensions: ['.web.js', '.web.jsx', '.web.ts', '.web.tsx', '.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules'],
    alias: {
      'react-native$': 'react-native-web',
      '@react-native-async-storage/async-storage': path.resolve(__dirname, 'src/web/async-storage-mock.js'),
      'react-native-gesture-handler': path.resolve(__dirname, 'src/web/gesture-handler-mock.js'),
      'react-native-reanimated': path.resolve(__dirname, 'src/web/reanimated-mock.js'),
      'react-native-modal': path.resolve(__dirname, 'src/web/modal-mock.js'),
      'react-native-sound': path.resolve(__dirname, 'src/web/sound-mock.js'),
      'react-native-responsive-dimensions': path.resolve(__dirname, 'src/web/responsive-dimensions-mock.js'),
      'react-native-game-engine': path.resolve(__dirname, 'src/web/game-engine-mock.js'),
    },
    fallback: {
      fs: false,
      path: false,
      crypto: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/assets',
          to: 'src/assets',
          noErrorOnMissing: true
        }
      ]
    }),
  ],
  };
};