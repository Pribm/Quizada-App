import { Button, FormControl, Paper, TextField } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { MdImage } from 'react-icons/md'
import { useDispatch, useSelector } from 'react-redux'
import { change, update, errors as err } from 'store/Actions/questions.action'
import { getQuestionThumbnail } from 'utils/getThumbnails'

const EditQuestion = ({setOpen}) => {

    const dispatch = useDispatch()

    const {question, errors} = useSelector(state => state.questionsReducer)
    const [thumbnailUrl, setThumbnailUrl] = useState('')

    const inputRef = useRef(null)

    useEffect(() => {
      setThumbnailUrl(getQuestionThumbnail(question.image, question.id))
        // if(thumbnailUrl !== '' && thumbnailUrl !== null){
        // }
        return () => dispatch(err('clear'))
    },[])

    const handleFile = () => {
      inputRef.current.click()
    }

    const handleThumbnail = e => {
      let inputFile = e.target.files[0]
      let fileUrl = URL.createObjectURL(inputFile)
      setThumbnailUrl(fileUrl)
    }

    const handleUpdate = () => {
      let fd = new FormData()
      Object.entries(question).forEach(att => {
        fd.append(att[0], att[1])
      })
      if(inputRef.current.files[0]){
        fd.append('image', inputRef.current.files[0])
      }

      dispatch(update(question.id, fd)).then(() => setOpen(false))
    }

  return (
    <div className='h-[calc(100vh-58px)] p-8 bg-slate-50' >
          <Paper className='h-[100%] md:w-[650px] md:mx-auto p-4 flex flex-col items-center' elevation={4}>
              <div
              className='w-[150px] overflow-hidden h-[150px] rounded-md flex justify-center items-center cursor-pointer my-4'
              style={{ border: '#ccc dashed 2px' }}
              onClick={handleFile}
              >
                {
                    (thumbnailUrl !== '' && thumbnailUrl !== null) ?
                    <>
                      <img
                      src={thumbnailUrl}
                      alt='thumbnail'
                      className='w-[100%] h-[100%] object-cover'
                      />
                    </>
                    :
                    <MdImage size={30} className='text-slate-500'/>
                  }
              </div>

              <input
                  type="file"
                  className='hidden'
                  ref={inputRef}
                  onChange={handleThumbnail}
                />
              <FormControl fullWidth>
                  <TextField
                    label='Pergunta'
                    rows={3}
                    multiline
                    margin='dense'
                    value={question.question}
                    onChange={e => {
                        dispatch(change({question: {...question, question: e.target.value}}))
                        if(errors.question){
                            let newErr = delete errors.question
                            dispatch(err(newErr))
                        }
                    }}
                    id='question'
                    error={errors.question}
                    helperText={errors.question && errors.question[0]}
                  />

                  <TextField
                    label='Resposta Correta'
                    margin='dense'
                    size='small'
                    value={question.correct_answer}
                    id='correct_answer'
                    onChange={e => {
                        dispatch(change({ question: { ...question, correct_answer: e.target.value, answer_1: e.target.value } }))
                        if (errors.correct_answer) {
                            let newErr = delete errors.correct_answer
                            dispatch(err(newErr))
                        }
                    }}
                    error={errors.correct_answer}
                    helperText={errors.correct_answer && errors.correct_answer[0]}
                  />

                  <TextField
                      label='Resposta Incorreta #01'
                      margin='dense'
                      size='small'
                      value={question.answer_2}
                      id='answer_2'
                      onChange={e => {
                          dispatch(change({ question: { ...question, answer_2: e.target.value } }))
                          if (errors.answer_2) {
                              let newErr = delete errors.answer_2
                              dispatch(err(newErr))
                          }
                      }}
                      error={errors.answer_2}
                      helperText={errors.answer_2 && errors.answer_2[0]}
                  />

                  <TextField
                      label='Resposta Incorreta #02'
                      margin='dense'
                      size='small'
                      value={question.answer_3}
                      id='answer_3'
                      onChange={e => {
                        dispatch(change({ question: { ...question, answer_3: e.target.value } }))
                        if (errors.answer_3) {
                            let newErr = delete errors.answer_3
                            dispatch(err(newErr))
                        }
                    }}
                    error={errors.answer_3}
                    helperText={errors.answer_3 && errors.answer_3[0]}
                  />

                  <TextField
                      label='Resposta Incorreta #03'
                      margin='dense'
                      size='small'
                      value={question.answer_4}
                      id='answer_4'
                      onChange={e => {
                        dispatch(change({ question: { ...question, answer_4: e.target.value } }))
                        if (errors.answer_4) {
                            let newErr = delete errors.answer_4
                            dispatch(err(newErr))
                        }
                    }}
                    error={errors.answer_4}
                    helperText={errors.answer_4 && errors.answer_4[0]}
                  />

                  <TextField
                      label='Resposta Incorreta #04'
                      margin='dense'
                      size='small'
                      value={question.answer_5}
                      id='answer_5'
                      onChange={e => {
                        dispatch(change({ question: { ...question, answer_5: e.target.value } }))
                        if (errors.answer_5) {
                            let newErr = delete errors.answer_5
                            dispatch(err(newErr))
                        }
                    }}
                    error={errors.answer_5}
                    helperText={errors.answer_5 && errors.answer_5[0]}
                  />

                  <Button
                  variant='contained' className='mt-3' color='secondary'
                  onClick={handleUpdate}
                  >
                    Salvar
                  </Button>
              </FormControl>
          </Paper>
    </div>
  )
}

export default EditQuestion