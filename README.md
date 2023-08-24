# ProtoStage

[![Dependencies Status](https://david-dm.org/psychobolt/ProtoStage.svg)](https://david-dm.org/psychobolt/ProtoStage)
[![Dev Dependencies Status](https://david-dm.org/psychobolt/ProtoStage/dev-status.svg)](https://david-dm.org/psychobolt/ProtoStage?type=dev)
[![Peer Dependencies Status](https://david-dm.org/psychobolt/ProtoStage/peer-status.svg)](https://david-dm.org/psychobolt/ProtoStage?type=peer)

[![Build Status](https://travis-ci.org/psychobolt/ProtoStage.svg?branch=master)](https://travis-ci.org/psychobolt/ProtoStage)
[![codecov](https://codecov.io/gh/psychobolt/ProtoStage/branch/master/graph/badge.svg)](https://codecov.io/gh/psychobolt/ProtoStage)

ProtoStage is a editor for prototyping and interacting with 2D simulations

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

## Adding dependencies (libraries)

```sh
yarn add [package-name] --dev # for dev tools
yarn add [package-name] # for app
```

## Merging from base project

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
yarn lint # runs linter to detect any style issues (CSS & JSS)

yarn lint:css # lint only CSS
yarn lint:css --fix # tries to fix CSS lint issues

yarn lint:js # lint only JS
yarn lint:js --fix # tries to fix CSS lint issues
```

See [official documentation](https://eslint.org/) for a usage guide.

### Test

```sh
yarn test # runs functional/unit tests using Jest
yarn test --coverage # with coverage
yarn test-e2e # run end-to-end tests. (build required)
```

### Build

```sh
yarn build
```

For configuration details, see [electron-builder](https://github.com/electron-userland/electron-builder).
