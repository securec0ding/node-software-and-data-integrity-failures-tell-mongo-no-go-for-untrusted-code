var mongoose = require('mongoose')

var PostSchema = new mongoose.Schema({
  title: String,
  contents: String,
  category: { type: String, enum: ['admin', 'members', 'public'], default: 'public' },
})

var Post = mongoose.model('Post', PostSchema)
module.exports = Post