import createAdaptableEnhancer from '../create-adaptable-enhancer';
import createEnhancer from '../create-enhancer';

describe('createAdaptableEnhancer can create adaptableEnhancer', () => {
	const sideEffectFunction = jest.fn();
	const actionEnhancement = jest.fn(inputFunction => params => {
		sideEffectFunction('actionEnhancement');
		inputFunction(params);
	});
	const operationEnhancement = jest.fn(inputFunction => (meta, req, res) => {
		sideEffectFunction('operationEnhancement');
		inputFunction(meta, req, res);
	});
	const adaptableEnhancer = createAdaptableEnhancer({
		actionEnhancement,
		operationEnhancement,
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('to enhance operation function correctly', () => {
		const operationFunction = jest.fn((meta, req, res) => res);
		const enhanced = adaptableEnhancer(operationFunction);
		enhanced({}, {}, {});
		expect(operationFunction.mock.calls).toMatchSnapshot();
		expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		expect(operationEnhancement.mock.calls).toHaveLength(1);
		expect(operationEnhancement.mock.calls[0][0]).toBe(operationFunction);
		expect(actionEnhancement.mock.calls).toHaveLength(0);
	});

	it('to enhance action function correctly', () => {
		const actionFunction = jest.fn(({ paramA, meta }) => ({ paramA, ...meta }));
		const enhanced = adaptableEnhancer(actionFunction);
		enhanced({ paramA: 1 });
		expect(actionFunction.mock.calls).toMatchSnapshot();
		expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		expect(actionEnhancement.mock.calls).toHaveLength(1);
		expect(actionEnhancement.mock.calls[0][0]).toBe(actionFunction);
		expect(operationEnhancement.mock.calls).toHaveLength(0);
	});

	it('to enhance action function bundle correctly', () => {
		const actionFunctionA = jest.fn(({ param, meta }) => ({
			param,
			...meta,
		}));
		const actionFunctionB = jest.fn(({ param, meta }) => ({
			param,
			...meta,
		}));
		const enhancedBundle = adaptableEnhancer({
			actionFunctionA,
			actionFunctionB,
		});
		enhancedBundle.actionFunctionA({ param: 'A' });
		enhancedBundle.actionFunctionB({ param: 'B' });
		expect(actionEnhancement.mock.calls).toHaveLength(2);
		expect(actionEnhancement.mock.calls[0][0]).toBe(actionFunctionA);
		expect(actionFunctionA.mock.calls).toMatchSnapshot();
		expect(actionFunctionB.mock.calls).toMatchSnapshot();
	});

	it('throws error if target function signature not matching the types', () => {
		const randomFunction = () => {};
		const execute = () => adaptableEnhancer(randomFunction);
		expect(execute).toThrowErrorMatchingInlineSnapshot(
			`"targetFunction randomFunction can not be enhanced, check if signature meets the requirement"`,
		);
	});

	describe('to chain with regular enhancer', () => {
		const actionEnhancementB = inputFunction => paramsAndMeta => {
			sideEffectFunction('actionEnhancementB');
			inputFunction(paramsAndMeta);
		};
		const operationEnhancementB = inputFunction => (meta, req, res) => {
			sideEffectFunction('operationEnhancementB');
			inputFunction(meta, req, res);
		};
		const actionEnhancerB = createEnhancer(actionEnhancementB);
		const operationEnhancerB = createEnhancer(operationEnhancementB);

		it('to enhance operation function correctly', () => {
			const operationFunction = jest.fn((meta, req, res) => res);
			const enhanced = operationEnhancerB(adaptableEnhancer(operationFunction));
			enhanced({}, {}, {});
			expect(operationFunction.mock.calls).toMatchSnapshot();
			expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		});

		it('to enhance operation function correctly when chained in different order', () => {
			const operationFunction = jest.fn((meta, req, res) => res);
			const enhanced = adaptableEnhancer(operationEnhancerB(operationFunction));
			enhanced({}, {}, {});
			expect(operationFunction.mock.calls).toMatchSnapshot();
			expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		});

		it('to enhance action function correctly', () => {
			const actionFunction = jest.fn(({ paramA, meta }) => ({
				paramA,
				...meta,
			}));
			const enhanced = actionEnhancerB(adaptableEnhancer(actionFunction));
			enhanced({ paramA: 1 });
			expect(actionFunction.mock.calls).toMatchSnapshot();
			expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		});

		it('to enhance action function correctly in different order', () => {
			const actionFunction = jest.fn(({ paramA, meta }) => ({
				paramA,
				...meta,
			}));
			const enhanced = adaptableEnhancer(actionEnhancerB(actionFunction));
			enhanced({ paramA: 1 });
			expect(actionFunction.mock.calls).toMatchSnapshot();
			expect(sideEffectFunction.mock.calls).toMatchSnapshot();
		});
	});
});
