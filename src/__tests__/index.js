import { toMiddleware, enhancedRender, createEnhancer } from '../index';

describe('n-express-enhancer exports', () => {
	it('toMiddleware', () => {
		expect(typeof toMiddleware).toBe('function');
	});

	it('enhancedRender', () => {
		expect(typeof enhancedRender).toBe('function');
	});

	it('createEnhancer', () => {
		expect(typeof createEnhancer).toBe('function');
	});
});
