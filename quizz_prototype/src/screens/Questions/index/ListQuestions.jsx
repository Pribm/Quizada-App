import { Accordion, AccordionDetails, AccordionSummary, Button, Checkbox, Chip, FormControl, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material'
import { Container } from '@mui/system'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

import { useDispatch, useSelector } from 'react-redux'
import { destroy, index } from 'store/Actions/questions.action'
import { change } from 'store/Actions/quizz.action'
import { index as fetchCategories } from 'store/Actions/categories.action'
import { FcSearch } from 'react-icons/fc'
import { changeConfirm } from 'store/Actions/confirm.action'

import { useNavigate, } from 'react-router-dom'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { GridExpandMoreIcon } from '@mui/x-data-grid'


const ListQuestions = () => {

  const { questions } = useSelector(state => state.questionsReducer)
  // const { categories } = useSelector(state => state.categoriesReducer)

  const dispatch = useDispatch()

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

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
    dispatch(index({ page: page + 1, per_page: rowsPerPage, ...query })).then(() => {
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
      setQuestionList(selectedQuestionsIds)
    } else {
      setQuestionList([])
    }

    setSelectAll(!selectAll)
  }


  return (
    <Container className='mt-8 text-center'>
      <h1 className='text-3xl text-white w-[50%] mx-auto'>
        Esta é a lista de questões criadas por você, selecione-as e crie um novo quizz!
      </h1>
      <FormControl fullWidth className='mt-8'>
        <Grid container spacing={2}>
          <Grid item md={8} xs={12}>
            <TextField
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
              changeHandler={e => {
                setQuery({ ...query, category: e.target.value, getUserCategoriesWithQuestions: true })
                setSearching(true)
              }} />
          </Grid>
        </Grid>
      </FormControl>
      {
        questions.data.length === 0 ?
          <Paper className='mt-8 flex flex-col items-center p-4'>
            <h1 className='mb-4'>Você não tem nenhuma correspondência para a sua busca</h1>
            <FcSearch size={120} />
          </Paper>
          :
          !isLoading &&
          <div className='mt-8'>
            {
              <p className='mb-2 text-white'>Total de questões: {questions.total}</p>
            }
            <TableContainer component={Paper}>
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
              <Table>
                <TableHead>
                  <TableRow >
                    <TableCell>
                      #
                    </TableCell>
                    <TableCell>
                      Pergunta
                    </TableCell>
                    <TableCell>
                      Resposta
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions?.data
                    .map((question, i) => (
                      <React.Fragment key={'question_table' + i}>
                        <TableRow className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'}`}>
                          <TableCell>
                            <Checkbox
                              onChange={handleQuestionList(question.id)}
                              checked={questionList.includes(question.id)}
                            />
                          </TableCell>
                          <TableCell>
                            {question.question}
                          </TableCell>
                          <TableCell>
                            {question.correct_answer}
                          </TableCell>
                        </TableRow>
                        <TableRow className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'}`}>
                          <TableCell colSpan={3}>
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
                          </TableCell>
                        </TableRow>
                        <TableRow className={`${i % 2 === 1 ? 'bg-white' : 'bg-slate-200'}`}>
                          <TableCell colSpan={3}>
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
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 20, 100]}
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
            </TableContainer>
          </div>
      }
      <div className='mt-4 md:inline-block flex flex-col'>
        <Button
          variant='contained'
          className='md:mx-4 mx-0 min-w-[200px]'
          color='secondary'
          onClick={() => dispatch(changeConfirm({
            open: true,
            msg: 'Você tem certeza que escolheu todas as perguntas do seu quizz?',
            confirmAction: handleCreateQuizz
          }))}
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
    </Container>
  )
}

export default MenuWrapper(ListQuestions)