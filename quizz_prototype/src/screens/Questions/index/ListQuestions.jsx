import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Chip, CircularProgress, FormControl, FormControlLabel, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

import { useDispatch, useSelector } from 'react-redux'
import { destroy, index, show } from 'store/Actions/questions.action'
import { change } from 'store/Actions/quizz.action'
import { FcSearch } from 'react-icons/fc'
import { changeConfirm } from 'store/Actions/confirm.action'

import { useNavigate, } from 'react-router-dom'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { GridExpandMoreIcon } from '@mui/x-data-grid'
import ScrollTopButton from 'components/buttons/ScrollTopButton'
import { MdEdit } from 'react-icons/md'
import FullScreenDialog from 'components/dialog/FullScreenDialog'
import EditQuestion from '../edit/EditQuestion'
import { changeAlert } from 'store/Actions/alert.action'
import { changeLoading } from 'store/Actions/loading.action'


const ListQuestions = () => {

  const { questions } = useSelector(state => state.questionsReducer)
  // const { categories } = useSelector(state => state.categoriesReducer)

  const dispatch = useDispatch()

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [category, setCategory] = useState(0);
  const [openEditQuestion, setOpenEditQuestion] = useState(false);

  const [questionList, setQuestionList] = useState([])

  const [isLoading, setLoading] = useState(true)
  const [isSearching, setSearching] = useState(false)

  const [selectAll, setSelectAll] = useState(false)

  const [query, setQuery] = useState({
    search: '',
    category: 0
  })

  const forwardPaginationButton = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(index({ per_page: rowsPerPage })).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    dispatch(changeLoading({open: true}))
    dispatch(index({ page: page + 1, per_page: rowsPerPage, ...query })).then(() => {
      dispatch(changeLoading({open: false}))
      setSearching(false)
      setLoading(false)
    })


  }, [page, rowsPerPage, isSearching])

  const handleChangePage = (event, newPage) => {
    if (newPage < questions.last_page) {
      setPage(newPage)
      setSelectAll(false)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    setSelectAll(false)
  };

  const handleQuestionList = (id) => e => {
    if (e.target.checked) {
      setQuestionList(ql => ql = [...ql, id])
      return
    } else {
      setQuestionList(ql => ql.filter(q => q !== id))
    }
  }

  const handleCreateQuizz = () => {
    dispatch(change({ quizz: questionList }))
    dispatch(changeConfirm({ open: false }))
    navigate('/quizz/create', { replace: true, })
  }

  const handleDeleteQuestions = () => {
    dispatch(destroy(questionList))
    dispatch(changeConfirm({ open: false }))
    setSelectAll(false)
  }

  const handleSelectAll = () => {
    let selectedQuestionsIds = questions?.data.map(question => question.id)
    if (!selectAll) {
      let selection = selectedQuestionsIds.filter(ql => !questionList.includes(ql))
      setQuestionList(questionList => questionList.concat(selection))
    } else {
      setQuestionList([])
    }
   
    setSelectAll(!selectAll)
  }


  return (
    <div className='w-[100vw] md:w-[600px]  md:mx-auto px-2'>
      <h1 className='md:text-lg text-white text-center '>
        Esta é a lista de questões criadas por você, selecione-as e crie um novo quizz!
      </h1>
      <FormControl fullWidth className='mt-8'>
        <Grid container>
          <Grid item md={7.8} xs={12} className='md:mr-auto'>
            <TextField
              className='mb-3 md:mb-0'
              placeholder='Procure uma pergunta ou uma resposta'
              size='small'
              fullWidth
              InputProps={{
                endAdornment: <IoSearch className='cursor-pointer' onClick={() => setSearching(true)} />,
                color: 'primary',
                className: 'bg-white'
              }}
              value={query.search}
              onChange={e => setQuery({ ...query, search: e.target.value })}
            />
          </Grid>
     
          <Grid item md={4} xs={12}>
            <CategorySelector
              categorySelectorQuery={{ getUserCategoriesWithQuestions: true }}
              category={category}
              changeHandler={e => {
                setQuery({ ...query, category: e.target.value, getUserCategoriesWithQuestions: true })
                setSearching(true)
                setCategory(e.target.value)
              }} />
          </Grid>
        </Grid>
      </FormControl>
      {
        isLoading ?
        <Paper className='mt-4 h-[250px] flex justify-center items-center p-4'>
          <CircularProgress/>
        </Paper>
        :
        questions.data.length === 0 ?
          <Paper className='mt-8 flex flex-col items-center'>
            <h1 className='mb-4'>Você não tem nenhuma correspondência para a sua busca</h1>
            <FcSearch size={120} />
          </Paper>
          :
          <div className='mt-8 w-[100%] '>
            {
              <p className='mb-2 text-white'>Total de questões: {questions.total}</p>
            }

              <Button
                fullWidth
                variant='contained'
                onClick={handleSelectAll}
                color={selectAll ? 'error' : 'success'}
              >
                {
                  selectAll ? 'Desselecionar todas as questões' : 'Selecionar Todas as questões'
                }

              </Button>
              <div className='w-[100%] '>
                <div className='w-100 h-[50px] flex flex-row items-center bg-orange-500 text-white'>
                  <div className='w-[10%] bg-white h-[100%] flex items-center justify-center p-2' >
                    <Checkbox
                    onChange={handleSelectAll}
                    />
                  </div>

                  <div className='w-[50%] bg-orange-400 h-[100%] flex items-center p-2' >
                    Pergunta
                  </div>

                  <div className='w-[30%]  h-[100%] flex items-center p-2'>
                    Resposta
                  </div>
                  <div className='w-[10%] bg-orange-400 h-[100%] flex items-center justify-center p-2' >
                  </div>
                </div>
                <div className='w-[100%]'>
                  {questions?.data
                    .map((question, i) => (
                      <React.Fragment key={'question_table' + i}>
                        <div className={`w-[100%] flex flex-row items-center ${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'} border-t-4 border-blue-400 `} >
                          <div className={`w-[10%] bg-white min-h-[60px] flex justify-center items-center p-2`}>
                            <Checkbox
                              onChange={handleQuestionList(question.id)}
                              checked={questionList.includes(question.id)}
                            />
                          </div>
                          <div className={`w-[50%] bg-slate-300 min-h-[60px] flex items-center p-2`}>
                            {question.question}
                          </div>
                          <div className='w-[30%] bg-white min-h-[60px] flex items-center p-2'>
                            {question.correct_answer}
                          </div>
                          <div
                          onClick={() => dispatch(show(question.id)).then(() => setOpenEditQuestion(true))}
                          className='w-[10%] bg-slate-100 min-h-[60px] justify-center flex items-center p-2 cursor-pointer'
                          >
                              <MdEdit/>
                          </div>
                        </div>

                        <div className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'}`}>
                          <div className='p-4'>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>Mostrar Respostas</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                <div>
                                  {
                                    '1- ' + question.answer_1
                                  }
                                </div>
                                <div>
                                  {
                                    '2- ' + question.answer_2
                                  }
                                </div>
                                <div>
                                  {
                                    '3- ' + question.answer_3
                                  }
                                </div>
                                <div>
                                  {
                                    '4- ' + question.answer_4
                                  }
                                </div>
                                <div>
                                  {
                                    '5- ' + question.answer_5
                                  }
                                </div>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>
                        <div className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'}`}>
                          <div className='p-4'>
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<GridExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                              >
                                <Typography>Mostrar Categorias</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {
                                  question.category.map((c, j) => (
                                    <Chip
                                      key={'questions_cat_' + i + '_' + j}
                                      label={c.name}
                                      className='mr-2 mb-2'
                                    />
                                  ))
                                }
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>
                      </React.Fragment>
                    ))}
                </div>
              </div>
              <TablePagination
                className='bg-white'
                rowsPerPageOptions={[5, 10, 20, 100, 500]}
                component="div"
                count={questions.total}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelDisplayedRows={({ from, to, count }) => `${from} - ${to} de ${count}`}
                labelRowsPerPage={'Registros por página'}
                nextIconButtonProps={{ disabled: page + 1 < questions.last_page ? false : true, ref: forwardPaginationButton }}
              />
         
          </div>
      }
      <div className='mt-4 md:inline-block flex flex-col'>
        <Button
          variant='contained'
          className='md:mx-4 mx-0 min-w-[200px]'
          color='secondary'
          onClick={() => {
            if(questionList.length <= 0){
              dispatch(changeAlert({open: true, class: 'error', msg: 'Adicione pelo menos uma questão à lista'}))
            }else{
              dispatch(changeConfirm({
                open: true,
                msg: 'Você tem certeza que escolheu todas as perguntas do seu quizz?',
                confirmAction: handleCreateQuizz
              }))
            }
          }}
        >
          Criar Quizz
        </Button>
        <Button
          variant='contained'
          color='error'
          className='md:mx-4 mx-0 min-w-[200px] md:mt-0 mt-4 '
          onClick={() => dispatch(changeConfirm({
            open: true,
            msg: 'Você tem certeza que deseja deletar estas questões?',
            confirmAction: handleDeleteQuestions
          }))}
        >
          Deletar Questões
        </Button>
      </div>
      <ScrollTopButton/>
      <FullScreenDialog
          title={'Editar Perguntas do Quizz'}
          open={openEditQuestion}
          setOpen={setOpenEditQuestion}

        >
          <EditQuestion
          setOpen={setOpenEditQuestion}
          />
        </FullScreenDialog>
    </div>
  )
}

export default MenuWrapper(ListQuestions)