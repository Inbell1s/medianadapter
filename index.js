const { Requester, Validator } = require('@chainlink/external-adapter');
const CustomAggregator = require('./CustomAggregator');

const customError = (data) => {
  if (data.Response === 'Error') return true;
  return false;
};

const customParams = {
  base: ['base', 'from', 'coin'],
  quote: ['quote', 'to', 'market'],
  endpoint: false
};

const createRequest = (input, endPointCallback) => {
  const validator = new Validator(input, customParams);
  const jobRunID = validator.validated.id;

  const base = validator.validated.data.base;
  const quote = validator.validated.data.quote;

  const promises = CustomAggregator.apiSources.map((apiSource) => {
    const url = CustomAggregator.getUrl(apiSource, base, quote);
    const path = CustomAggregator.getPath(apiSource, base, quote);

    const params = {};
    const config = { url, params };

    return Requester.request(config, customError)
      .then(response => {
        response.data.result = Requester.validateResultNumber(response.data, path);
        const result = Requester.success(jobRunID, response);
        return Promise.resolve({ result, apiSource });
      })
      .catch(error => {
        console.log('Error from call to ', apiSource, error.message);
        return Promise.reject({ error, apiSource });
      });
  });

  return Promise.allSettled(promises)
    .then((responses) => {
      const fulfilledResponses = responses.filter((response) => {
        return response.status == 'fulfilled';
      });
      console.log(`Received ${fulfilledResponses.length} fulfilled responses.`);

      if (fulfilledResponses.length < 3) {
        throw 'Less than 3 fulfilled responses.'
      }

      const prices = fulfilledResponses.map((response) => {
        return {
          apiSource: response.value.apiSource,
          value: String(response.value.result.result)
        };
      });

      const median = CustomAggregator.getMedian(prices.map(price => price.value));

      endPointCallback(200, {
        jobRunID,
        data: {
          base: base,
          quote: quote,
          prices: prices,
          result: String(median),
        },
        statusCode: 200,
      });
    })
    .catch(error => {
      console.log('Error getting aggregated price', error)
      endPointCallback(500, Requester.errored(jobRunID, error));
    });
}

// This is a wrapper to allow the function to work with
// GCP Functions
exports.gcpservice = (req, res) => {
  createRequest(req.body, (statusCode, data) => {
    res.status(statusCode).send(data);
  });
};

// This is a wrapper to allow the function to work with
// AWS Lambda
exports.handler = (event, context, callback) => {
  createRequest(event, (statusCode, data) => {
    callback(null, data);
  });
};

// This is a wrapper to allow the function to work with
// newer AWS Lambda implementations
exports.handlerv2 = (event, context, callback) => {
  createRequest(JSON.parse(event.body), (statusCode, data) => {
    callback(null, {
      statusCode: statusCode,
      body: JSON.stringify(data),
      isBase64Encoded: false
    });
  });
};

module.exports.createRequest = createRequest;
