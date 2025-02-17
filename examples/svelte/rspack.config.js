const path = require('path');
const sveltePreprocess = require('svelte-preprocess');
const { default: HtmlPlugin } = require('@rspack/plugin-html');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  entry: {
    'main': ['./src/main.ts']
  },
  resolve: {
    alias: {
      svelte: path.dirname(require.resolve('svelte/package.json'))
    },
    extensions: ['.mjs', '.js', '.ts', '.svelte'],
    mainFields: ['svelte', 'browser', 'module', 'main']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    chunkFilename: '[name].[id].js'
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: [{
          loader: 'svelte-loader',
          options: {
            compilerOptions: {
              dev: !prod
            },
            // TODO: checkout https://github.com/sveltejs/svelte-loader/blob/5373e5c9b005241e9974b13746f9f4ad05260d4a/index.js#L75
            // emitCss: prod,
            hotReload: !prod,
            preprocess: sveltePreprocess({ sourceMap: !prod, postcss: true })
          }
        }]
      },
    ]
  },
  mode,
  plugins: [
    new HtmlPlugin({
      title: 'Svelte App',
      template: path.join(__dirname, 'index.html'),
      favicon: path.join(__dirname, 'public', 'favicon.png'),
    }),
  ],
  devtool: prod ? 'hidden-source-map' : 'eval-source-map',
  devServer: {
    hot: true,
    historyApiFallback:true
  }
};
