import addMeta from '../add-meta';

describe('addMeta', () => {
	it('create enhancer that can add meta to action functions both async/non-async', async () => {
		const actionFunctionBundle = {
			methodA: (params, meta) => meta,
			methodB: async args => args,
		};
		const addingMeta = { service: 'some-service' };
		const enhanced = addMeta(addingMeta)(actionFunctionBundle);
		const resultA = enhanced.methodA({}, {});
		const resultB = await enhanced.methodB({});
		expect(resultA).toEqual(addingMeta);
		expect(resultB).toEqual(addingMeta);
	});

	it('catches errors thrown from action function both async/non-async', async () => {
		const errorInstance = { status: 404, meesage: 'some error message' };
		const actionFunction = () => {
			throw errorInstance;
		};
		const asyncActionFunction = async () => {
			throw await errorInstance;
		};
		const addServiceMeta = addMeta({ service: 'some-service' });
		try {
			addServiceMeta(actionFunction)();
		} catch (e) {
			expect(e).toEqual(errorInstance);
		}
		try {
			await addServiceMeta(asyncActionFunction)();
		} catch (e) {
			expect(e).toEqual(errorInstance);
		}
	});

	it('throws error if input of addMeta is not an object, e.g. in case the meta is forgotten', () => {
		const operationFunction = () => {};
		expect(() => addMeta('')).toThrowErrorMatchingSnapshot();
		expect(() => addMeta(operationFunction)).toThrowErrorMatchingSnapshot();
	});

	// it('throws error if created enhancer used on operation function', () => {
	// 	const actionFunction = (params, meta) => meta;
	// 	const operationFunction = meta => meta;
	// 	const addingMeta = { service: 'some-service' };
	// 	const enhanced = addMeta(addingMeta)({
	// 		actionFunction,
	// 		operationFunction,
	// 	});
	// });
});
