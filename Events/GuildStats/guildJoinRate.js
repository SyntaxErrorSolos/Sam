let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildJoin ||
    model(
        "guildJoin",
        new Schema({
            guildID: String,
            Left: Number,
            JoinedWeekly: Number,
            LeftWeekly: Number,
            PreviousWeek: Number,
        })
    );