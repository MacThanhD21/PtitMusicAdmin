const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
const Music = require("../models/music.model");
const Schema = mongoose.Schema;
mongoose.plugin(slug);
const ArtistSchema = new mongoose.Schema({
    name_Artist: String,
    id_albums: [
        {
            type: Schema.Types.ObjectId
        }
    ],
    image: String,
});

const Artist = mongoose.model("Artist", ArtistSchema, "ArtistData");

module.exports = Artist;