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
