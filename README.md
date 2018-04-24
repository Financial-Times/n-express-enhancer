# n-express-enhancer 

[![npm version](https://badge.fury.io/js/%40financial-times%2Fn-express-enhancer.svg)](https://badge.fury.io/js/%40financial-times%2Fn-express-enhancer)
![npm download](https://img.shields.io/npm/dm/@financial-times/n-express-enhancer.svg)
![node version](https://img.shields.io/node/v/@financial-times/n-express-enhancer.svg)


[![CircleCI](https://circleci.com/gh/Financial-Times/n-express-enhancer.svg?style=shield)](https://circleci.com/gh/Financial-Times/n-express-enhancer)
[![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-express-enhancer/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-express-enhancer?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-express-enhancer/badge.svg)](https://snyk.io/test/github/Financial-Times/n-express-enhancer)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Financial-Times/n-express-enhancer/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Financial-Times/n-express-enhancer/?branch=master)
[![Dependencies](https://david-dm.org/Financial-Times/n-express-enhancer.svg)](https://david-dm.org/Financial-Times/n-express-enhancer)
[![devDependencies](https://david-dm.org/Financial-Times/n-express-enhancer/dev-status.svg)](https://david-dm.org/Financial-Times/n-express-enhancer?type=dev)

common components you need to build an express middleware enhancer

<br>

- [quickstart](#quickstart)
- [install](#install)
- [usage](#usage)
   * [operation function](#operation-function)

<br>

## quickstart
```js
import { toMiddleware, enhancedRender } from '@financial-times/n-express-enhancer';
```

```js
// convert an operation function to an express middleware
const operationFunction = (meta, req, res) => {};

export default toMiddleware(operationFunction);
```

> more details on [operation function](#operation-function)

```js
// convert a set of operation functions wrapped in an object
export default toMiddleware({
  operationFunctionA,
  operationFunctionB,
});
```

> Error would be thrown if input to toMiddleware is not a function or a function bundle

```js
// use enhancedRender before any converted middleware if you need to use `res.render`
app.use('/route', enhancedRender, convertedMiddleware);
```

## install
```shell
npm install @financial-times/n-express-enhancer
```

## usage

### operation function

#### `resless` operation function

```js
const operation = async (meta, req) => {
  try {
    const { params } = req;
    const data = await fetchSomeData(paramA, meta);
  } catch(e) {
    // specify error handling for this particular step, recommending use `n-error`
    // ...
    // resless operation function must throw the enriched error object, and it would be forwarded to the errorHandler middleware
    throw e;
  }
  return data;
};
```

#### `resful` operation function

```js
const operation = async (meta, req, res) => {
  try {
    const { params } = req;
    const data = await fetchSomeData(params, meta);
  } catch(e) {
    // write the error handling behaviour and end the request here
    // ...
    res.stats(e.status).render('errorPage', e);
  }
  return data;
};
```
