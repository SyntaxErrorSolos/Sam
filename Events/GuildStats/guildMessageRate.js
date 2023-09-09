let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildMessages ||
    model(
        "guildMessages",
        new Schema({
            guildID: String,
            TotalMessages: Number,
            PreviousWeek: Number
        })
    );