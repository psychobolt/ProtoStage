# ProtoStage

[![Build Status](https://travis-ci.org/psychobolt/ProtoStage.svg?branch=master)](https://travis-ci.org/psychobolt/ProtoStage)
[![Dependencies Status](https://david-dm.org/psychobolt/ProtoStage.svg)](https://david-dm.org/psychobolt/ProtoStage)
[![codecov](https://codecov.io/gh/psychobolt/ProtoStage/branch/master/graph/badge.svg)](https://codecov.io/gh/psychobolt/ProtoStage)

ProtoStage is a upcoming simplistic editor for crafting and prototyping next generation interactive applications. See our [wiki page](https://github.com/psychobolt/ProtoStage/wiki/About) for more information.

## Development

### Setup

1. Clone the repository
2. Install the latest [Node JS](https://nodejs.org/) and [Yarn](https://yarnpkg.com) and simply run ```yarn``` or ```yarn install``` command in the project directory.
3. ```git remote add base https://github.com/psychobolt/whitestorm-react-electron-boilerplate```

During development, run watch task:
```sh
yarn watch # compile new code changes and reloads the app
```

> Alternatively, you can run watch task (npm: watch) in Visual Studio Code.

Then, in another terminal, launch Electron:
```sh
yarn dev # same as 'yarn start'
```

> Alternatively, you can launch in Visual Studio Code in debug mode.

Tesing only with production code (watch and debug unnecessary):

```sh
yarn prod
```

### Adding dependencies (libraries)

This project uses two package.json structure. For more details, see [here](https://github.com/electron-userland/electron-builder/wiki/Two-package.json-Structure).

#### Default -- <root_dir>/package.json

```sh
yarn add [package-name] --dev # for dev tools
yarn add [package-name] # for app
```

#### Native libraries -- <root_dir>/src/package.json

```sh
cd src/
yarn add [package-name]
```

### Merging from base project

This project is a fork from psychobolt's [react-electron-boilerplate](https://github.com/psychobolt/whitestorm-react-electron-boilerplate). To fetch latest changes, ```git remote add base https://github.com/psychobolt/whitestorm-react-electron-boilerplate.git```. On a clean working branch, ```git pull base master```, and fix any conflicts before commit.

### Static Type Checker

```sh
yarn run flow
```

> Some extensions such as in [Visual Studio Code](https://marketplace.visualstudio.com/items?itemName=flowtype.flow-for-vscode) detect ```.flowconfig``` and run type checking in the editor.

### Static Types

```sh
yarn flow # performs type checking on files
```

See [official documentation](https://flow.org/) for a usage guide.

Yarn will usually run postinstall for updating flowtype definitions when new packages are added. To manually update typed definitions yourself:

```sh
yarn flow-typed-install:dev # installs development flowtypes
yarn flow-typed-install:app # installs app flowtypes
```

See additional [documentation](https://github.com/flowtype/flow-typed) for adding type definitions.

### Lint

The watch task will automatically lint on file changes. However, you can invoke the linter directly:

```sh
yarn lint # runs linter to detect any style issues
yarn lint --fix # tries to fix lint issues
```

See [official documentation](https://eslint.org/) for a usage guide.

### Test

```sh
yarn test # runs functional/unit tests using Jest
yarn test --coverage # with coverage
yarn test-e2e # run end-to-end tests
```

### Build

```sh
yarn build
```

For configuration details, see [electron-builder](https://github.com/electron-userland/electron-builder).
