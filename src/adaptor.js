const actionOperationAdaptor = ({
	actionEnhancer,
	operationEnhancer,
}) => targetFunction => {
	if (targetFunction.length >= 2) {
		return (...args) => operationEnhancer(targetFunction)(...args);
	}
	if (targetFunction.length === 1) {
		return (...args) => actionEnhancer(targetFunction)(...args);
	}
	throw Error(
		`targetFunction ${
			targetFunction.name
		} can not be enhanced, check if signature meets the requirement`,
	);
};

export default actionOperationAdaptor;
