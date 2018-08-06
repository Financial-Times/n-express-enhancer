import createEnhancer from './create-enhancer';

/*
	calling enhancementFunctionRouter({...})
	would returns a enhancement funciton(inputFunction => enhancedFunction)
 */
const enhancementFunctionRouter = ({
	actionEnhancement,
	operationEnhancement,
}) => targetFunction => {
	if (targetFunction.length >= 2) {
		return operationEnhancement(targetFunction);
	}
	if (targetFunction.length === 1) {
		return actionEnhancement(targetFunction);
	}
	throw Error(
		`targetFunction ${
			targetFunction.name
		} can not be enhanced, check if signature meets the requirement`,
	);
};

const createAdaptableEnhancer = ({ actionEnhancement, operationEnhancement }) =>
	createEnhancer(
		enhancementFunctionRouter({
			actionEnhancement,
			operationEnhancement,
		}),
	);

export default createAdaptableEnhancer;
