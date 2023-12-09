
const app =  require('./app')
const config = require('./utils/config')
const logger = require('./utils/logger')

/*const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
})*/
/*const password = process.argv[2]
const mongoUrl = `mongodb+srv://ovvodev:${password}@cluster0.rarbpyh.mongodb.net/?retryWrites=true&w=majority`
*/
/*const Blog = mongoose.model('Blog', blogSchema)*/

/*mongoose.connect(mongoUrl)*/
/*
app.use(cors())
app.use(express.json())
app.use('/api/blogs', blogsRouter)
*/
/*app.get('/api/blogs', (request, response) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })
})

app.post('/api/blogs', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})
*/

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`)
})