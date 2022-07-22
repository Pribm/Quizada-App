export const getUserThumbnail = (image,userId, width = null, height = null) => {
    let url = `${process.env.REACT_APP_BASE_URL}thumbnail/user/${image}?s=avatar&u=${userId}${width ? '&w='+width : ''}${height ? '&h='+height : ''}`
    return url
}

export const getCategoryThumbnail = (image, userId, width = null, height = null) => {
    let url = `${image}?s=${userId}${width ? '&w='+width : ''}${height ? '&h='+height : ''}`
    return url
}

export const getQuizzThumbnail = (image, width=null, height=null) => {
    let url = `${process.env.REACT_APP_BASE_URL}thumbnail/quizz/${image}?s=images${width ? '&w='+width : ''}${height ? '&h='+height : ''}`
    return url
}

export const getQuestionThumbnail = (image,userId, width=null, height=null) => {
    let url = `${process.env.REACT_APP_BASE_URL}thumbnail/questions/${image}?s=${userId}/images${width ? '&w='+width : ''}${height ? '&h='+height : ''}`
    return url
}