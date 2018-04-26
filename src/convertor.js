export const toMiddleware = operationFunction => {
	const convertedFunction = async (req, res, next) => {
		try {
			await operationFunction({}, req, res);
			if (!res.headersSent && !res.rendered) {
				next();
			}
		} catch (e) {
			// in case of error handled inside a resful operationFunction
			// error wouldn't be further thrown and therefore not caught here
			next(e);
		}
	};
	Object.defineProperty(convertedFunction, 'name', {
		value: operationFunction.name,
		configurable: true,
	});
	return convertedFunction;
};

export const toMiddlewares = operationBundle => {
	const converted = {};
	Object.keys(operationBundle).forEach(methodName => {
		const convertedMethod = toMiddleware(operationBundle[methodName]);
		Object.defineProperty(convertedMethod, 'name', {
			value: methodName,
			configurable: true,
		});
		converted[methodName] = convertedMethod;
	});
	return converted;
};
