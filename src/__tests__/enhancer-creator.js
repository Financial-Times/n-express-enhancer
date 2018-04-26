import createEnhancer from '../enhancer-creator';

describe('createEnhancer can create enhancer', () => {
	describe('when input function', () => {
		it('output enhanced function with original name', () => {
			const orignal = () => {};
			const enhancement = input => () => input();
			const enhancer = createEnhancer(enhancement);
			const enhanced = enhancer(orignal);
			expect(enhanced.name).toBe('orignal');
		});

		it('output enhanced function invoking enhancement function and orignal function', () => {
			const enhancementSideEffect = jest.fn();
			const orignal = jest.fn();
			const enhancer = createEnhancer(input => () => {
				enhancementSideEffect();
				return input();
			});
			const enhanced = enhancer(orignal);
			enhanced();
			expect(orignal.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(1);
		});
	});

	describe('when input function bundle', () => {
		it('output function bundle of functions name as method names', () => {
			const functionBundle = {
				methodA: () => {},
				methodB: () => {},
			};
			const enhancer = createEnhancer(input => () => input());
			const enhanced = enhancer(functionBundle);
			expect(enhanced.methodA.name).toBe('methodA');
			expect(enhanced.methodB.name).toBe('methodB');
		});

		it('update function names in the original bundle methods, so that they can be consistent in enhancement function', () => {
			const enhancementSideEffect = jest.fn();
			const functionBundle = {
				methodA: jest.fn(),
				methodB: jest.fn(),
			};
			const enhancer = createEnhancer(inputFunction => () => {
				enhancementSideEffect(inputFunction.name);
				return inputFunction();
			});
			const enhanced = enhancer(functionBundle);
			enhanced.methodA();
			expect(enhancementSideEffect.mock.calls).toMatchSnapshot();
			enhanced.methodB();
			expect(enhancementSideEffect.mock.calls).toMatchSnapshot();
		});

		it('output function bundle of functions invoking enhancement function and origial functions', () => {
			const enhancementSideEffect = jest.fn();
			const methodA = jest.fn();
			const methodB = jest.fn();
			const functionBundle = {
				methodA,
				methodB,
			};
			const enhancer = createEnhancer(input => () => {
				enhancementSideEffect();
				return input();
			});
			const enhanced = enhancer(functionBundle);
			enhanced.methodA();
			expect(methodA.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(1);
			enhanced.methodB();
			expect(methodB.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(2);
		});
	});

	it('when input is invalid throws error', () => {
		const enhancer = createEnhancer(input => () => input());
		const doEnhanceStringInput = () => enhancer('test');
		expect(doEnhanceStringInput).toThrowErrorMatchingSnapshot();

		const doEnhanceInvalidObject = () =>
			enhancer({
				foo: 'bar',
			});
		expect(doEnhanceInvalidObject).toThrowErrorMatchingSnapshot();
	});
});
