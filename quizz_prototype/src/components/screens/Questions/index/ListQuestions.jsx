import { Button, Checkbox, FormControl, Grid, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from '@mui/material'
import { Container } from '@mui/system'
import MenuWrapper from 'components/wrappers/MenuWrapper'
import React, { useEffect, useRef, useState } from 'react'
import { IoSearch } from 'react-icons/io5'

import { useDispatch, useSelector } from 'react-redux'
import { index } from 'store/Actions/questions.action'
import { change } from 'store/Actions/quizz.action'
import { index as fetchCategories } from 'store/Actions/categories.action'
import { FcSearch } from 'react-icons/fc'
import { changeConfirm } from 'store/Actions/confirm.action'

import { useNavigate,  } from 'react-router-dom'


const ListQuestions = () => {

  const {questions} = useSelector(state => state.questionsReducer)
  const {categories} = useSelector(state => state.categoriesReducer)

  const dispatch = useDispatch()

  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  const [questionList, setQuestionList] = useState([])

  const [isLoading,setLoading] = useState(true)
  const [isSearching, setSearching] = useState(false)

  const [query, setQuery] = useState({
    question: '',
    category: 0
  })

  const forwardPaginationButton = useRef(null)

  const navigate = useNavigate()

  useEffect(() => {
    dispatch(index({per_page:rowsPerPage})).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    dispatch(index({page: page+1, per_page:rowsPerPage, ...query})).then(() => {
      setSearching(false)
      setLoading(false)
    })
    dispatch(fetchCategories())

  }, [page, rowsPerPage, isSearching])

  const handleChangePage = (event, newPage) => {
    if(newPage < questions.last_page){
      setPage(newPage)
    }
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleQuestionList = (id) => e => {
    if(e.target.checked){
      setQuestionList(ql => ql = [...ql, id])
      return
    }else{
      setQuestionList(ql => ql.filter(q => q !== id))
    }
  }

  const handleCreateQuizz = () => {
    dispatch(change({ quizz: questionList }))
    dispatch(changeConfirm({ open: false }))
    navigate('/quizz/create', { replace: true, })
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
                placeholder='Procure uma questão específica'
                size='small'
                fullWidth
                InputProps={{
                  endAdornment: <IoSearch  className='cursor-pointer' onClick={() => setSearching(true)}/>,
                  color: 'primary',
                  className: 'bg-white'
                }}
                value={query.question}
                onChange={e => setQuery({...query, question: e.target.value})}
              />
            </Grid>

            <Grid item md={4} xs={12}>
              <Select
              fullWidth
              size='small'
              value={query.category}
              placeholder='categoria'
              inputProps={{
                className: 'bg-white'
              }}
              onChange={e => {
                setQuery({...query, category: e.target.value})
                setSearching(true)
              }}
              >
                <MenuItem value={0}>
                      Selecione uma Categoria
                </MenuItem>
                {
                  categories?.map(({name, id}, i) => (
                    <MenuItem
                    key={'category_select_'+i}
                    value={id}>
                      {name}
                    </MenuItem>
                  ))
                }
              </Select>
            </Grid>
          </Grid>
        </FormControl>
        {
          questions?.data?.length === 0 ?
          <Paper className='mt-8 flex flex-col items-center p-4'>
            <h1 className='mb-4'>Você não tem nenhuma correspondência para a sua busca</h1>
            <FcSearch size={120}/>
          </Paper>
          :
          !isLoading &&
          <TableContainer className='mt-8' component={Paper}>
            <Table >
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
                  <TableCell>
                    Categoria
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions?.data
                .map((question, i) => (
                  <TableRow key={'question_table'+i}>
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
                    <TableCell>
                      {question.category.name}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5,10,20]}
              component="div"
              count={questions.total}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({from, to, count}) => `${from} - ${to} de ${count}`}
              labelRowsPerPage={'Registros por página'}
              nextIconButtonProps={{disabled: page+1 < questions.last_page ? false : true, ref: forwardPaginationButton}}
            />
          </TableContainer>
        }
        <Button
        variant='contained'
        className='mt-4'
        color='secondary'
        onClick={() => dispatch(changeConfirm({
          open: true,
          msg: 'Você tem certeza que escolheu todas as perguntas do seu quizz?',
          confirmAction: handleCreateQuizz
        }))}
        >
          Criar Quizz
        </Button>
    </Container>
  )
}

export default MenuWrapper(ListQuestions)