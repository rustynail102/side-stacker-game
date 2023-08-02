# Client

Client for Side-Stacker game. This client is built using React and Vite. Documentation in this file explains how the system works and interacts with the server. Similar documentation is provided for the server in `/server` folder.

# Getting Started

## Requirements

```
- node >=18.0.0
- npm >=8.6.0
- yarn >=1.22.19
```

## Development - Quick Start

Use the following commands in the terminal of your choice:

```
yarn
yarn dev
```

After running `yarn dev`, app will start automatically. If everything works, you should see following logs in the terminal:

```
  VITE v4.4.8  ready in 313 ms

  ➜  Local:   http://127.0.0.1:4000/
  ➜  press h to show help
```

Navigate to [http://127.0.0.1:4000/](http://127.0.0.1:4000/) in your browser.

## Production Build

Use the following commands in the terminal of your choice:

```
yarn
yarn build
yarn preview
```

Those commands will build the app and create a local preview of the production build.

## Available Scripts

### `yarn build`
Builds the app for production

### `yarn dead-code`
Displays a list with unused code

### `yarn dev`
Starts the app in development mode

### `yarn lint`
Lints the entire app with ESLint

### `yarn preview`
Local preview of the production build

### `yarn test`
Runs all unit and integration tests with Vitest

### `yarn test:watch`
Runs all unit and integration tests with Vitest in watch mode

### `yarn test:e2e`
Runs all end-to-end tests with Playwright in headless mode

### `yarn test:e2e:ui`
Runs all end-to-end tests with Playwright in UI mode