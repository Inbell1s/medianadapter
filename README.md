# GFarm2-Aggregator-Adapter

Clone this repo and cd into the project directory

See [Install Locally](#install-locally) for a quickstart

## Input Params

- `base`, `from`, or `coin`: The symbol of the currency to query
- `quote`, `to`, or `market`: The symbol of the currency to convert to

## Sample Output

```json
{
  "jobRunID": "1",
  "data": {
    "base": "btc",
    "quote": "usd",
    "prices": [
      {
        "apiSource": "huobi",
        "value": 53646.53
      },
      {
        "apiSource": "binance",
        "value": 53649.99
      },
      {
        "apiSource": "cryptocompare",
        "value": 53683.69
      },
      {
        "apiSource": "coinbase",
        "value": 53740.47
      },
      {
        "apiSource": "okex",
        "value": 53642.2
      },
      {
        "apiSource": "ftx",
        "value": 53719
      },
      {
        "apiSource": "kucoin",
        "value": 53635.6
      }
    ],
    "result": 53649.99
  },
  "statusCode": 200
}
```

## Install Locally

Install dependencies:

```bash
yarn
```
or
```bash
npm install
```

### Setup Env variables

Create a `.env` file in the project directory:

```bash
touch .env
```

Then copy the content from `.env.sample` into `.env`, replacing the placeholder values with your API keys.

Natively run the application (defaults to port 8080):

### Run

```bash
yarn start
```
or
```bash
npm run start
```

## Call the external adapter/API server

```bash
curl --location --request POST 'http://localhost:8080' --header 'Accept: application/json' --header 'Content-Type: application/json' --data '{"data": {"base":"btc","quote":"usd"}}'
```

## Docker

If you wish to use Docker to run the adapter, you can build the image by running the following command:

```bash
docker build . -t gfarm2-aggregator-adapter
```

Then run it with:

```bash
docker run -p 8080:8080 -it gfarm2-aggregator-adapter:latest
```
