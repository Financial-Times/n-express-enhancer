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

things you need to build and use an express middleware enhancer

<br>

- [quickstart](#quickstart)
- [install](#install)
- [usage](#usage)
  * [use a series of enhancers](#use-a-series-of-enhancers)
  * [develop an enhancer](#develop-an-enhancer)
  * [available enhancers](#available-enhancers)
- [terminology](#terminology)
  * [operation function](#operation-function)
  * [operation function bundle](#operation-function-bundle)
  * [action function](#action-function)
  * [action function bundle](#action-function-bundle)
  * [enhancement function](#enhancement-function)
  * [enhancer](#enhancer)

<br>

## quickstart

`n-express-enhancer` can help to streamline building an middleware enhancer for express. It proposed a pattern to write operation function that can be enhanced, and finally converted to middleware with `toMiddleware` convertor.

> more details on [operation function](#operation-function)

```js
import { toMiddleware } from '@financial-times/n-express-enhancer';

/* -- convert an enhanced operation function  -- */
const operationFunction = (meta, req, res) => {};
export default toMiddleware(enhancer(operationFunction));

/* -- convert an operation function bundle  -- */
export default toMiddleware(enhancer({
  operationFunctionA,
  operationFunctionB,
}));
```

> Error would be thrown if input to toMiddleware is not a function or a function bundle

If you need to use `res.render` in the operation function, please use enhancedRender before any converted middleware. This is due to restriction from express@4 and likely wouldn't be needed when updated to express@5.

```js
import { enhancedRender } from '@financial-times/n-express-enhancer';

app.use('/route', enhancedRender, convertedMiddleware);
```

## install
```shell
yarn add @financial-times/n-express-enhancer
```

## usage

### use a series of enhancers
```js
import compose from 'compose-function'; // recommended
import { toMiddleware } from '@financial-times/n-express-enhancer';

/* -- convert an enhanced operation function  -- */
const operationFunction = (meta, req, res) => {};
export default compose(toMiddleware, enhancerA, enhancerB)(operationFunction);

/* -- convert an operation function bundle  -- */
export default compose(toMiddleware, enhancerA, enhancerB)({
  operationFunctionA,
  operationFunctionB,
});
```

### develop an enhancer
```js
// use `createEnhancer` to create an enhancer that could 
// enhance both individual function or function bundle (either operation or action)
import { createEnhancer } from '@financial-times/n-express-enhancer';

// Enhancement Function
const enhancerName = inputFunction => (/* output function signature */) => {
  //... do the enhancement or side effect you want
  //... remember to invoke the orignal inputFunction
  inputFunction();
};

export default createEnhancer(enhancerName);
```

> more details on [enhancement function](#enhancement-function)

> Error would be thrown if input to enhancer created is not a function or a function bundle

> check how `toMiddleware` is implemented for [example](/src/convertor.js)

### available enhancers

* [n-auto-logger](https://github.com/financial-Times/n-auto-logger) - auto log every operation and action in express
* [n-auto-metrics](https://github.com/financial-Times/n-auto-metrics) - complementary metrics to refelect operations and actions


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

### action function

Operation Function generally refers to a function with such signature `(params, meta) => {}` that is friendly for logger, validator, etc. 

### action function bundle

Similarly, Action Function Bundle is an Object that wraps Action Funcitons as methods, methods of which can be enhanced by enhancers when input the bundle. No values other than functions are allowed.

### enhancement function

Enhancement Function generally refers to curry functions that take an Operation Function/Action Function as the input, and add extra logics (such as logging, params update) and invoke the original input function. Enhancement Function itself can only enhance individual input function. 

It can be augmented by `createEnhancer` to be able to enhance both individual function and function bundle. 

```js
const enhancementFunction = operationFunction => (/* output function signature */) => {
  //... do the enhancement or side effect you want
  //... the orignal operationFunction can be invoked as it is or with updated params
  operationFunction();
};
```

### enhancer

Enhancers are higher-order functions created by `createEnhancer` based on Enhancement Function, that can enhance both individual Operation/Action Function and Operation/Action Function Bundle.

> the original function names would be sustained if enhancer applies to individual function

> when applies to function bundle, the names of orignal functions in the bundle would be aligned to the method names (in case you need to access the name in the enhancement function), and the names of enhanced functions in the output bundle would use method names as well
