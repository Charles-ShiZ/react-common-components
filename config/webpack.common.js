const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: "[name].js",
    path: path.resolve(process.cwd(), "dist"),
    publicPath: "/",
    clean: true,
    environment: {
      arrowFunction: false // 将包裹打包代码的自执行函数，从箭头函数改为function。作用就是兼容不支持箭头函数的老版本浏览器，比如ie。
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      title: "webpack-learn",
      template: "./public/index.html"
    }),
    // new BundleAnalyzerPlugin()
  ],
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".css", ".scss"],
  },
  module: {
    rules: [
      {
        test: /\.(css|scss)$/i,
        use: [
          "style-loader",
          "css-loader"
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          "file-loader"
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          "file-loader"
        ]
      },
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: "babel-loader"
        },
        exclude: "/node_modules/"
      }
    ]
  }
};
