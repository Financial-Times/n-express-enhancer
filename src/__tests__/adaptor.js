import actionOperationAdaptor from '../adaptor';
import createEnhancer from '../enhancer-creator';

describe('actionOperationAdaptor can be used with createEnhancer to create adaptableEnhancer', () => {
	const actionEnhancer = jest.fn(targetFunction => params =>
		targetFunction(params),
	);
	const operationEnhancer = jest.fn(targetFunction => (meta, req, res) =>
		targetFunction(meta, req, res),
	);
	const adaptableEnhancer = createEnhancer(
		actionOperationAdaptor({
			actionEnhancer,
			operationEnhancer,
		}),
	);

	afterEach(() => {
		jest.clearAllMocks();
	});

	it('to enhance operation function correctly', () => {
		const operationFunction = jest.fn((meta, req) => {
			req.meta = meta;
		});
		const enhanced = adaptableEnhancer(operationFunction);
		enhanced({}, {}, {});
		expect(operationEnhancer.mock.calls).toHaveLength(1);
		expect(operationEnhancer.mock.calls[0][0]).toBe(operationFunction);
		expect(operationFunction.mock.calls).toHaveLength(1);
	});

	it('use actionEnhancer when enhance action function', () => {
		const actionFunction = ({ paramA, meta }) => ({ paramA, ...meta });
		const enhanced = adaptableEnhancer(actionFunction);
		enhanced({ paramA: 1 });
		expect(actionEnhancer.mock.calls).toHaveLength(1);
		expect(actionEnhancer.mock.calls[0][0]).toBe(actionFunction);
	});

	it('throws error if target function signature not matching the types', () => {
		const randomFunction = () => {};
		const execute = () => adaptableEnhancer(randomFunction)();
		expect(execute).toThrowErrorMatchingInlineSnapshot(
			`"targetFunction randomFunction can not be enhanced, check if signature meets the requirement"`,
		);
	});
});
