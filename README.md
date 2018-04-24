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

auto log function calls in operation/action model with a single line of code, based on [n-logger](https://github.com/Financial-Times/n-logger)

<br>

- [quickstart](#quickstart)
- [install](#install)
- [usage](#usage)
   * [action function format](#action-function-format)
   * [operation function format](#operation-function-format)
   * [use with other enhancers](#use-with-other-enhancers)
   * [default filtered fields](#default-filtered-fields)
   * [reserved filed override](#reserved-field-override)
   * [test stub](#test-stub)
- [built-in](#built-in)
   * [out-of-box error parsing support](#out-of-box-error-parsing-support)
   * [clean up log object](#clean-up-log-object)
- [example](#example)
- [development](#development)
- [todos](#todos)

<br>

## quickstart
```js
import { 
  autoLogAction, 
  autoLogActions, 
  autoLogOp,
  autoLogOps,
  toMiddleware,
  toMiddlewares,
} from '@financial-times/n-express-enhancer';
```

```js
// auto log a function of its start, success/failure state with function name as `action`
const result = autoLogAction(someFunction)(args: Object, meta?: Object);

// auto log multiple functions wrapped in an object
const APIService = autoLogActions({ methodA, methodB, methodC });
```

> more details on [action function format](#action-function-format)

```js
// auto log an operation function of its start, success/failure state with function name as `operation`
const operationFunction = (meta, req, res) => { /* try-catch-throw */ };

const someMiddleware = compose(toMiddleware, autoLogOp)(operationFunction) 

// auto log multiple operation functions wrapped in an object as controller
const someController = compose(toMiddlewares, autoLogOps)({ operationFunctionA, operationFuncitonB });
```

> more details on [operation function format](#operation-function-format)

> more details on [use with other enhancers](#use-with-other-enhancers)

```js
// set key names of fields to be muted in .env to reduce log for development or filter fields in production
LOGGER_MUTE_FIELDS=transactionId, userId
```

## install
```shell
npm install @financial-times/n-express-enhancer
```

## usage
