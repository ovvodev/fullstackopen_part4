const listHelper = require('../utils/list_helper')



describe('total blogs', () => {
  const listWithOneBlog = [
    {

      author: 'Edsger W. Dijkstra',

      blogs: 5,

    },

  ]

  const listWithMultipleBlogs = [
    {

      author: 'Michael Chan',

      blogs: 7,

    },
    {

      author: 'MMAMA W. ',

      blogs: 5,

    },
    {

      author: 'Edsger W. Dijkstra',

      blogs: 12,

    },
    {

      author: 'Jack C. Martin',

      blogs: 10,

    },
    {

      author: 'Bill C. ',

      blogs: 0,

    },
    {


      author: 'Robert C. Martin',

      blogs: 12,

    }
  ]

  test('when list has only one blog, this with most blogs is this one', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('when list has multiple blogs, the author with most blogs.', () => {
    const result = listHelper.mostBlogs(listWithMultipleBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', blogs: 12 })
  })

})