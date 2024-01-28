const listHelper = require('../utils/list_helper')



describe('total likes', () => {
  const listWithOneBlog = [
    {

      author: 'Edsger W. Dijkstra',

      likes: 15,

    },

  ]

  const listWithMultipleBlogs = [
    {

      author: 'Michael Chan',

      likes: 7,

    },
    {

      author: 'MMAMA W. ',

      likes: 5,

    },
    {

      author: 'Edsger W. Dijkstra',

      likes: 12,

    },
    {

      author: 'Jack C. Martin',

      likes: 10,

    },
    {

      author: 'Bill C. ',

      likes: 0,

    },
    {


      author: 'Robert C. Martin',

      likes: 12,

    }
  ]

  test('when list has only one blog, this with most blogs is this one', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toEqual(listWithOneBlog[0])
  })

  test('when list has multiple blogs, the author with most blogs.', () => {
    const result = listHelper.mostLikes(listWithMultipleBlogs)
    expect(result).toEqual({ author: 'Edsger W. Dijkstra', likes: 12 })
  })

})