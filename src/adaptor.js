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
		} can not be decorated with autoLogger`,
	);
};

export default actionOperationAdaptor;
