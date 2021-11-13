const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.cardSchema = Joi.object({
    info: Joi.object({
        gameSession: Joi.string().required(),
        playerName: Joi.string().required().escapeHTML(),
        playerPhoneNum: Joi.number().required(),
        cards: [
            Joi.object({
                cardInfo: [
                    Joi.object({
                        lineName: Joi.string().required(),
                        line: Joi.array().required(),
                        winnerId: Joi.string().required(),
                    })
                ]
            })
        ],
        cardQty: Joi.number().required().min(1),
        email: Joi.string().email(),
        images: [
            Joi.string()
        ]
    })
});

module.exports.gameSessionSchema = Joi.object({
    sessionName: Joi.string().required()
})

module.exports.rolledNumSchema = Joi.object({
    rolledNum: Joi.number().required().min(1).max(75)
})

