# Client

Client for Side-Stacker game. This client is built using React and Vite. Documentation in this file explains how the system works and interacts with the server. Similar documentation is provided for the server in `/server` folder. [There's also a "main" documentation](https://github.com/alan-hadyk/side-stacker-game)

## Table of Contents
- [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Development - Quick Start](#development---quick-start)
    - [Production Build](#production-build)
    - [Available Scripts](#available-scripts)
- [Documentation](#documentation)
    - [Client architecture](#client-architecture)
    - [Design Patterns](#design-patterns)
        - [Module pattern](#module-pattern)
        - [Container/Component (or Smart/Dumb) pattern](#containercomponent-or-smartdumb-pattern)
        - [Hook pattern](#hook-pattern)
        - [Higher-Order Component (HOC) pattern](#higher-order-component-hoc-pattern)
        - [Atomic Design pattern](#atomic-design-pattern)
        - [Configuration pattern](#configuration-pattern)
        - [Helper/Utility pattern](#helperutility-pattern)
        - [Routing pattern](#routing-pattern)
    - [Testing](#testing)
        - [Unit Testing](#unit-testing)
        - [Integration Testing](#integration-testing)
        - [End-to-End Testing](#end-to-end-testing)

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

# Documentation

## Client architecture

Client is divided into the following main folders:

```
├── api - React Hooks responsible for making API calls
│   ├── mutations - React Hooks with `PUT` and `POST` requests
│   ├── queries - React Hooks with `GET` requests
├── assets - Icons and images used in the application
├── clients - Init of various clients, such as Websockets client or Axios client
├── components - "Dumb" UI components, responsible for displaying the UI
│   ├── atoms
│   ├── molecules
│   ├── organisms
│   └── templates
├── config - Various configurations, such as API URL
├── containers - "Smart" components, aware of the business logic and API
│   ├── authentication
│   ├── game
│   ├── home
│   ├── notFound
│   └── root
├── helpers - Helper functions
│   ├── api
│   ├── data
│   ├── functions
│   └── tests
├── hoc - App-wide Higher Order Components, such as Error Boundary or Toasts Provider
├── hooks - Reusable hooks
├── routing - Everything related to routing
└── styles - Initialization of Tailwind CSS library, as well as custom CSS styles
```

## Design Patterns

### Module pattern
The project is organized into modules (directories like `api`, `assets`, `clients`, `components`, etc.). Each module encapsulates related functionality, which helps to keep the codebase organized and manageable.

### Container/Component (or Smart/Dumb) pattern
This is a common pattern in React where components are divided into two categories:
  - "Smart" components (also known as container components), which are aware of the business logic and API. These are the components that manage state, make API calls, and generally handle the logic of the application. In this project, these are in the `containers` directory.
  - "Dumb" components (also known as presentational components), which are responsible for displaying the UI. These components are not aware of the state or business logic. They receive data and callbacks exclusively via props. In this project, these are in the `components` directory.

## Hook pattern
This is a pattern introduced in React 16.8 where state and other React features can be used without writing a class. There are hooks for API calls in `api` directory (split into mutations and queries) and also some reusable hooks in `hooks` directory.

## Higher-Order Component (HOC) pattern
A higher-order component is a function that takes a component and returns a new component with additional props or behaviors. In this project, there are some app-wide HOCs in the hoc directory.

## Atomic Design pattern
This is a methodology developed by Brad Frost for creating design systems. It consists of five distinct levels: atoms, molecules, organisms, templates, and pages. This application implements the first four levels (`components` directory). Works well with "dumb" components.

## Configuration pattern
Keeping configuration values separated from the code is a good practice. There's a `config` directory for this purpose.

## Helper/Utility pattern
Helper or utility functions are kept separate in a `helpers` directory. These are functions that can be used across multiple parts of the application, increasing code reusability.

## Routing pattern
Routing related logic is placed in a separate `routing` directory.

## Testing

This repository contains few tests, representing various testing strategies.

### Unit Testing

Example unit test, implemented with `Vitest` and `React Testing Library`:
- [src/helpers/data/__tests__/calculateNumberOfPlayersInGame.test.ts](src/helpers/data/__tests__/calculateNumberOfPlayersInGame.test.ts)

### Integration Testing

Example integration tests, implemented with `Vitest` and `React Testing Library`:
- [src/containers/game/__tests__/GameContainer_Finished_game.test.tsx](src/containers/game/__tests__/GameContainer_Finished_game.test.tsx)
- [src/containers/game/__tests__/GameContainer_Game_in_progress.test.tsx](src/containers/game/__tests__/GameContainer_Game_in_progress.test.tsx)
- [src/containers/game/__tests__/GameContainer_Open_game.test.tsx](src/containers/game/__tests__/GameContainer_Open_game.test.tsx)

### End-to-End Testing

Example end-to-end test, implemented with `Playwright`:
- [e2e/authentication.spec.ts](e2e/authentication.spec.ts)