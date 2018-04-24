import { toMiddleware, toMiddlewares } from './convertor';

export const toMiddlewareWrapper = input => {
	switch (typeof input) {
		case 'function':
			return toMiddleware(input);
		case 'object':
			Object.keys(input).forEach(key => {
				if (typeof input[key] !== 'function') {
					throw Error(
						'all methods in an object of operation function bundle need to be valid operation function',
					);
				}
			});
			return toMiddlewares(input);
		default:
			throw Error(
				'input of toMiddleware() needs to be an operation function or a set of operation functions wrapped in an object',
			);
	}
};

export default toMiddlewareWrapper;
