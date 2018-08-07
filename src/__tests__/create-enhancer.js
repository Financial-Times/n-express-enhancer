import compose from 'compose-function';

import createEnhancer from '../create-enhancer';

describe('createEnhancer can create enhancer', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	const callOrderFunction = jest.fn();
	const enhancementSideEffect = jest.fn();

	const createMockEnhancer = name =>
		createEnhancer(inputFunction => args => {
			enhancementSideEffect(name);
			callOrderFunction(name, args);
			const updatedArgs = { ...args, [name]: 'called' };
			return inputFunction(updatedArgs);
		});
	const enhancer = createMockEnhancer('enhancer');
	const targetFunction = args => {
		callOrderFunction('targetFunction', args);
		return args;
	};
	const asyncTargetFunction = async args => {
		await callOrderFunction('asyncTargetFunction', args);
		return args;
	};
	const initArg = { arg: 'init' };

	describe('to enhance function to', () => {
		it('have configurable name inherited from the input ', () => {
			const original = () => {};
			const enhanced = enhancer(original);
			expect(enhanced.name).toBe(original.name);
			const updatedName = 'test';
			Object.defineProperty(enhanced, 'name', {
				value: updatedName,
				configurable: true,
			});
			expect(enhanced.name).toBe(updatedName);
		});

		it('invoke enhancee and original function', () => {
			const original = jest.fn();
			const enhanced = enhancer(original);
			enhanced();
			expect(original.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(1);
		});
	});

	describe('to enhance bundle of functions to', () => {
		const methodA = jest.fn();
		const methodB = jest.fn();
		const functionBundle = { methodA, methodB };
		const enhanced = enhancer(functionBundle);

		it('be named after method names', () => {
			expect(enhanced.methodA.name).toBe('methodA');
			expect(enhanced.methodB.name).toBe('methodB');
		});

		it('invoke enhancement and original functions', () => {
			enhanced.methodA();
			expect(methodA.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(1);
			enhanced.methodB();
			expect(methodB.mock.calls).toHaveLength(1);
			expect(enhancementSideEffect.mock.calls).toHaveLength(2);
		});
	});

	describe('chainable with non-async enhancers and be invoked in correct order', () => {
		it('when enhance non-async function', () => {
			const enhancerA = createMockEnhancer('enhancerA');
			const enhancerB = createMockEnhancer('enhancerB');
			const enhanced = compose(
				enhancerA,
				enhancerB,
			)(targetFunction);
			const result = enhanced(initArg);
			expect(callOrderFunction.mock.calls).toMatchSnapshot();
			expect(result).toMatchSnapshot();
			jest.clearAllMocks();
			const reverseEnhanced = compose(
				enhancerB,
				enhancerA,
			)(targetFunction);
			const reverseResult = reverseEnhanced(initArg);
			expect(callOrderFunction.mock.calls).toMatchSnapshot();
			expect(reverseResult).toMatchSnapshot();
		});

		it('when enhance async function', async () => {
			const enhancerA = createMockEnhancer('enhancerA');
			const enhancerB = createMockEnhancer('enhancerB');
			const enhanced = compose(
				enhancerA,
				enhancerB,
			)(asyncTargetFunction);
			const result = await enhanced(initArg);
			expect(callOrderFunction.mock.calls).toMatchSnapshot();
			expect(result).toMatchSnapshot();
			jest.clearAllMocks();
			const reverseEnhanced = compose(
				enhancerB,
				enhancerA,
			)(targetFunction);
			const reverseResult = await reverseEnhanced(initArg);
			expect(callOrderFunction.mock.calls).toMatchSnapshot();
			expect(reverseResult).toMatchSnapshot();
		});
	});

	// TODO: further test promise based enhancementFunction being invoked correctly

	it('when input is invalid throws error', () => {
		const doEnhanceStringInput = () => enhancer('test');
		expect(doEnhanceStringInput).toThrowErrorMatchingSnapshot();

		const doEnhanceInvalidObject = () =>
			enhancer({
				foo: 'bar',
			});
		expect(doEnhanceInvalidObject).toThrowErrorMatchingSnapshot();
	});
});
