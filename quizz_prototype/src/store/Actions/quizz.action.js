import axios from "axios"
import { HttpAuth } from "config/Http"

export const actionTypes = {
    CHANGE : 'CHANGE_QUIZZ',
    ERROR: 'QUIZZ_ERROR',
    CREATE: 'CREATE_QUIZZ'
}

export const change = (payload) => {
    return ({
        type: actionTypes.CHANGE,
        payload
    })
}

export const error = (payload) => ({
  type: actionTypes.ERROR,
  payload
})


export const createQuizzResponse = payload => (
    {
        type: actionTypes.CREATE,
        payload
    }
)

export const uploadQuizzFile =  (payload) => dispatch => {
    dispatch(change({upLoadingNewQuizz: true}))
    let formdata = new FormData()

    Object.entries(payload).forEach(async (element, i, array) => {
        let file = element[1];
        

        if(typeof element[1] === 'string' && /(blob*)/.test(element[1])){
            let data = await getFileFromBlob(element[1])

            file = new Blob([data], {type: data.type})
        }

        formdata.append(element[0], file)
        
        if(i === (array.length - 1)){
            for(let d of formdata.entries()){
                console.log('key:', d[0], 'value: ', d[1])
            }
           HttpAuth.post('question/upload', formdata).then(res => {
                dispatch(change({upLoadingNewQuizz: false}))
                
                if(res.data.errors){
                    dispatch(error(res.data.errors))
                }
           })
        }
    })

    
    

    
}

const getFileFromBlob = async (blob) => {
    let data = await fetch(blob)
    const blobFile = await data.blob();
    return blobFile
}

// Object.entries(payload).forEach(element => {
        
//     if(/(blob*)/.test(element[1])){
//         let file = async () => {
//             let el = await fetch(element[1])
//             let blob = await el.blob()
//             return blob
//         }
//         formdata.append(element[0], file())

//         console.log(file())
//     }else{
//         formdata.append(element[0], element[1])
//     }
// });

// HttpAuth.post('question/upload',formdata).then(res => {})
