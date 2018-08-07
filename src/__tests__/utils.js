import { isPromise } from '../utils';

describe('isPromise', () => {
	describe('return true if the input value', () => {
		it('is a Promise', () => {
			const input = Promise.resolve('test');
			const result = isPromise(input);
			expect(result).toBe(true);
		});

		it('is an async function', async () => {
			const input = async () => 'test';
			const call = input();
			const result = isPromise(call);
			expect(result).toBe(true);
			expect(call).not.toBe('test');
			expect(await call).toBe('test');
		});
	});

	describe('return false if the input value', () => {
		it('is a sync function call', () => {
			const input = () => 'test';
			const call = input();
			const result = isPromise(call);
			expect(result).toBe(false);
			expect(call).toBe('test');
		});
	});
});
