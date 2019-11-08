exports.json = function (data) {
    return {
        ...data,
        code: data.success ? 0 : (data.code || 100),
        sysTime: Date.now()
    };
};