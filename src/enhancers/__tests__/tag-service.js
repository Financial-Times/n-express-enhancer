import tagService from '../tag-service';

it('create enhancer to add service to meta of action functions', () => {
	const actionFunction = (param, meta) => meta;
	const enhanced = tagService('some-service')(actionFunction);
	const result = enhanced({});
	expect(result).toMatchSnapshot();
});
