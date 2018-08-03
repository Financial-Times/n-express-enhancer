import tagService from '../tag-service';

it('create enhancer to add service to meta of action functions', () => {
	const actionFunction = paramsAndMeta => paramsAndMeta;
	const enhanced = tagService('some-service')(actionFunction);
	const result = enhanced({});
	expect(result).toEqual({ service: 'some-service' });
});
