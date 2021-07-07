# NestJs boilerplate API

Simple NestJs API with CRUD operations and users auth

[![linter](https://github.com/wavilikhin/nest-api/actions/workflows/main-01-lint.yml/badge.svg)](https://github.com/wavilikhin/nest-api/actions/workflows/main-01-lint.yml)
[![unit tests](https://github.com/wavilikhin/nest-api/actions/workflows/main-02-unit-tests.yml/badge.svg)](https://github.com/wavilikhin/nest-api/actions/workflows/main-02-unit-tests.yml)
[![e2e tests](https://github.com/wavilikhin/nest-api/actions/workflows/main-03-e2e-tests.yml/badge.svg)](https://github.com/wavilikhin/nest-api/actions/workflows/main-03-e2e-tests.yml)
[![docker image](https://github.com/wavilikhin/nest-api/actions/workflows/main-04-docker.yml/badge.svg)](https://github.com/wavilikhin/nest-api/actions/workflows/main-04-docker.yml)

## Tech Stack

NestJs, Typescript, Mongo, Jest

## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## API Reference

#### Get all items

```http
  GET /api/items
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `api_key` | `string` | **Required**. Your API key |

#### Get item

```http
  GET /api/items/${id}
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `id`      | `string` | **Required**. Id of item to fetch |

#### add(num1, num2)

Takes two numbers and returns the sum.

## Deployment

To deploy this project run

```bash
  npm run deploy
```
