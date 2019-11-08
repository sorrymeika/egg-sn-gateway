const { json } = require('../util/resp');

function setCtxBody(ctx, jsonBody) {
    ctx.body = json(jsonBody);
}

module.exports = options => {
    return async function gateway(ctx, next) {
        try {
            await next();

            const content = ctx.body;
            if (typeof content === 'string' && content.startsWith('{') && content.endsWith('}')) {
                setCtxBody(ctx, JSON.parse(content));
            } else if (content && Object.getPrototypeOf(content) === Object.prototype) {
                setCtxBody(ctx, content);
            }
        } catch (e) {
            if (e.code === 'invalid_param') {
                setCtxBody(ctx, {
                    code: -140,
                    success: false,
                    message: e.message,
                    errors: e.errors
                });
            } else {
                throw e;
            }
        }

        //TODO: 增加日志
    };
};
