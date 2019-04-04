# Clientkit

[![Build Status](https://travis-ci.org/firstandthird/clientkit.svg?branch=master)](https://travis-ci.org/firstandthird/clientkit)

An opinionated UI framework for building client projects efficiently and effectively. Clientkit is a wrapper around Webpack 4 trying to ease the pain of configuring and leveraging YAMLs to provide as less configuration as possible.

It's using Webpack in multi-configuration mode for the 3 different assets that are being handled.

## Table of Contents

- [Configuration](#configuration)
  - [Specific environment configuration](#specific-environment-configuration)
  - [Usage](#usage)
  - [Environment variables](#environment-variables)
  - [Default common configuration](#default-common-configuration)
  - [Stylesheets](#stylesheets)
  - [Scripts](#scripts)
  - [SVGSprite](#Ssvgsprite)
  - [Hash](#hash)
- [ES2015+ Builds](#es2015+-builds)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Contributing](#contributing)
- [Copyright](#copyright)

## Configuration

Clientkit uses YAML files to setup its configuration. By default, Clientkit will look for configuration files in the `conf` directory (this location can be overridden setting the desired path on the env var: `CK_PREFIX`, please see the full list of [Clientkit environment variables](#environment-variables)). 

The configuration can be splitted into different and independent YAML files which will be merged later into one single configuration object, which means you should be careful as same name variables can be overridden.

See [confi](https://github.com/firstandthird/confi) for more information on the YAML configuration.

### Specific environment configuration

Clientkit allow having different options depending on the environment (dev, stage, production or custom).

### Usage

```sh
npm run start # Available options: start|dev|build|test
```

| Mode    | Description                                              |
|---------|----------------------------------------------------------|
| `start` | **Default**. Generate bundle using default configuration |
| `dev`   | Run Clientkit for development (reloads on config  change)|
| `build` | Generate bundle for production                           |
| `test`  | Run Clientkit tests                                      |

### Environment variables

List of environment variables used by Clientkit:

| Option           | Type    | Default (if not set)   | Description |
|------------------|---------|------------------------|-------------|
| `NODE_ENV`       | String  | `'development'`        | Environment set in [run _MODE_ option](#usage). This affects Webpack's [mode](https://webpack.js.org/configuration/mode/) |
| `CK_PREFIX`      | String  | `'clientkit'`          | Clientkit's directory name |
| `CK_BASE_CONFIG` | String  | `'./conf'`             | Clientkit's base configuration directory path |
| `CK_CONFIG`      | String  | `'./{{CK_PREFIX}}'`    | Clientkit's custom configuration directory name |
| `CK_PATH`        | String  | _Current directory_    | Clientkit's root directory path |

### Default common configuration

This is Clientkit's default common configuration, the options listed below are also used as default values for other configurations:

| Option        | Type    | Default                                 | Description |
|---------------|---------|-----------------------------------------|-------------|
| `dist`        | String  | `'./dist'`                              | Target directory for all output files |
| `assetPath`   | String  | `'./assets'`                            | Path to public assets directory (used to resolve path of external resources) |
| `minify`      | Boolean | `true` if production, `false` otherwise | Minify output files (only affects JS and CSS) |
| `failOnError` | Boolean | `false`                                 | Whether Clientkit process should stop on error or not |
| `browserlist` | Array   | `[ '>1%' ]`                             | Optimize builds for targeted browsers. See [Browserlist config](https://github.com/browserslist/browserslist#full-list) |

### Stylesheets

Clientkit uses [PostCSS Preset Env](https://preset-env.cssdb.org/) as default CSS compiler although plain CSS is still valid. This is the list of the [supported PostCSS features](https://preset-env.cssdb.org/features#stage-0). It also uses browserlist config to generate CSS compatible code for the targeted browsers.

List of available options:

| Option         | Type    | Default | Description |
|----------------|---------|--------------|---|
| `dist`         | String  | [Default value](#default-common-configuration)  | Target directory for CSS output files |
| `assetPath`    | String  | [Default value](#default-common-configuration)  | Path to public assets directory (used to resolve path of external resources) |
| `importPaths`  | Array   | `[ '{{CKDIR}}/styles' ]` | Inline import CSS files content |
| `mixinPath`    | String  | `'{{CKDIR}}/styles/mixins/*.css'` | Path to Clientkit's mixins files |
| `globalMixins` | String  | `{{CKDIR}}/styles/mixins` | Clientkit global mixins directory |
| `mobileFirst`  | Boolean | `false`   | Indicates whether assets are mobile first or not (changes CSS breakpoints) |
| `files`        | Object  | [Sample config](./demo/clientkit.yaml#L2)       | List of CSS files to generate |
| `color`        | Object  | [Default colors](./conf/default-colors.yaml)      | Object of CSS colors to include |
| `vars`         | Object  | [Default variables](./conf/default-vars.yaml) | Object of CSS variables to include |

> Both `color` and `vars` default values can be extended using your own configuration file. Use different key names to avoid name clashing.

#### Color naming conventions

To ease development process, some names create classes automatically that can be used.

  * `background-[NAME]`: This will create a `bg-[NAME]` class which will apply the color as a background. So, `background-dark: #000` will create a `.bg-dark` class which will add a black background.
  * `text-color-[NAME]`: This will create a `color-[NAME]` class which will apply the color as a text-color. So, `text-color-danger: #f00` will create a `.color-danger` class which will add change text to red.
  * `background-text-[NAME]`: This will change text's color under a given background. So, having `background-text-dark: #fff` would mean that text inside of a `.bg-dark` class would be white.
  
#### Other configurations

Clientkit does a lot on the CSS side and provides a lot of classes and utilities to help you quickly scaffold any project. We plan on adding more docs around this. There are a lot of assumptions made in terms of fonts, sizes, spacing, etc which can be seen here: [conf/default-vars.yaml](conf/default-vars.yaml).

### Scripts

Clientkit supports ES6 features by default, which are transpiled using Babel to make the code backwards-compatible with different browsers and versions. Targeted browsers can be configured using the [browserlist](https://github.com/browserslist/browserslist) property [described above](#default-common-configuration).

List of available options:

| Option        | Type    | Default                                          | Description |
|---------------|---------|--------------------------------------------------|-------------|
| `dist`        | String  | [Default value](#default-common-configuration)   | Target directory for JavaScript output files |
| `assetPath`   | String  | [Default value](#default-common-configuration)   | Path to public assets directory (used to resolve path of external resources) |
| `commonChunk` | Boolean | `true` if production, `false` otherwise          | Enable/disable chunk splitting [(more info)](https://webpack.js.org/plugins/split-chunks-plugin/) |
| `files`       | Object  | [Sample config](./demo/clientkit.yaml#L7)        | List of JavaScript files to generate |

### SVGSprite

This Clientkit feature takes a group of SVG files, optimizes (if SVGO enabled) and mangles them into a single SVG file (sprite).

List of available options:

| Option            | Type    | Default                                          | Description |
|-------------------|---------|--------------------------------------------------|-------------|
| `dist`            | String  | [Default value](#default-common-configuration)   | Target directory for SVG output files |
| `useSVGO`         | Boolean | `true`                                           | Whether to use SVGO or not to generate the sprite |
| `svgoConfig`      | Object  | [Sample config](./conf/default-svgsprite.yaml#L5) | SVGO configuration object, ([available options](https://github.com/svg/svgo#what-it-can-do)) |
| `files`           | Object  | [Sample config](./demo/clientkit.yaml#L11)        | List of SVG files to merge into one single sprite |

### Hash

This option, enabled by default, generates a JSON file that matches the original filename with its hashed version.

List of available options:

| Option          | Type   | Default                                        | Description                               |
|-----------------|--------|------------------------------------------------|-------------------------------------------|
| `dist`          | String | [Default value](#default-common-configuration) | Target directory for hashed output files  |
| `mappingFile`   | String | `'assets.json'`                                | File name of the manifest file            |

## Bugs and feature requests

Have a bug or a feature request? Please first read the [Contributing documentation](https://github.com/firstandthird/clientkit/blob/master/CONTRIBUTING.md) and search for existing and closed issues. If your problem or idea is not addressed yet, [please open a new issue](https://github.com/firstandthird/clientkit/issues/new).

## Contributing

Contribution is a perfect way to help advance the project.  Please read the [contributing guidelines](https://github.com/firstandthird/clientkit/blob/master/CONTRIBUTING.md) before getting started.

Editor preferences are available in the [editor config](https://github.com/firstandthird/clientkit/blob/master/.editorconfig) for use in common text editors. Read more and download plugins at <http://editorconfig.org>.

### Getting Started

1. Clone the repo: `git clone https://github.com/firstandthird/clientkit.git`.
2. `cd clientkit`
3. Install build dependencies: `npm install`
4. Start the build process: `npm start`

## Copyright

© 2019. First and Third, Inc. Maintained by [@firstandthird](https://github.com/orgs/firstandthird/people).
