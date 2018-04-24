import { toMiddlewareWrapper } from '../wrapper';

describe('toMiddlewareWrapper', () => {
	it('enhance input function with toMiddleware', () => {
		const operationFunction = () => {};
		const enhanced = toMiddlewareWrapper(operationFunction);
		expect(typeof enhanced).toBe('function');
		expect(enhanced.name).toBe('operationFunction');
	});

	it('enhance input function bundle with toMiddlewares', () => {
		const createOperationFunction = () => () => {};
		const bundle = {
			methodA: createOperationFunction(),
			methodB: createOperationFunction(),
		};
		const enhanced = toMiddlewareWrapper(bundle);
		expect(typeof enhanced).toBe('object');
		expect(typeof enhanced.methodA).toBe('function');
		expect(enhanced.methodA.name).toBe('methodA');
		expect(typeof enhanced.methodB).toBe('function');
		expect(enhanced.methodB.name).toBe('methodB');
	});

	it('throws error if given invalid input', () => {
		const inputString = () => toMiddlewareWrapper('test');
		expect(inputString).toThrowErrorMatchingSnapshot();

		const inputInvalidObject = () =>
			toMiddlewareWrapper({
				foo: 'bar',
			});
		expect(inputInvalidObject).toThrowErrorMatchingSnapshot();
	});
});
