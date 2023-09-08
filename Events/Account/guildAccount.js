let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildAccount ||
    model(
        "guildAccount",
        new Schema({
            guildID: String,
            Tokens: Number
        })
    );