const actionOperationAdaptor = ({
	actionEnhancer,
	operationEnhancer,
}) => targetFunction => {
	if (targetFunction.length >= 2) {
		return operationEnhancer(targetFunction);
	}
	if (targetFunction.length === 1) {
		return actionEnhancer(targetFunction);
	}
	throw Error(
		`targetFunction ${
			targetFunction.name
		} can not be enhanced, check if signature meets the requirement`,
	);
};

export default actionOperationAdaptor;
