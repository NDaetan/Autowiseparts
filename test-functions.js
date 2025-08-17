module.exports = {
    generateRandomUser: function (requestParams, context, ee, next) {
        context.vars.randomUsername = `user${Math.floor(Math.random() * 10000)}`;
        context.vars.randomEmail = `test${Math.floor(Math.random() * 10000)}@example.com`;
        return next();
    }
};
