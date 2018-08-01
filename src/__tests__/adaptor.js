import actionOperationAdaptor from '../adaptor';

describe('actionOperationAdaptor', () => {
	const actionEnhancer = jest.fn();
	const operationEnhancer = jest.fn();
	const adaptableEnhancer = actionOperationAdaptor({
		actionEnhancer,
		operationEnhancer,
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it('use operationEnhancer when enhance operation function', () => {
		const operationFunction = (meta, req) => {
			req.meta = meta;
		};
		adaptableEnhancer(operationFunction);
		expect(operationEnhancer.mock.calls).toHaveLength(1);
		expect(operationEnhancer.mock.calls[0][0]).toBe(operationFunction);
	});

	it('use actionEnhancer when enhance action function', () => {
		const actionFunction = ({ paramA, meta }) => ({ paramA, ...meta });
		adaptableEnhancer(actionFunction);
		expect(actionEnhancer.mock.calls).toHaveLength(1);
		expect(actionEnhancer.mock.calls[0][0]).toBe(actionFunction);
	});

	it('throws error if target function signature not matching the types', () => {
		const randomFunction = () => {};
		const execute = () => adaptableEnhancer(randomFunction);
		expect(execute).toThrowErrorMatchingInlineSnapshot(
			`"targetFunction randomFunction can not be enhanced, check if signature meets the requirement"`,
		);
	});
});
