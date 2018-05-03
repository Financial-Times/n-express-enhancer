import tagService from '../tag-service';

it('create enhancer to add service to meta of action functions', () => {
	const actionFunction = (params, meta) => meta;
	const enhanced = tagService('some-service')(actionFunction);
	const result = enhanced({}, {});
	expect(result).toEqual({ service: 'some-service' });
});
