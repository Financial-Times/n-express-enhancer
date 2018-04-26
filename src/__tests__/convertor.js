import express from 'express';
import request from 'supertest';
import compose from 'compose-function';

import { toMiddleware, toMiddlewares } from '../convertor';
import enhancedRender from '../renderer';

const commonErrorInstance = { status: 404, message: 'Not Found' };
const errorOperationFunction = () => {
	throw commonErrorInstance;
};
/* eslint-disable no-unused-vars */
const commonErrorHandler = (err, req, res, next) => {
	res.status(err.status).send(err);
};
/* eslint-enable no-unused-vars */

const sideEffectFunction = jest.fn();
const mockMeta = {
	foo: 'bar',
};
const middlewareEnhancer = operationFunction => async (meta = {}, req, res) => {
	try {
		const newMeta = { ...meta, ...mockMeta };
		sideEffectFunction();
		await operationFunction(newMeta, req, res);
	} catch (e) {
		throw e;
	}
};

const resMock = {
	status: () => resMock,
	end: () => {
		resMock.headersSent = true;
	},
	send: () => {
		resMock.headersSent = true;
	},
	render: () => {
		resMock.headersSent = true;
	},
	reset: () => {
		resMock.headersSent = false;
		resMock.rendered = undefined;
	},
	headersSent: false,
};

describe('toMiddleware', () => {
	afterEach(() => {
		jest.resetAllMocks();
		resMock.reset();
	});

	it('sustain operation function name', () => {
		const operationFunction = () => {};
		const converted = toMiddleware(operationFunction);
		expect(converted.name).toBe(operationFunction.name);
		expect(converted.name).toBe('operationFunction');
	});

	describe('convert operation function to an express middleware', () => {
		describe('and call next() when input resless operation function of', () => {
			it('async', async () => {
				const operationFunction = async (meta, req) => {
					req.test = await 'foo';
				};
				const middleware = toMiddleware(operationFunction);

				const req = {};
				const next = jest.fn();
				await middleware(req, resMock, next);
				expect(next.mock.calls).toHaveLength(1);
				expect(req.test).toBe('foo');
			});

			it('non-async', async () => {
				const operationFunction = (meta, req) => {
					req.test = 'foo';
				};
				const middleware = toMiddleware(operationFunction);

				const req = {};
				const next = jest.fn();
				await middleware(req, resMock, next);
				expect(next.mock.calls).toHaveLength(1);
				expect(req.test).toBe('foo');
			});
		});

		describe('and not call next() when input resful operation function of', () => {
			it('async', async () => {
				const operationFunction = async (meta, req, res) => {
					await res.status(200).end();
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toHaveLength(0);

				const app = express();
				app.use('/', middleware);
				const response = await request(app).get('/');
				expect(response.statusCode).toBe(200);
			});

			it('non-async', async () => {
				const operationFunction = (meta, req, res) => {
					res.status(200).end();
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toHaveLength(0);

				const app = express();
				app.use('/', middleware);
				const response = await request(app).get('/');
				expect(response.statusCode).toBe(200);
			});
		});
	});

	describe('handle error in operation function', () => {
		describe('by next(e) thrown error to errorHandler when convert resless operation function of ', () => {
			it('async', async () => {
				const operationFunction = async () => {
					throw await commonErrorInstance;
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toMatchSnapshot();

				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.body).toEqual(commonErrorInstance);
			});

			it('non-async', async () => {
				const operationFunction = () => {
					throw commonErrorInstance;
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toMatchSnapshot();

				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.body).toEqual(commonErrorInstance);
			});
		});

		describe('by error handling in operation function when convert resful operation function of', () => {
			it('async', async () => {
				const operationFunction = async (meta, req, res) => {
					try {
						throw await commonErrorInstance;
					} catch (e) {
						await res.status(500).send('internal server error');
					}
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toHaveLength(0);

				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.statusCode).toBe(500);
				expect(response.text).toBe('internal server error');
			});

			it('non-async', async () => {
				const operationFunction = (meta, req, res) => {
					try {
						throw commonErrorInstance;
					} catch (e) {
						res.status(500).send('internal server error');
					}
				};
				const middleware = toMiddleware(operationFunction);

				const next = jest.fn();
				await middleware({}, resMock, next);
				expect(next.mock.calls).toHaveLength(0);

				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.statusCode).toBe(500);
				expect(response.text).toBe('internal server error');
			});
		});
	});

	describe('converted resful operation function of res.render works with enhancedRender in case of ', () => {
		it('success', async () => {
			const operationFunction = (meta, req, res) => {
				res.render();
			};
			const middleware = toMiddleware(operationFunction);
			const next = jest.fn();
			await enhancedRender({}, resMock, next);
			expect(next.mock.calls).toHaveLength(1);
			expect(resMock.rendered).toBe(undefined);
			await middleware({}, resMock, next);
			expect(next.mock.calls).toHaveLength(1);
			expect(resMock.rendered).toBe(true);
		});

		it('failure', async () => {
			const operationFunction = (meta, req, res) => {
				try {
					throw commonErrorInstance;
				} catch (e) {
					res.render('some page');
				}
			};
			const middleware = toMiddleware(operationFunction);
			const next = jest.fn();
			await enhancedRender({}, resMock, next);
			expect(next.mock.calls).toHaveLength(1);
			expect(resMock.rendered).toBe(undefined);
			await middleware({}, resMock, next);
			expect(next.mock.calls).toHaveLength(1);
			expect(resMock.rendered).toBe(true);
		});
	});

	describe('can convert and triggers an enhanced operation function and pass updated meta in', () => {
		describe('success of', () => {
			it('async function', async () => {
				const operationFunction = async (meta, req, res) => {
					await res.send(meta);
				};
				const middleware = compose(toMiddleware, middlewareEnhancer)(
					operationFunction,
				);
				const app = express();
				app.use('/', middleware);
				const response = await request(app).get('/');
				expect(sideEffectFunction.mock.calls).toHaveLength(1);
				expect(response.body).toEqual(mockMeta);
			});

			it('non-async function', async () => {
				const operationFunction = (meta, req, res) => {
					res.send(meta);
				};
				const middleware = compose(toMiddleware, middlewareEnhancer)(
					operationFunction,
				);
				const app = express();
				app.use('/', middleware);
				const response = await request(app).get('/');
				expect(sideEffectFunction.mock.calls).toHaveLength(1);
				expect(response.body).toEqual(mockMeta);
			});
		});

		describe('failure of', () => {
			it('async function', async () => {
				const operationFunction = async () => {
					throw await commonErrorInstance;
				};
				const middleware = compose(toMiddleware, middlewareEnhancer)(
					operationFunction,
				);
				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.body).toEqual(commonErrorInstance);
			});

			it('non-async function', async () => {
				const operationFunction = errorOperationFunction;
				const middleware = compose(toMiddleware, middlewareEnhancer)(
					operationFunction,
				);
				const app = express();
				app.use('/', middleware, commonErrorHandler);
				const response = await request(app).get('/');
				expect(response.body).toEqual(commonErrorInstance);
			});
		});
	});
});

describe('toMiddlewares', () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it('decorate each method correctly', async () => {
		const operationFunctionA = (meta, req, res) => {
			res.status(200).send(meta);
		};
		const operationFunctionB = (meta, req, res) => {
			res.status(200).send(meta);
		};
		const enhanced = toMiddlewares({
			operationFunctionA,
			operationFunctionB,
		});
		expect(enhanced.operationFunctionA.name).toBe('operationFunctionA');
		expect(enhanced.operationFunctionB.name).toBe('operationFunctionB');
		const app = express();
		app.use('/a', enhanced.operationFunctionA);
		app.use('/b', enhanced.operationFunctionB);
		const resA = await request(app).get('/a');
		expect(resA.statusCode).toBe(200);
		const resB = await request(app).get('/b');
		expect(resB.statusCode).toBe(200);
	});

	it('set anonymous function names as per property name correctly', async () => {
		const createOperationFunction = () => (meta, req, res) => {
			res.status(200).send(meta);
		};
		const operationFunctionA = createOperationFunction();
		const operationFunctionB = createOperationFunction();
		const enhanced = toMiddlewares({
			operationFunctionA,
			operationFunctionB,
		});
		expect(enhanced.operationFunctionA.name).toBe('operationFunctionA');
		expect(enhanced.operationFunctionB.name).toBe('operationFunctionB');
	});
});
