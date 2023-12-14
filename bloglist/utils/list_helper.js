const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  
  const sumOfLikes = (list, value) => {
      return list.reduce((acc, obj) => acc + obj[value],0 )
    }
    
    return sumOfLikes(blogs, 'likes')
  }

const favoriteBlog = (blogs) => {
  const returnFavorite = (list, value) => {
    return list.reduce((max, obj) => obj[value] > max[value] ? obj : max)
  }
  return returnFavorite(blogs, 'likes')
}

const mostBlogs = (blogs) => {
  
    const authorBlogs = blogs.reduce((counts, blog) => {
      counts[blog.author] = (counts[blog.author] || 0) + blog.blogs
      return counts
    }, {})

  const topAuthor = Object.entries(authorBlogs).reduce((max, [author, blogs]) => {
      return blogs > max.blogs ? { author, blogs } : max
    }, { author: null, blogs: 0 })
  
    return topAuthor
  
}

const mostLikes = (blogs) => {
  const authorLikes = blogs.reduce((counts, blog) => {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes;
    return counts
  }, {})

  const topAuthor = Object.entries(authorLikes).reduce((max, [author, likes]) => {
    return likes > max.likes ? { author, likes } : max
  }, { author: null, likes: 0 })

  return topAuthor
}

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
  }