import {
	compose,
	addMeta,
	tagService,
	autoNext,
	enhancedRender,
	createEnhancer,
	isPromise,
} from '../index';

describe('n-express-enhancer exports', () => {
	it('compose', () => {
		expect(typeof compose).toBe('function');
	});

	it('addMeta', () => {
		expect(typeof addMeta).toBe('function');
	});

	it('tagService', () => {
		expect(typeof tagService).toBe('function');
	});

	it('autoNext', () => {
		expect(typeof autoNext).toBe('function');
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
