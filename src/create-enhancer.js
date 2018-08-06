const inheritName = (name, enhancedFunction) => {
	const output = enhancedFunction;
	Object.defineProperty(output, 'name', {
		value: name,
		configurable: true,
	});
	return output;
};

/*
	arrow function would return an anonymouse function,
	where the function.name would be undefined;
	inherit the function name to the enhanced function here
 */
const enhanceWithNameInheritance = enhancementFunction => inputFunction =>
	inheritName(inputFunction.name, enhancementFunction(inputFunction));

/*
	override the method name with key name(to define method name) in the bundle
	for use case when methods are defined in the bundle object as anonymouse function
 */
const enhanceBundleWithNameInheritance = enhancementFunction => inputBundle =>
	Object.keys(inputBundle).reduce((enhancedBundle, methodName) => {
		const method = inputBundle[methodName];
		if (typeof method !== 'function') {
			throw Error(
				`all properties in a function bundle must be function, check .${methodName}`,
			);
		}
		return {
			...enhancedBundle,
			[methodName]: inheritName(methodName, enhancementFunction(method)),
		};
	}, {});

const createFunctionAndBundleEnhancer = enhancementFunction => inputFunctionOrBundle => {
	if (typeof inputFunctionOrBundle === 'function') {
		const inputFunction = inputFunctionOrBundle;
		return enhanceWithNameInheritance(enhancementFunction)(inputFunction);
	}
	if (typeof inputFunctionOrBundle === 'object') {
		const inputBundle = inputFunctionOrBundle;
		return enhanceBundleWithNameInheritance(enhancementFunction)(inputBundle);
	}
	throw Error(
		`input of ${enhancementFunction.name ||
			'enhancementFunction in createEnhancer'} needs to be function or a function bundle (Object)`,
	);
};

export default createFunctionAndBundleEnhancer;
