const enhanceWithName = enhancementFunction => inputFunction => {
	const enhancedFunction = enhancementFunction(inputFunction);
	/*
		arrow function would return an anonymouse function,
		where the function.name would be undefined;
		inherit the function name to the enhanced function here
	 */
	Object.defineProperty(enhancedFunction, 'name', {
		value: inputFunction.name,
		configurable: true,
	});
	return enhancedFunction;
};

const enhanceWithBundleKeyName = enhancementFunction => inputBundle =>
	Object.keys(inputBundle).reduce((enhancedBundle, methodName) => {
		const method = inputBundle[methodName];
		// override the method name with key name(to define method name) in the bundle
		// for use case where functions are defined directly in the object
		Object.defineProperty(method, 'name', {
			value: methodName,
			configurable: true,
		});
		const enhancedMethod = enhanceWithName(enhancementFunction)(method);
		return { ...enhancedBundle, [methodName]: enhancedMethod };
	}, {});

const createEnhancer = enhancementFunction => input => {
	switch (typeof input) {
		case 'function':
			return enhanceWithName(enhancementFunction)(input);
		case 'object':
			Object.keys(input).forEach(key => {
				if (typeof input[key] !== 'function') {
					throw Error(
						'all methods in an object of operation function bundle need to be valid operation function',
					);
				}
			});
			return enhanceWithBundleKeyName(enhancementFunction)(input);
		default:
			throw Error(
				`input of ${enhancementFunction.name ||
					'enhancementFunction in createEnhancer'} needs to be function or a bundle of function wrapped in an object`,
			);
	}
};

export default createEnhancer;
