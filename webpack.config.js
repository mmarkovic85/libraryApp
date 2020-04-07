const path = require("path");

module.exports = (env) => {
  const isProduction = env === "production";

  return {
    mode: isProduction ? "production" : "development",
    entry: "./src/client/app.js",
    output: {
      filename: "bundle.js",
      path: path.join(__dirname, "public", "dist")
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: "babel-loader"
        }
      ]
    },
    devtool: isProduction ? "source-map" : "inline-source-map"
  };
};
