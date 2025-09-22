const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const express = require("express");

const config = {
  entry: "./src/index.tsx",
  output: {
    path: path.resolve(__dirname, "build"),
    filename: '[name].js',
    publicPath: "/",
  },
  mode: "development",
  devtool: "inline-source-map", // ← ここを追加
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "ts-loader",
            options: {
              transpileOnly: true,
            },
          },
        ],
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',     // async/initial/すべてのチャンクを分割
      name: 'vendors',   // 生成される共通チャンク名
    },
    runtimeChunk: 'single', // ランタイムコードを単一ファイルにまとめる
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // 元のHTML
      chunks: 'all'              // 必要なチャンクのみ挿入
    }),
  ],
  devServer: {
    host: "localhost",
    port: 3000,
    server: "http", // HTTPSやHTTP2にする場合は { type: "https", options: {...} } に変更
    static: {
      directory: path.resolve(__dirname, "build"),
      watch: true,
    },
    historyApiFallback: true, // React-Router対応
    open: true,
    setupMiddlewares: (middlewares, devServer) => {
      if (!devServer) throw new Error("webpack-dev-server is not defined");

      // before系ミドルウェア
      middlewares.unshift({
        name: "before-middleware",
        path: "/api/before",
        middleware: (req, res) => res.json({ message: "Before Middleware" }),
      });

      // after系ミドルウェア
      middlewares.push({
        name: "after-middleware",
        path: "/api/after",
        middleware: (req, res) => res.json({ message: "After Middleware" }),
      });

      return middlewares;
    },
  },
};

module.exports = config;
