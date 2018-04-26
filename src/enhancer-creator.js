const createFunctionEnhancer = enhancementFunction => inputFunction => {
	const enhancedFunction = enhancementFunction(inputFunction);
	Object.defineProperty(enhancedFunction, 'name', {
		value: inputFunction.name,
		configurable: true,
	});
	return enhancedFunction;
};

const createBundleEnhancer = enhancementFunction => inputBundle => {
	const enhancedBundle = {};
	Object.keys(inputBundle).forEach(methodName => {
		const method = inputBundle[methodName];
		Object.defineProperty(method, 'name', {
			value: methodName,
			configurable: true,
		});
		const enhancer = createFunctionEnhancer(enhancementFunction);
		const enhancedMethod = enhancer(method);
		enhancedBundle[methodName] = enhancedMethod;
	});
	return enhancedBundle;
};

const createEnhancer = enhancementFunction => input => {
	switch (typeof input) {
		case 'function':
			return createFunctionEnhancer(enhancementFunction)(input);
		case 'object':
			Object.keys(input).forEach(key => {
				if (typeof input[key] !== 'function') {
					throw Error(
						'all methods in an object of operation function bundle need to be valid operation function',
					);
				}
			});
			return createBundleEnhancer(enhancementFunction)(input);
		default:
			throw Error(
				`input of ${enhancementFunction.name ||
					'enhancer'} needs to be an operation function or a set of operation functions wrapped in an object`,
			);
	}
};

export default createEnhancer;
