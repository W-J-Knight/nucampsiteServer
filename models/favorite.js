const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
    //   user have array of campsite for their favotite campsites
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    campsites: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Campsite",
        },
    ],
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
