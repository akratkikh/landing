const path = require("path");
const fs = require("fs");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const SitemapPlugin = require('sitemap-webpack-plugin').default;
const RobotstxtPlugin = require("robotstxt-webpack-plugin");

const pagesUrls = [];

const getAllFilesInPath = (templateDir, main) => {
  const result = main || [];
  let templateFiles = fs.readdirSync(templateDir);
  let files = [];
  templateFiles.forEach(f => {
    const filePath = templateDir + '/' + f;
    if (fs.lstatSync(filePath).isDirectory()) {
      files = files.concat(getAllFilesInPath(filePath));
      return;
    }

    if(f.indexOf('.html') > 0 ){
      const url = templateDir.substr(templateDir.lastIndexOf('/')).replace('/src', '/');
      pagesUrls.push(url);
      files.push({
        path: filePath,
        fileName: f
      });
    }
  })

  return result.concat(files);
}


let pathsSitemap = [];

const optionsRobots = {
  policy: [
    {
      userAgent: "*",
      allow: "/",
      crawlDelay: 2,
    },
  ],
  sitemap: "https://adev.am/sitemap.xml",
  host: "https://adev.am",
};
const generateIndexes = () => {
  pathsSitemap = pagesUrls.map(path => ({
    path,
    lastmod: '2015-01-04',
    priority: 0.8,
    changefreq: 'monthly'
  }))
}


//function generates new html page in dist, when you create new html page in src
function generateHtmlPlugins(templateDir) {
  const allFiles = getAllFilesInPath(templateDir);
  generateIndexes();
  console.log('LOOOG', pathsSitemap);
  return allFiles
      .map((item) => {
        const name = item.path.replace(templateDir + '/', '');
        return new HtmlWebpackPlugin({
          filename: name,
          template: path.resolve(
              __dirname,
              item.path
          ),
          inject: false,
        });
      });
}

console.log('LOOOG', pathsSitemap);
module.exports = {
  entry: ["./src/js/index.js", "./src/scss/main.scss"],
  output: {
    filename: "./js/bundle.js",
    publicPath:'/',
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, "src/js"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              ident: "postcss",
              plugins: [require("autoprefixer")()],
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "img/[name].[ext]",
            },
          },
          {
            loader: "image-webpack-loader",
            options: {
              mozjpeg: {
                progressive: true,
                quality: 85,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: "75-90",
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
            },
          },
        ],
      },
      {
        test: /\.html$/,
        loader: "html-loader",
      },
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({}),
      new UglifyJsPlugin({
        uglifyOptions: {
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
          },
          mangle: true,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
  plugins: [
    new RobotstxtPlugin(optionsRobots),
    new MiniCssExtractPlugin({
      filename: "./css/main.min.css",
    }),
    new CopyWebpackPlugin([
      // {
      //   from: './src/favicon',
      //   to: './favicon'
      // },
      {
        from: "./src/.htaccess",
      },
    ]),
    new CompressionPlugin({
      filename: "[path].gz[query]",
      test: /\.js$|\.html$/,
      threshold: 10240,
    }),
  ].concat(generateHtmlPlugins("./src"), [    new SitemapPlugin({
    base: 'https://adev.am',
    paths: pathsSitemap,
    options: {
      filename: 'sitemap.xml',
      lastmod: true,
      changefreq: 'monthly',
      priority: 0.4
    }
  }),]),
};
