let { model, models, Schema } = require("mongoose");

module.exports =
    models.userAccount ||
    model(
        "userAccounts",
        new Schema({
            userID: String,
            Tokens: Number
        })
    );