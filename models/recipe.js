const mongoose = require("mongoose");

const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    url: { type: String },
    ingredients: { type: String, required: true },
    instructions: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    imagePath: { type: String }
});

module.exports = mongoose.model("Recipe", recipeSchema);
