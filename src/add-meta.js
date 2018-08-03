import createEnhancer from './create-enhancer';
import { isPromise } from './utils';

const addMeta = addedMeta => actionFunction => (paramsAndArgs = {}) => {
	const call = actionFunction({ ...paramsAndArgs, ...addedMeta });
	if (isPromise(call)) {
		return call.then(data => data).catch(e => {
			throw e;
		});
	}
	const data = call;
	return data;
};

export default addedMeta => {
	/*
		throw error when creating the enhancer
		not until the enhanced function gets called
	 */
	if (typeof addedMeta !== 'object') {
		throw Error('input of addMeta needs to be an object');
	}

	return createEnhancer(addMeta(addedMeta));
};
