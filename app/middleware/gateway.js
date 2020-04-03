
module.exports = () => {
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
                setCtxBody(ctx, {
                    code: e.code || -1000,
                    success: false,
                    message: e.message,
                    stack: e.stack
                });
            }
            ctx.logger.error(e);
        }
    };
};

function setCtxBody(ctx, jsonBody) {
    ctx.body = json(jsonBody);
}

function json(data) {
    return {
        ...data,
        code: data.success ? 0 : (data.code || 100),
        sysTime: Date.now()
    };
}