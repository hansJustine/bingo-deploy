const { cardSchema, gameSessionSchema, rolledNumSchema } = require('./joiSchema');
const ExpressError = require('./utils/ExpressError');

module.exports.validateCard = (req, res, next) => {
    const { error } = cardSchema.validate(req.body);
    if (error) {
        console.dir(error.details);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateGameSession = (req, res, next) => {

    const { error } = gameSessionSchema.validate(req.body.gameSession);
    if (error) {
        console.dir(error.details);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
module.exports.validateRolledNum = (req, res, next) => {

    const { error } = rolledNumSchema.validate(req.body.gameSession);
    if (error) {
        console.dir(error.details);
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}
