let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildMessages ||
    model(
        "guildMessages",
        new Schema({
            TotalMessages: Number,
            PreviousWeek: Number
        })
    );