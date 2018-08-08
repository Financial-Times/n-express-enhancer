import createEnhancer from '../create-enhancer';

const addMeta = addedMeta => actionFunction => (params, meta) => {
	const updatedMeta = { ...meta, ...addedMeta };
	return actionFunction(params, updatedMeta);
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
