var mongoose = require('mongoose');
var Schema = mongoose.Schema;

function setTags(tags) {
  var replace = tags.replace(/\s+/g, '');
  return replace.split(',');
}

var articleSchema = new Schema({
  title: { type: String, required: true, trim: true },
  tags: { type: [], required: true, set: setTags },
  content: { type: String, required: true, trim: true },
  postedBy: String,
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Article', articleSchema);
