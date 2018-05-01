import compose from 'compose-function';

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

	describe('that is chainable with enhancers of the same target function signature', () => {
		describe('invokes enhancement function in correct order so that data can be passed in', () => {
			it('non-async enhancement functions', () => {
				const callOrderFunction = jest.fn();
				const dataStreamFunction = jest.fn();
				const targetFunction = meta => {
					callOrderFunction('targetFunction');
					dataStreamFunction(meta);
					return meta;
				};
				const enhancerA = createEnhancer(inputFunction => meta => {
					callOrderFunction('enhancerA');
					dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerA: 'data added' };
					return inputFunction(updatedMeta);
				});
				const enhancerB = createEnhancer(inputFunction => meta => {
					callOrderFunction('enhancerB');
					dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerB: 'data added' };
					return inputFunction(updatedMeta);
				});
				const initialMeta = { initial: 'data added' };
				const enhanced = compose(enhancerA, enhancerB)(targetFunction);
				const result = enhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(result).toMatchSnapshot();

				const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
				const reverseResult = reverseEnhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(reverseResult).toMatchSnapshot();
			});

			it('async enhancement functions', async () => {
				const callOrderFunction = jest.fn();
				const dataStreamFunction = jest.fn();
				const targetFunction = meta => {
					callOrderFunction('targetFunction');
					dataStreamFunction(meta);
					return meta;
				};
				const enhancerA = createEnhancer(inputFunction => async meta => {
					callOrderFunction('enhancerA');
					await dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerA: 'data added' };
					return inputFunction(updatedMeta);
				});
				const enhancerB = createEnhancer(inputFunction => async meta => {
					callOrderFunction('enhancerB');
					await dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerB: 'data added' };
					return inputFunction(updatedMeta);
				});
				const initialMeta = { initial: 'data added' };
				const enhanced = compose(enhancerA, enhancerB)(targetFunction);
				const result = await enhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(result).toMatchSnapshot();

				const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
				const reverseResult = await reverseEnhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(reverseResult).toMatchSnapshot();
			});

			it('mixed non-async and async enhancement functions', async () => {
				const callOrderFunction = jest.fn();
				const dataStreamFunction = jest.fn();
				const targetFunction = meta => {
					callOrderFunction('targetFunction');
					dataStreamFunction(meta);
					return meta;
				};
				const enhancerA = createEnhancer(inputFunction => async meta => {
					callOrderFunction('enhancerA');
					await dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerA: 'data added' };
					return inputFunction(updatedMeta);
				});
				const enhancerB = createEnhancer(inputFunction => meta => {
					callOrderFunction('enhancerB');
					dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerB: 'data added' };
					return inputFunction(updatedMeta);
				});
				const initialMeta = { initial: 'data added' };
				const enhanced = compose(enhancerA, enhancerB)(targetFunction);
				const result = await enhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(result).toMatchSnapshot();

				const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
				const reverseResult = await reverseEnhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(reverseResult).toMatchSnapshot();
			});

			// TODO: further explore this implementation and its tests
			describe('promises based sideEffect functions so that target functions not blocked', () => {
				it('enhanced can be invoked without await if target function not async', () => {
					const callOrderFunction = jest.fn();
					const dataStreamFunction = jest.fn();
					const targetFunction = meta => {
						callOrderFunction('targetFunction');
						dataStreamFunction(meta);
						return meta;
					};
					const enhancerA = createEnhancer(inputFunction => meta => {
						callOrderFunction('enhancerA');
						Promise.resolve(() => dataStreamFunction(meta));
						const updatedMeta = { ...meta, enhancerA: 'data added' };
						return inputFunction(updatedMeta);
					});
					const enhancerB = createEnhancer(inputFunction => meta => {
						callOrderFunction('enhancerB');
						dataStreamFunction(meta);
						const updatedMeta = { ...meta, enhancerB: 'data added' };
						return inputFunction(updatedMeta);
					});
					const initialMeta = { initial: 'data added' };
					const enhanced = compose(enhancerA, enhancerB)(targetFunction);
					const result = enhanced(initialMeta);
					expect(callOrderFunction.mock.calls).toMatchSnapshot();
					expect(dataStreamFunction.mock.calls).toMatchSnapshot();
					expect(result).toMatchSnapshot();

					const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
					const reverseResult = reverseEnhanced(initialMeta);
					expect(callOrderFunction.mock.calls).toMatchSnapshot();
					expect(dataStreamFunction.mock.calls).toMatchSnapshot();
					expect(reverseResult).toMatchSnapshot();
				});

				it('enhanced can be invoked with await if target function async', () => {
					const callOrderFunction = jest.fn();
					const dataStreamFunction = jest.fn();
					const targetFunction = meta => {
						callOrderFunction('targetFunction');
						dataStreamFunction(meta);
						return meta;
					};
					const enhancerA = createEnhancer(inputFunction => meta => {
						callOrderFunction('enhancerA');
						Promise.resolve(() => dataStreamFunction(meta));
						const updatedMeta = { ...meta, enhancerA: 'data added' };
						return inputFunction(updatedMeta);
					});
					const enhancerB = createEnhancer(inputFunction => meta => {
						callOrderFunction('enhancerB');
						dataStreamFunction(meta);
						const updatedMeta = { ...meta, enhancerB: 'data added' };
						return inputFunction(updatedMeta);
					});
					const initialMeta = { initial: 'data added' };
					const enhanced = compose(enhancerA, enhancerB)(targetFunction);
					const result = enhanced(initialMeta);
					expect(callOrderFunction.mock.calls).toMatchSnapshot();
					expect(dataStreamFunction.mock.calls).toMatchSnapshot();
					expect(result).toMatchSnapshot();

					const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
					const reverseResult = reverseEnhanced(initialMeta);
					expect(callOrderFunction.mock.calls).toMatchSnapshot();
					expect(dataStreamFunction.mock.calls).toMatchSnapshot();
					expect(reverseResult).toMatchSnapshot();
				});
			});

			// enhancer doesn't need to be async
			// as long as await is used when invoke the enhanced
			it('async target function', async () => {
				const callOrderFunction = jest.fn();
				const dataStreamFunction = jest.fn();
				const targetFunction = async meta => {
					callOrderFunction('targetFunction');
					dataStreamFunction(meta);
					return meta;
				};
				const enhancerA = createEnhancer(inputFunction => async meta => {
					callOrderFunction('enhancerA');
					await dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerA: 'data added' };
					return inputFunction(updatedMeta);
				});
				const enhancerB = createEnhancer(inputFunction => meta => {
					callOrderFunction('enhancerB');
					dataStreamFunction(meta);
					const updatedMeta = { ...meta, enhancerB: 'data added' };
					return inputFunction(updatedMeta);
				});
				const initialMeta = { initial: 'data added' };
				const enhanced = compose(enhancerA, enhancerB)(targetFunction);
				const result = await enhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(result).toMatchSnapshot();

				const reverseEnhanced = compose(enhancerB, enhancerA)(targetFunction);
				const reverseResult = await reverseEnhanced(initialMeta);
				expect(callOrderFunction.mock.calls).toMatchSnapshot();
				expect(dataStreamFunction.mock.calls).toMatchSnapshot();
				expect(reverseResult).toMatchSnapshot();
			});
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
