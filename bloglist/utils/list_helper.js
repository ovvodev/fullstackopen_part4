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
  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
  }