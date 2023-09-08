let { model, models, Schema } = require("mongoose");

module.exports =
    models.userAccount ||
    model(
        "userAccounts",
        new Schema({
            userId: String,
            Tokens: Number
        })
    );