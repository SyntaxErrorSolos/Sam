let { model, models, Schema } = require("mongoose");

module.exports =
    models.guildJoin ||
    model(
        "guildJoin",
        new Schema({
            Joined: Number,
            Left: Number,
            PreviousWeek: Number
        })
    );