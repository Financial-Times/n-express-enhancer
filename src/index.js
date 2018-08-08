export { default as compose } from 'compose-function';

export { default as toMiddleware } from './enhancers/to-middleware';
export { default as addMeta } from './enhancers/add-meta';
export { default as tagService } from './enhancers/tag-service';
export { default as enhancedRender } from './middlewares/enhanced-render';
export { default as createEnhancer } from './create-enhancer';
export { isPromise } from './utils';
