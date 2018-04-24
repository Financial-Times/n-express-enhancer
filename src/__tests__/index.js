import { toMiddleware, toMiddlewares, enhancedRender } from '../index';

describe('n-express-enhancer exports', () => {
	it('toMiddleware', () => {
		expect(typeof toMiddleware).toBe('function');
	});

	it('toMiddlewares', () => {
		expect(typeof toMiddlewares).toBe('function');
	});

	it('enhancedRender', () => {
		expect(typeof enhancedRender).toBe('function');
	});
});
