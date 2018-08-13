# n-express-enhancer 

toolsets to create javascript function enhancers ([decorators](https://hackernoon.com/function-decorators-part-2-javascript-fadd24e57f83) but more powerful and robust)

[![npm version](https://badge.fury.io/js/%40financial-times%2Fn-express-enhancer.svg)](https://badge.fury.io/js/%40financial-times%2Fn-express-enhancer)
![npm download](https://img.shields.io/npm/dm/@financial-times/n-express-enhancer.svg)
![node version](https://img.shields.io/node/v/@financial-times/n-express-enhancer.svg)


[![CircleCI](https://circleci.com/gh/Financial-Times/n-express-enhancer.svg?style=shield)](https://circleci.com/gh/Financial-Times/n-express-enhancer)
[![Coverage Status](https://coveralls.io/repos/github/Financial-Times/n-express-enhancer/badge.svg?branch=master)](https://coveralls.io/github/Financial-Times/n-express-enhancer?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/Financial-Times/n-express-enhancer/badge.svg)](https://snyk.io/test/github/Financial-Times/n-express-enhancer)
[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/Financial-Times/n-express-enhancer/badges/quality-score.png?b=master)](https://scrutinizer-ci.com/g/Financial-Times/n-express-enhancer/?branch=master)
[![Dependencies](https://david-dm.org/Financial-Times/n-express-enhancer.svg)](https://david-dm.org/Financial-Times/n-express-enhancer)
[![devDependencies](https://david-dm.org/Financial-Times/n-express-enhancer/dev-status.svg)](https://david-dm.org/Financial-Times/n-express-enhancer?type=dev)

<br>

- [Install](#install)
- [Create Enhancers](#create-enhancers)
- [Use Enhancers](#use-enhancers)
  * [enhance a set of functions](#enhance-a-set-of-functions)
  * [chain enhancers together](#chain-enhancers-together)
- [Available Enhancers](#available-enhancers)
  * [auto next for express](#auto-next-for-express)
  * [auto log for express](#auto-log-for-express)
  * [auto metrics for express](#auto-metrics-for-express)
  * [auto next/log/metrics for express](#auto-next-log-metrics-for-express)
- [Licence](#licence)

<br>


## Install
```shell
npm install @financial-times/n-express-enhancer -D
```

## Create Enhancers

upgrade a decorator to an enhancer with `createEnhancer`

```js
import { createEnhancer } from '@financial-times/n-express-enhancer';

// create a decorator with currying
const decorator = targetFunction => (...args) => {
  // ...enhancement
  return targetFunction(...args);
}

export default createEnhancer(decorator);
```

Decorators created by currying with arrow functions in ES6 would return a decorated function with `undefined` name, as arrow functions are anonymous. 

Enhancers upgraded from decorators by `createEnhancer` would return an enhanced function inheriting the original name of the target function, which is useful if you need to access the function name and make it available in the next chained enhancer. Furthermore, enhancers can also enhance a function bundle (functions wrapped as methods in an object), handy for reducing repeated lines to enhance a set of functions.

## Use Enhancers

### enhance a set of functions

```js
export default enhancer({
  someFunctionA: () => {},
  someFunctionB: () => {},
});
```

### chain enhancers together
```js
import { errorToHandler, compose } from '@financial-times/n-express-enhancer';

const someMiddleware = (req, res) => {};
export default compose(errorToHandler, enhancerA, enhancerB)(someMiddleware);
```

> [order of how enhancers would be executed](https://innolitics.com/articles/javascript-decorators-for-promise-returning-functions/)

## Available Enhancers

### auto next for express

There's an enhancer included in the package that can be used to enhance middleware/controller function in express to next() any error caught to error handler or calling next() on successful middleware execution.

From:
```js
const someMiddleware = (req, res, next) => {
 try {
   //...throw error if needed
   next();
 } catch(e) {
   next(e);
 }
};

export default someMiddleware;
```

To:
```js
import { errorToHandler } from '@financial-times/n-express-enhancer';

const someMiddleware = (req, res) => {
  //...throw error if needed
};

export default errorToHandler(someMiddleware);
```

If you need to use `res.render` in controller, please use `enhancedRender` together. This is due to an restriction in express@4.

```js
import { enhancedRender } from '@financial-times/n-express-enhancer';

app.use('/route', enhancedRender, enhancedMiddleware);
```

### auto log for express
[n-auto-logger](https://github.com/financial-Times/n-auto-logger) - auto log every operation and action in express

### auto metrics for express
[n-auto-metrics](https://github.com/financial-Times/n-auto-metrics) - complementary metrics to refelect operations and actions

### auto next/log/metrics for express
[n-express-monitor](https://github.com/financial-Times/n-express-monitor)

## Licence
[MIT](/LICENSE)
