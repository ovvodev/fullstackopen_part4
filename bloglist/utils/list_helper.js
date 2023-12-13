const dummy = (blogs) => {
    return 1
  }
  
const totalLikes = (blogs) => {
  
    const sumOfLikes = (list, value) => {
      return list.reduce((acc, obj) => acc + obj[value],0 )
    }
    
    return sumOfLikes(blogs, 'likes')
  }


  module.exports = {
    dummy,
    totalLikes,
  }