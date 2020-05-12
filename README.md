# Webpack Demo

## Asset Management

### CSS

### Images

Check out:

- [Image Webpack Loader](https://github.com/tcoopman/image-webpack-loader)
- [URL Loader](https://webpack.js.org/loaders/url-loader/)

## Output Management

Check out:

- [HTML Webpack Plugin](https://github.com/jantimon/html-webpack-plugin)

## Development

### Using Sourcemaps

```js
  devtool: 'inline-source-map',
```

### Choosing a Development Tool

Webpack ships with three ways to automatically compile code on change

- webpack's Watch Mode
- `webpack-dev-server`
- `webpack-dev-middleware`

#### Using Watch Mode

Instructs webpack to "watch" all files and recompile when it finds a change.

```bash
webpack --watch
```

The only downside to this is that you still have to refresh, hence the `webpack-dev-server`

#### Using webpack-dev-server

Install it

```bash
npm install --save-dev webpack-dev-server
```

Tell the server where to look for files

`webpack.config.js`

```js
   devServer: {
     contentBase: './dist',
   },
```

Read about it more at [the documentation site](https://webpack.js.org/configuration/dev-server/)

#### Webpack's Dev Middleware

This is a wrapper that emits files processed by webpack to a server. It's used internally by `webpack-dev-server` but it's also available on its own. It's useful when you have a more complex application with its own server.

Install it

```bash
  npm install --save-dev webpack-dev-middleware
```

Set it up in your custom `server.js` file

```js
const express = require("express");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");

const app = express();
const config = require("./webpack.config.js");
const compiler = webpack(config);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(
  webpackDevMiddleware(compiler, {
    publicPath: config.output.publicPath,
  })
);

// Serve the files on port 3000.
app.listen(3000, function () {
  console.log("Example app listening on port 3000!\n");
});
```

## Code Splitting

This allows you to split your code into various bundles that will help you improve load time.

There are three general approaches:

1. Entry Points: manually split code using the `entry` config
2. Prevent Duplication: Use the [`SplitChunksPlugin`](https://webpack.js.org/plugins/split-chunks-plugin/) to do that
3. Dynamic Imports: Split code via inline functions

### Entry Points

This is fairly simple, but isn't dynamic and doesn't address duplication.

`webpack.config.js`

```js
  entry: {
   index: './src/index.js',
   another: './src/another-module.js',
  },
```

### Prevent Duplication

#### Entry Dependencies

We can manually define which imports modules share.

`webpack.config.js`

```js
entry: {
  index: { import: './src/index.js', dependOn: 'shared' },
  another: { import: './src/another-module.js', dependOn: 'shared' },
  shared: 'lodash',
},
```

#### Split Chunks Plugin

A better method is to use this plugin. It will automagically remove duplicated dependencies.

`webpack.config.js`

```js
optimization: {
  splitChunks: {
    chunks: 'all',
  },
},
```

Here are some other useful plugins that do similar work:

- [`mini-css-extract-plugin`](https://webpack.js.org/plugins/mini-css-extract-plugin): Splits CSS out from the main app
- [`bundle-loader`](https://webpack.js.org/loaders/bundle-loader): Used to split code and lazy load the resulting bundles
- [`promise-loader`](https://github.com/gaearon/promise-loader): Similar to `bundle-loader` but uses promises

#### Dynamic Imports

This can be done using `import()` and `require.ensure`. The recommended way is using `import()`.

webpack.config.js

```js
const path = require("path");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "dist/",
    path: path.resolve(__dirname, "dist"),
  },
};
```

Here we use `ChunkFileName` to determine the name of non-entry chunk files.

`index.js`

```js
function getComponent() {
  return import(/* webpackChunkName: "lodash" */ "lodash")
    .then(({ default: _ }) => {
      const element = document.createElement("div");

      element.innerHTML = _.join(["Hello", "webpack"], " ");

      return element;
    })
    .catch((error) => "An error occurred while loading the component");
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

Here we're dynamically grabbing lodash using the import statement. So that we only use it if we need it.

This can be cleaned up a bit using an `async` function. To do that, we need Babel and the [`Syntax Dynamic import Babel Plugin`](https://babeljs.io/docs/plugins/syntax-dynamic-import/#installation).

`index.js` with async

```js
async function getComponent() {
  const element = document.createElement("div");
  const { default: _ } = await import(
    /* webpackChunkName: "lodash" */ "lodash"
  );

  element.innerHTML = _.join(["Hello", "webpack"], " ");
  return element;
}

getComponent().then((component) => {
  document.body.appendChild(component);
});
```

#### Prefetching / Preloading Modules

This is a way of telling a browser, "hey, I might need this in the future so go off and grab it when you get a chance."

Preload vs Prefetch

- Preloaded chunk loads in parallel to the parent / Prefetched starts loading after the parent finishes
- Preloaded chunk has medium priority and is instantly downloaded / Prefetched loads during idle time
- Preloaded chunk should be instantly requested by the parent / Prefetched chunk can be used in the future

Preload example: a component that depends on a big library that should be loaded separately

`ChartComponent.js`

```js
import(/* webpackPreload: true */ "ChartingLibrary");
```

This component will grab that library and show a loading notice while waiting. This will boost performance since you only make one request instead of two

#### Bundle Analysis

There are a handful of tools to help you see how your code is being split out.

- [Official Analyze Tool](https://github.com/webpack/analyse)
- [Webpack Chart](https://alexkuz.github.io/webpack-chart/): Interactive Pie Chart of Stats
- [Webpack Visualizer](https://chrisbateman.github.io/webpack-visualizer/): Visualize and analyze bundles to see which modules are taking up space and might be duplicates
- [Webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer): Turns bundles into interactive zoomable treemap
- [Webpack Bundle Optimize Helper](https://webpack.jakoblind.no/optimize): Analyzes bundle and gives suggestions for improvement
- [Bundle Stats](https://github.com/bundle-stats/bundle-stats):

## Caching

### Output Filenames

### Extracing Boilerplate

### Module Identifiers

## Authoring Libraries

### Authoring a Library

### Base Configuration

### Base Configuration with Source Map

### Externalize Lodash

### External Limitations

### Expose The Library

#### Final Steps

## Environment Variables

Webpack can use the `--env.VARIABLE_NAME=variable` command to pass in environment variables

```bash
  webpack --env.NODE_ENV=local --env.production --progress
```

- `--env.NODE_ENV=local` creates a variable called `NODE_ENV` and sets it to local
- `--env.production` sets the `production` variable to true
- `--progress` prints compilcation progress in a percentage

In order to use a `.env` file, you need to grab one of the [Environment Plugins](https://webpack.js.org/plugins/environment-plugin/) and configure that.

## Build Performance

## Content Security Policies

## Development - Vagrant

## Installation

## Scaffolding

## Hot Module Replacement [HMR]

### Enabling HMR

When using Webpack's Dev Server, we can enable Hot Module Reloading by adding it to our `webpack.config.js`

```js
  devServer: {
    contentBase: './dist',
    hot: true,
  },
```

Alternatively, we can also do it using the `CLI`

```bash
npm run webpack-dev-server --hotOnly
```

### Via The Node.js API

For node, best practice is to pass an `options` object to your `new WebpackDevServer`. In addition to that, you also need to modify your Webpack config to include Hot Module Reloading entry points. You can add those using the `addDevServerEntrypoints` method.

Here's an example config file (`server-dev.js`):

```js
// Require Webpack and the Dev Server
const webpackDevServer = require("webpack-dev-server");
const webpack = require("webpack");

// Pull in our webpack config file
const config = require("./webpack.config.js");

// The options we pass to tell webpack we want some hot reloadin'
const options = {
  contentBase: "./dist",
  hot: true,
  host: "localhost",
};

// Add our config and options the addDevServerEntrypoints method
webpackDevServer.addDevServerEntrypoints(config, options);
// Define our compiler by passing our config file to Webpack
const compiler = webpack(config);
// Define our server as a new WebpackDevServer that uses our compiler and options
const server = new webpackDevServer(compiler, options);
// Tell that server to initialize on port 5000 of localhost
server.listen(5000, "localhost", () => {
  console.log("dev server listening on port 5000");
});
```

Using the `webpack-dev-middleware`? Read the [Dev Hot Middleware Docs](https://github.com/webpack-contrib/webpack-hot-middleware) for how to enable HMR with that.

### Gotchas

By default, HMR doesn't re-render anything on update. You have to either do this yourself or use a loader to refresh the page.

### HMR With Stylesheets

This is actually pretty simple because `style-loader` uses HMR behind the scenes.

First, make sure you have it

```bash
  npm install --save-dev style-loader css-loader
```

Second, make sure it's defined in your config file's modules

```js
module: {
  rules: [
          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },
        ],
  },
```

Take your server down and bring it back up. Voilá!

### Other Code and Frameworks

- [React Hot Loader](https://github.com/gaearon/react-hot-loader): Tweak react components in real time.
- [Vue Loader](https://github.com/vuejs/vue-loader): This loader supports HMR for vue components out of the box.
- [Elm Hot webpack Loader](https://github.com/klazuka/elm-hot-webpack-loader): Supports HMR for the Elm programming language.
- [Angular HMR](https://github.com/gdi2290/angular-hmr): No loader necessary! A simple change to your main NgModule file is all that's required to have full control over the HMR APIs.
- [Svelte Loader](https://github.com/sveltejs/svelte-loader): This loader supports HMR for Svelte components out of the box.

## Tree Shaking

## Production

## Lazy Loading

## Shimming

## TypeScript

## Progressive Web Application

## Public Path

## Integrations

## Asset Modules

## Advanced Entry
