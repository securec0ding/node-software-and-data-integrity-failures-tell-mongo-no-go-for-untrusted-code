const express = require('express')
const morgan = require('morgan')
const morganBody = require('morgan-body')
const mongoose = require('mongoose')

const Post = require('./models/Post')

const app = express()

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(morgan('combined'))
morganBody(app, {noColors: true, prettify: false, maxBodyLength: 8000})

mongoose.connect('mongodb://localhost:27017/injectionTest',
  { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }
)
resetData()

app.get('/', (req, res) => {
  res.render('index')
})

app.post('/', (req, res) => {
  filterPosts(req.body.filter).then((posts) => {
    res.render('index', {posts: posts})
  }).catch(e => {
    res.render('index')
  })
})

app.listen(process.env.VIRTUAL_PORT, () => console.log('Server running...'))

function filterPosts(category) {
  return new Promise((resolve, reject) => {
    Post.find({category: category}, (err, posts) => {
      if (err) reject(err)
      else resolve(posts)
    })
  })
}

function resetData() {
  var posts = [
    {title: 'Public post', contents: 'Visible to everyone', category: 'public'},
    {title: 'Members post', contents: 'Viewable by logged-in members', category: 'members'},
    {title: 'Admin post', contents: 'Available only to admin users', category: 'admin'},
  ]
  Post.deleteMany({}, (err, old) => {
    posts.forEach((post) => {
      (new Post({
        title: post.title,
        contents: post.contents,
        category: post.category,
      })).save()
    })
  })
}