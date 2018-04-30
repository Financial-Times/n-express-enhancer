import {
	compose,
	toMiddleware,
	enhancedRender,
	createEnhancer,
	isPromise,
} from '../index';

describe('n-express-enhancer exports', () => {
	it('compose', () => {
		expect(typeof compose).toBe('function');
	});

	it('toMiddleware', () => {
		expect(typeof toMiddleware).toBe('function');
	});

	it('enhancedRender', () => {
		expect(typeof enhancedRender).toBe('function');
	});

	it('createEnhancer', () => {
		expect(typeof createEnhancer).toBe('function');
	});

	it('isPromise', () => {
		expect(typeof isPromise).toBe('function');
	});
});
