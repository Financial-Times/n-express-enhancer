import { toMiddleware, enhancedRender } from '../index';

describe('n-express-enhancer exports', () => {
	it('toMiddleware', () => {
		expect(typeof toMiddleware).toBe('function');
	});

	it('enhancedRender', () => {
		expect(typeof enhancedRender).toBe('function');
	});
});
