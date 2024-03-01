const mongoose = require("mongoose");
const slug = require('mongoose-slug-updater');
mongoose.plugin(slug);
const musicSchema = new mongoose.Schema({
    title: String,
    artist: String,
    genre: String,
    link: String,
    imagecover: String,
});

const Music = mongoose.model("Music", musicSchema, "DataMusic");

module.exports = Music;