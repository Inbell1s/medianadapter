const config = require('dotenv').config();

const API_REF = {
  huobi: {
    getUri: (base, quote) => {
      const api = 'https://api.huobi.pro/market/trade';
      const url = `${api}?symbol=${base.toLowerCase()}${quote.toLowerCase()}t`;

      return url;
    },
    getPath: (base, quote) => {
      return ['tick', 'data', '0', 'price'];
    }
  },
  binance: {
    getUri: (base, quote) => {
      const api = 'https://api.binance.com/api/v1/ticker/price';
      const url = `${api}?symbol=${base.toUpperCase()}${quote.toUpperCase()}T`;

      return url;
    },
    getPath: (base, quote) => {
      return ['price'];
    }
  },
  gateio: {
    getUri: (base, quote) => {
      const api = 'https://api.gateio.ws/api/v4/spot/tickers?currency_pair=';
      const url = `${api}${base.toUpperCase()}_${quote.toUpperCase()}T`;

      return url;
    },
    getPath: (base, quote) => {
      return ['0','last'];
    }
  },
  coinbase: {
    getUri: (base, quote) => {
      const api = 'https://api.pro.coinbase.com/products';
      const url = `${api}/${base.toLowerCase()}-${quote.toLowerCase()}/ticker`;

      return url;
    },
    getPath: (base, quote) => {
      return ['price'];
    }
  },
  okex: {
    getUri: (base, quote) => {
      const api = 'https://www.okex.com/api/margin/v3/instruments';
      const url = `${api}/${base.toLowerCase()}-${quote.toLowerCase()}T/mark_price`;

      return url;
    },
    getPath: (base, quote) => {
      return ['mark_price'];
    }
  },
  ftx: {
    getUri: (base, quote) => {
      const api = 'https://ftx.com/api/markets';
      const url = `${api}/${base.toLowerCase()}/${quote.toLowerCase()}`;

      return url;
    },
    getPath: (base, quote) => {
      return ['result','last'];
    }
  },
  kucoin: {
    getUri: (base, quote) => {
      const api = 'https://api.kucoin.com/api/v1/market/orderbook/level1?symbol=';
      const url = `${api}${base.toUpperCase()}-${quote.toUpperCase()}T`;

      return url;
    },
    getPath: (base, quote) => {
      return ['data','price'];
    }
  }
};

class CustomAggregator {
  static apiSources = Object.keys(API_REF);

  static getUrl(source, base, quote) {
    return API_REF[source].getUri(base, quote);
  };

  static getPath(source, base, quote) {
    return API_REF[source].getPath(base, quote);
  };

  static getMedian(values) {
    const mid = Math.floor(values.length / 2);
    const nums = [...values].sort((a, b) => a - b);
    return values.length % 2 !== 0 ? nums[mid] : (parseFloat(nums[mid - 1]) + parseFloat(nums[mid])) / 2;
  }
};

module.exports = CustomAggregator;
