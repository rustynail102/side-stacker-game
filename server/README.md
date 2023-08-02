# Server

Server for Side-Stacker game. This server is built using Node.js. Documentation in this file explains how the system works and interacts with the client. Similar documentation is provided for the client in `/client` folder. [There's also a "main" documentation](https://github.com/alan-hadyk/side-stacker-game)

## Table of Contents
- [Getting Started](#getting-started)
    - [Requirements](#requirements)
    - [Development - Quick Start](#development---quick-start)
    - [Production Build](#production-build)
    - [Available Scripts](#available-scripts)
- [Documentation](#documentation)
    - [Server Architecture](#server-architecture)
        - [System Diagram](#system-diagram)
        - [Components](#components)
    - [Design Patterns](#design-patterns)
    - [API Endpoints](#api-endpoints)
    - [Authentication](#authentication)
    - [Real-time communication and Websockets](#real-time-communication-and-websockets)
    - [Testing](#testing)
        - [Unit tests](#unit-tests)
        - [Integration tests](#integration-tests)

# Getting Started

## Requirements

```
- node >=18.0.0
- npm >=8.6.0
- yarn >=1.22.19
- Docker >=20.10.20
```

## Development - Quick Start

Use the following commands in the terminal of your choice:

```
yarn
yarn dev
```

First run of `yarn dev` will download Docker containers with PostgreSQL database and Redis. After that, server will start automatically. If everything works, you should see following logs in the terminal:

```
HTTP server running at http://127.0.0.1:3000/
WS server running at ws://127.0.0.1:3000/
```

## Production Build

Use the following commands in the terminal of your choice:

```
yarn
yarn build
yarn start
```

**Note: Production Build is not fully implemented and might not work. Requires further work.**

## Available Scripts

### `yarn build`
Builds the app for production

### `yarn db:reverse-migration`
Reverses the last database migration

### `yarn db:test:start`
Starts a Docker container with a PostgreSQL database used for tests

### `yarn db:start`
Starts a Docker container with a PostgreSQL database used for development

### `yarn docker:stop`
Stops all Docker containers and removes containers, networks, volumes, and images

### `yarn dead-code`
Displays a list with unused code

### `yarn dev`
Starts Docker containers with Redis and PostgreSQL for development, and then starts the app in development mode

### `yarn lint`
Lints the entire app with ESLint

### `yarn lint:fix`
Lints the entire app with ESLint, and then fixes all fixable issues

### `yarn redis:test:start`
Starts a Docker container with Redis storage used for tests

### `yarn redis:start`
Starts a Docker container with Redis storage used for development

### `yarn start`
Starts the app in production mode

### `yarn test`
Starts Docker containers with Redis and PostgreSQL for testing, and then runs all tests

### `yarn test:ci`
Runs all tests in CI

### `yarn test:watch`
Starts Docker containers with Redis and PostgreSQL for testing, and then runs all tests in watch mode

# Documentation

## Server Architecture

> This document provides a comprehensive overview of the server architecture, detailing how different components interact with each other.

### System Diagram

The following high-level diagram illustrates the interaction between different components of the server:

![Server Architecture - High-level diagram](docs/server-architecture.drawio.svg?raw=true "Server Architecture - High-level diagram")

### Components

The server architecture is primarily composed of the following key components:

- **App (Express)**: This is the main application, running the HTTP and WebSockets servers.

- **HTTP Server**: Main HTTP server. It handles incoming REST requests, routes them to the appropriate handlers, and sends them back to the client.

- **HTTP Middlewares**: Middleware functions which perform operations on the HTTP requests and responses before they reach their final route handler. They are used for logging, parsing request bodies, handling authentication and errors.

- **WebSockets Server**: WebSockets server created "from" HTTP server. It handles socket connections, routes them to the appropriate handlers, and keeps the connection with the client.

- **WS Middlewares**: Middleware functions perform operations on the WS socket connections before they reach their final route handler. They are used for logging, handling authentication and sending data to the client. They might communicate with services.

- **Router**: Router is responsible for creating REST endpoints and connecting those endpoints to controllers.

- **Controllers**: Controllers handle various requests, interact with models or services to gather the necessary data and/or to perform certain actions. Data might be parsed and sent as a response to the client.

- **Services**: Services contain most of the business logic. They are responsible for calculating and transforming the necessary data, communicating with Redis store, validating requests, managing sessions, emitting websocket events and hashing passwords. They might communicate with models and Redis store.

- **Models**: Models act as a Database interface. That's the only component in the system capable of interacting with the database.

- **Database (PostgreSQL)**: Relational database running inside a Docker container, used for storing structured data (players, games and moves).

- **Redis**: This is an in-memory data structure store, used to store sessions and data related to active players.

## Design Patterns

### Model-View-Controller (MVC) Pattern
Classic architectural pattern for implementing user interfaces. In the context of this app, Models correspond to data and the operations that can be performed on it (such as database interactions), Views correspond to the data presentation format (sending responses to the client in this RESTful API scenario), and Controllers handle the business logic, processing the user's input and returning the appropriate response.

### Repository Pattern
Models in this context act as Repositories, serving as an abstraction layer between the data access layer and the business logic or service layer. They manage the interactions with the database and provide an API for the Controllers to use.

### Service Layer Pattern
The services in the `services` directory encapsulate the application's business logic. This makes the code more reusable, testable, and organized. Services are typically used by Controllers, and they may use Models to access and manipulate data.

### Middleware Pattern
Middlewares in Express.js are functions that have access to the request and response objects, and the next function in the application’s request-response cycle. They can execute any code, modify the request and the response objects, end the request-response cycle, and call the next middleware in the stack. A good example of middleware is [`httpErrorsMiddleware`](src/middlewares/http/httpErrors.ts)

### Singleton Pattern
Singleton might be applied to database connection and Redis client. The idea of the Singleton pattern is to ensure that a class only has one instance, and to provide a global point of access to it. A database connection pool is a good example of where the Singleton pattern is used.

### Module Pattern
The overall structure of the application follows the Module pattern, which is a design pattern that uses modules to organize and encapsulate related pieces of code. In Node.js, each file is treated as a separate module.

### Observer Pattern
The websocket implementation is using the Observer pattern where events (like a new game or a new player) are broadcasted to all connected clients.

### Initializer Pattern
This pattern is used to manage the startup sequence of an application. Initializers are responsible for starting up the application in the correct order of dependencies. In the case of this app, initializers are making sure that connections to the database and Redis are established before the rest starts up.

## API Endpoints

This section provides a list of API endpoints for the application.

------------------------------------------------------------------------------------------

### Authentication Endpoints

<details>
 <summary><code>POST</code> <code><b>/auth/sign-in</b></code> <code>(This endpoint allows a user to sign in.)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username  |  required | string                  | N/A                                                                   |
> | password  |  required | string                  | N/A                                                                   |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `PlayerResponse`                                                       |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["Incorrect username or password"]}`          |

</details>

<details>
 <summary><code>POST</code> <code><b>/auth/sign-out</b></code> <code>(This endpoint allows a user to sign out. Requires an authenticated user.)</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `204`         | N/A                               | `No content. User signed out successfully`                           |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`          |

</details>

------------------------------------------------------------------------------------------

### Games Endpoints

<details>
 <summary><code>POST</code> <code><b>/games</b></code> <code>(This endpoint allows to create a new game. Requires an authenticated user.)</code></summary>

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | player1_id|  optional | string                  | Owner of the game                                                     |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `GameResponse`                                                         |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |
> | `403`         | `application/json`                | `{"code":403,"errors":["Not allowed"]}`                             |

</details>

<details>
 <summary><code>GET</code> <code><b>/games</b></code> <code>(This endpoint retrieves all games. Requires an authenticated user.)</code></summary>

##### Query Parameters

> | name          |  type     | data type                                                                                                                              | description          |
> |---------------|-----------|----------------------------------------------------------------------------------------------------------------------------------------|----------------------|
> | filters       | optional  | array( object({ conditions: object({ current_game_state, player1_id, player2_id, winner_id }), filterType: enum(["AND", "OR"]) }) )    | N/A                  |
> | limit         | optional  | number                                                                                                                                 | Pagination limit     |
> | offset        | optional  | number                                                                                                                                 | Pagination offset    |
> | orderBy       | optional  | enum(["created_at", "current_game_state", "finished_at"])                                                                              | N/A                  |
> | orderDirection| optional  | enum(["ASC", "DESC"])                                                                                                                  | N/A                  |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `{ games: GameResponse[], total: number }`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |

</details>

<details>
 <summary><code>GET</code> <code><b>/games/:game_id</b></code> <code>(This endpoint retrieves a game by ID. Requires an authenticated user.)</code></summary>

##### Parameters

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | game_id |  required | string     | Game ID                                                                   |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `GameResponse`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |

</details>

<details>
 <summary><code>PUT</code> <code><b>/games/:game_id</b></code> <code>(This endpoint allows a user to update a game. Requires an authenticated user.)</code></summary>

##### Parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | game_id    | required | string                  | N/A                                                                   |

##### Body

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | player1_id | optional | string                  | N/A                                                                   |
> | player2_id | optional | string                  | N/A                                                                   |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `GameResponse`                                |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |
> | `403`         | `application/json`                | `{"code":403,"errors":["Not allowed"]}`                             |

</details>

------------------------------------------------------------------------------------------

### Moves Endpoint

<details>
 <summary><code>POST</code> <code><b>/moves</b></code> <code>(This endpoint allows to create a new move. Requires an authenticated user.)</code></summary>

##### Body

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | game_id    | required  | string                  | ID of the game                                                                   |
> | position_x | required  | number                  | X coordinate of the move                                          |
> | position_y | required  | number                  | Y coordinate of the move                                          |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `MoveResponse`                                |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |
> | `403`         | `application/json`                | `{"code":403,"errors":["Not allowed"]}`                             |

</details>

------------------------------------------------------------------------------------------

### Players Endpoints

<details>
 <summary><code>POST</code> <code><b>/players</b></code> <code>(This endpoint allows to create a new player.)</code></summary>

##### Body

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | password    | required  | string.min(8)                  | N/A                                                                   |
> | username  | required  | string.max(100)                  | N/A                                         |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `PlayerResponse`                                |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |

</details>

<details>
 <summary><code>DELETE</code> <code><b>/players/:player_id</b></code> <code>(This endpoint allows to soft delete a player by ID. Requires an authenticated user.)</code></summary>

##### Parameters

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | player_id    | required  | string                | N/A                                                                   |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `204`         | `application/json`                | `No Content`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |
> | `403`         | `application/json`                | `{"code":403,"errors":["Not allowed"]}`                             |

</details>

<details>
 <summary><code>GET</code> <code><b>/players</b></code> <code>(This endpoint retrieves all players. Requires an authenticated user.)</code></summary>

##### Query Parameters

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | limit         | optional  | number                  | Pagination limit                                    |
> | offset        | optional  | number                  | Pagination offset                                   |
> | orderBy       | optional  | enum(["created_at", "deleted_at", "last_active_at", "player_id", "username",])    | N/A                |
> | orderDirection| optional  | enum(["ASC", "DESC"])                  | N/A                                                       |


##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `{ players: PlayerResponse[], total: number }`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |

</details>

<details>
 <summary><code>GET</code> <code><b>/players/current</b></code> <code>(This endpoint retrieves the current authenticated player. Requires an authenticated user.)</code></summary>

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `PlayerResponse`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |

</details>

<details>
 <summary><code>GET</code> <code><b>/players/:player_id</b></code> <code>(This endpoint retrieves a player by ID. Requires an authenticated user.)</code></summary>

##### Parameters

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | player_id    | required  | string                | N/A                                                                   |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `PlayerResponse`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |

</details>

<details>
 <summary><code>PUT</code> <code><b>/players/:player_id</b></code> <code>(This endpoint allows to update a player by ID. Requires an authenticated user.)</code></summary>

##### Parameters

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | player_id    | required  | string                | N/A                                                                   |

##### Body

> | name       |  type     | data type               | description                                                           |
> |------------|-----------|-------------------------|-----------------------------------------------------------------------|
> | username    | required  | string                | N/A                                                                   |

##### Responses

> | http code     | content-type                      | response                                                            |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `PlayerResponse`                                                        |
> | `400`         | `application/json`                | `{"code":400,"errors":["ValidationError"]}`                     |
> | `401`         | `application/json`                | `{"code":401,"errors":["AuthenticationError"]}`                     |
> | `403`         | `application/json`                | `{"code":403,"errors":["Not allowed"]}`                             |


</details>

## Authentication

The application implements a comprehensive authentication system. It allows users to create an account, sign in, and sign out. User sessions persist and are stored on the server in a Redis store, as well as in the browser via session cookies.

To better comprehend the authentication process, let's break it down into its main stages:

### Sign Up Flow

1. The user opens the application in their browser.
2. An initial API call to `GET /players/current` is sent to retrieve the authenticated user. However, as there's no session cookie in the request, a `401 Unauthorized` response is returned. Consequently, the user is presented with an authentication screen consisting of two forms instead of the game lobby.
3. The user enters a username and password, then clicks the "Create Account" button. This action sends a `POST /players` request with the entered details in the body.
4. The server validates the request, creates a new player in the database, sets the user status to "online", and creates a new session. It then returns the new player data along with a session cookie in the response.
5. The session cookie is stored in the browser.
6. The player data is cached on the client-side (via `TanStack Query`), and the user is redirected to the game lobby.

### Sign In Flow

1. The user opens the application in their browser.
2. An initial API call to `GET /players/current` is sent to retrieve the authenticated user. However, due to the absence of a session cookie in the request, a `401 Unauthorized` response is returned. As a result, the user is presented with an authentication screen.
3. The user enters their username and password, then clicks the "Sign In" button. This action sends a `POST /auth/sign-in` request with the entered details in the body.
4. The server validates the request, checks the username and password, sets the user status to "online", and creates a new session. It then returns the player data along with a session cookie in the response.
5. The session cookie is stored in the browser.
6. The player data is cached on the client-side (via `TanStack Query`), and the user is redirected to the game lobby.

### Valid Session Flow

1. The user opens the application in their browser.
2. An initial API call to `GET /players/current` is made to retrieve the authenticated user, with a valid session cookie included in the request.
3. The server validates the request, retrieves the player from the database, sets the user status to "online", and returns a `200 OK` response along with the player data.
4. The player data is cached on the client-side (via `TanStack Query`), and the user is redirected to the game lobby.

### Sign Out Flow

1. The user, already authenticated, is using the application.
2. The user opens the menu in the header and selects "Sign Out".
3. This action sends a `POST /auth/sign-out` request with a valid session cookie included.
4. The server validates the request, sets the user status to "offline", destroys the session, and sends a response with the same cookie, but with a past expiration date.
5. The browser receives a `204 No Content` response and removes the session cookie from its cache.
6. The user is redirected to the authentication screen.

## Real-time communication and Websockets

Server establishes real-time communication with the client via [Socket.IO](https://socket.io/) library. There's a special service, [WebsocketService](src/services/websocketService.ts). It handles 2 types of events:

1. **Query invalidation** (`emitInvalidateQuery`): This event sends a message to the client with a payload containing given query keys. Query keys are an array of strings (list entities) and strings with an ID (detail entity). Whenever such an event is received by the client, given entity is invalidated in the client-side cache (created via [TanStack Query](https://tanstack.com/query/latest)), which will trigger a refetch of related API endpoint. Examples
    - `{ entity: [QueryKey.Games, QueryKey.List] }` invalidates all endpoints fetching a list of games (`GET /games`, `GET /games?filters[0][conditions][current_game_state]=in_progress&limit=1`, `GET /games?filters[0][conditions][current_game_state]=finished&limit=4&offset=0`, etc.)
    - `{ entity: [QueryKey.Games, QueryKey.Detail], id: '29dc32af-b224-4ec8-b443-f658414531ad' }` invalidates endpoint fetching particular game entity (`GET /games/29dc32af-b224-4ec8-b443-f658414531ad`)

2. **Toast message** (`emitToast`): This event sends a message to the client with a string. When this message is received by the client, it will display a toast with a message from the payload. Examples:
    - `${player.username} just won ${game.name}!`
    - `${player.username} joined ${game.name}`
    - `New Game available - ${newGame.name}`

## Testing

This repository contains few tests, representing various testing strategies.

### Unit tests

Example unit tests, implemented with `Jest`:
- [src/features/players/__tests__/playerObject.test.ts](src/features/players/__tests__/playerObject.test.ts)
- [src/services/__tests__/redisService.test.ts](src/services/__tests__/redisService.test.ts)
- [src/services/__tests__/passwordService.test.ts](src/services/__tests__/passwordService.test.ts)

### Integration tests

Example integration tests of `GET /games` route, implemented with `Jest` and `Supertest`:
- [src/features/games/__tests__/gameRoutes/GET_games/2xx_GET_games.test.ts](src/features/games/__tests__/gameRoutes/GET_games/2xx_GET_games.test.ts)
- [src/features/games/__tests__/gameRoutes/GET_games/4xx_GET_games.test.ts](src/features/games/__tests__/gameRoutes/GET_games/4xx_GET_games.test.ts)
- [src/features/games/__tests__/gameRoutes/GET_games/5xx_GET_games.test.ts](src/features/games/__tests__/gameRoutes/GET_games/5xx_GET_games.test.ts)