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
  * [develop an enhancer](#develop-an-enhancer)
- [terminology](#terminology)
  * [operation function](#operation-function)
  * [operation function bundle](#operation-function-bundle)
  * [enhancement function](#enhancement-function)
  * [enhancer](#enhancer)

<br>

## quickstart
```js
import { toMiddleware } from '@financial-times/n-express-enhancer';

// convert an operation function to an express middleware
const operationFunction = (meta, req, res) => {};

export default toMiddleware(operationFunction);

// convert an operation function bundle (wrapped in an Object)
export default toMiddleware({
  operationFunctionA,
  operationFunctionB,
});
```
> more details on [operation function](#operation-function)

> Error would be thrown if input to toMiddleware is not a function or a function bundle

```js
// use enhancedRender before any converted middleware if you need to use `res.render`
import { enhancedRender } from '@financial-times/n-express-enhancer';

app.use('/route', enhancedRender, convertedMiddleware);
```

## install
```shell
npm install @financial-times/n-express-enhancer
```

## usage

### develop an enhancer
```js
// use `createEnhancer` to create an enhancer that could 
// enhance both individual function or function bundle
import { createEnhancer } from '@financial-times/n-express-enhancer';

// Enhancement Function
const enhancerName = operationFunction => (/* output function signature */) => {
  //... do the enhancement or side effect you want
  //... remember to invoke the orignal operationFunction
  operationFunction();
};

export default createEnhancer(enhancerName);
```

> more details on [enhancement function](#enhancement-function)

> Error would be thrown if input to enhancer created is not a function or a function bundle

> check how `toMiddleware` is implemented for [example](/src/convertor.js)


## terminology

### operation function

Operation Function generally refers to a function with such signature `(meta, req, res) => {}` that can be enhanced by an Enhancer or converted to a Middleware. 

It has a similar signature to express middleware, while `next` is not needed, as it would be taken care of by `toMiddleware` convertor and `meta` is added to allow pass metadata conviniently to functions inside the scope, without mutating `req`, `res` and make the signature distinctive.

Based on the error handling behaviour, there're two types of Operation Function as below.

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

### operation function bundle

Operation Function Bundle is an Object that wraps Operation Funcitons as methods, methods of which can be enhanced by enhancers when input the bundle. No values other than functions are allowed.

```js
const bundle = {
  methodA: (meta, req, res) => {},
  methodB: (meta, req, res) => {},
};
```

### enhancement function

Enhancement Function generally refers to curry functions that take an Operation Function as the input, and add extra logics (such as logging, params update) to invoke the Operation Function, which can be augmented by `createEnhancer` to be able to enhance both individual Operation Function or Operation Function Bundle. 

> the original function names would be sustained or method names would be used as function names

```js
const enhancementFunction = operationFunction => (/* output function signature */) => {
  //... do the enhancement or side effect you want
  //... the orignal operationFunction can be invoked as it is or with updated params
  operationFunction();
};
```

### enhancer

Enhancers are higher-order functions with `createEnhancer` from Enhancement Function, that can enhance both individual Operation Function or Operation Function Bundle.
