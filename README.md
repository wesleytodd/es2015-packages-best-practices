# ES2015 Package Best Practices

This is an example module that shows the best practices for authors when publishing ES2015 packages.  With the proliferation of build tools it is even more important to maintain a set of best practices for package authors.

### ES 2015 Source Modules

To transform your source from ES 2015 to ES5 the standard is to use [Babel](http://babeljs.io/).  To get started you need to install a few packages as dev dependencies.

```
$ npm install --save-dev babel-cli babel-preset-es2015
```

The babel configuration can go either in a `.babelrc` file or in the package.json, but it is preferred to put it in the `.babelrc` because babel will look up the directory tree for one, and if there are multiple versions of babel in the project it can cause build breakages.  So add a `.babelrc` to the root of your project like this:

```json
{
	"presets": ["es2015"]
}
```

### What to Publish to NPM

ALWAY PUBLISH COMPILED FILES. Usually don't publish the source. Shipping the source files bloats the install size.  On small projects this might seem fine, but on larger projects install times can take minutes and deployments can fill up disks.  To do this use the `.npmignore` file in the root of your project (see [here for detailed information](https://docs.npmjs.com/misc/developers#keeping-files-out-of-your-package)).  The main files to ignore are `src`, `dist` and any examples or tests you have.  Don't ignore the readme because that that is often helpful when people are exploring the module.

### Browser Modules

For browser modules it is sometimes nice to provide a pre-compiled file for the browser.  These files should go in `dist` and be committed to the repository, but as said above, not published to npm.  Those files should be committed to the repository so that they are available on GitHub, or wherever you publish to.

If the module has any component that cannot be loaded on either the server or client, two entry points should be specified.  One which ONLY loads the browser code and one which ONLY loads the server code.  To do this the `browser` fields of the package.json can be used.

```json
{
  "main": "index.js",
  "browser": "browser.js"
}
```

### NPM Scripts

In the package.json you can easily automate some of the build steps using npm scripts.  Usually I setup 3 or 4 depending on the package:

```json
{
  "scripts": {
    "build": "npm run babel && npm run dist && npm run min",
    "babel": "babel src --out-dir lib",
    "dist": "mkdir -p dist && browserify browser.js -s Logger -t [babelify] -o dist/logger.js",
    "min": "uglifyjs dist/logger.js -o dist/logger.min.js"
  }
}
```

Sadly, the caveat with this prepublish script is that prepublish is run at a bunch on [non-intuitave times](https://github.com/npm/npm/issues/3059) and you don't want your users running your compile step.  Soon a [new script](https://github.com/npm/npm/issues/10074) will be added called `prepare` which sill solve this.  Until then you need to remember to run `npm run build` before `npm publish`.

### Exports

The new ES2015 module syntax does not support exporting single functions.  This is a very common practice in node/commonjs modules.  So to get around this, wrap your module in a file that just exports the function in the standard node way.  For example:

```javascript
module.exports = require('./lib/index').default;
```

## Contributions

This stuff changes ALL THE TIME, so contributions are welcome!  Just open PR's against master.
