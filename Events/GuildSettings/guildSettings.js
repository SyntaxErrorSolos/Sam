let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildSettings ||
    model(
        "guildSettings",
        new Schema({
            guildID: String,
            Description: { type: String, default: "A cool server." }
        })
    );