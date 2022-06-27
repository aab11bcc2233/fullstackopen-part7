const mongoose = require("mongoose");


const userSchema = mongoose.Schema({
  text: String,
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Blog",
  },
  date: Date,
});

userSchema.set("toJSON", {
  virtuals: true,
  // eslint-disable-next-line no-unused-vars
  transform: (_doc, ret, _options) => {
    delete ret._id;
    delete ret.__v;
  },
});

module.exports = mongoose.model("Comment", userSchema);
