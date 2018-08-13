import createEnhancer from '../create-enhancer';

const autoNext = operationFunction => async (req, res, next) => {
	try {
		await operationFunction(req, res);
		if (!res.headersSent && !res.rendered) {
			next();
		}
	} catch (e) {
		// in case of error handled inside a resful operationFunction
		// error wouldn't be further thrown and therefore not caught here
		next(e);
	}
};

export default createEnhancer(autoNext);
