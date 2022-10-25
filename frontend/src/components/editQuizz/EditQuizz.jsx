import { Checkbox, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableFooter, TablePagination, TableRow } from '@mui/material'
import CategorySelector from 'components/categorySelector/CategorySelector'
import { SearchBox } from 'components/searchBox/SearchBox'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeConfirm } from 'store/Actions/confirm.action'
import { index } from 'store/Actions/questions.action'
import { change, show } from 'store/Actions/quizz.action'
import { update } from 'store/Actions/rules.action'

const EditQuizz = ({id, token, rules, saving, setSaving, setOpenEditQuizz}) => {

    const dispatch = useDispatch()
    const [isLoading, setLoading] = useState(true)
    const [page, setPage] = React.useState(0);
    const [search, setSearch] = React.useState('');
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    const [category, setCategory] = React.useState(0)

    const {
        questions,
    } = useSelector(state => state.questionsReducer)

    const {
        questions: quizzQuestions,
    } = useSelector(state => state.quizzReducer)

    useEffect(() => {
        dispatch(index())
        .then(
            () => dispatch(show(token, {all_questions_by_id: true}))
        .then(
            () => setLoading(false))
        )
        return () => {
            dispatch(changeConfirm('clear'))
            setSaving(false)
        }
    }, [])

    useEffect(() => {
        if(saving){
            handleSave()
        }
    }, [saving])

    const handleChangeRowsPerPage = (event) => {
        setPage(0);
        setLoading(true)
        setRowsPerPage(parseInt(event.target.value, 10));
        dispatch(index({per_page: event.target.value})).then(() => {
            setLoading(false)
        })
      };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        setLoading(true)
        dispatch(index({page: newPage+1, per_page: rowsPerPage})).then(() => {
            setLoading(false)
        })
    };

    const handleSearch = categoryId => {
        setLoading(true)
        dispatch(index({search})).then(() => {
            setLoading(false)
        })
    }

    const handleChangeCategory = categoryId => {
        setLoading(true)
        dispatch(index({search, category: categoryId})).then(() => {
            setLoading(false)
        })  
    }

    const handleSave = () => {
        dispatch(changeConfirm({
            open: true,
            msg: 'Caso o quiz seja alterado, o ranking será reiniciado.',
            confirmAction: () => dispatch(update(id, {...rules, questions: quizzQuestions})).then(() => {
                setOpenEditQuizz(false)
              
            })
        }))
        
    }

    const handleCheck = id => {
        let newQuestionsArray;
        if(quizzQuestions.includes(id)){
            newQuestionsArray = quizzQuestions.filter(item => item !== id)
        }else{
            newQuestionsArray = quizzQuestions.concat(id)
        }
        dispatch(change({questions: newQuestionsArray}))
    }

  return (
      <div className='bg-slate-50 h-[calc(100vh-150px)] p-4'>
          <div className='h-[80px] mb-4'>
              <div className='mb-2'>
                  <SearchBox
                  onChange={e => setSearch(e.target.value)}
                  value={search}
                  searchHandler={handleSearch}
                  className='bg-slate-300 w-[100%] rounded-md '
                  placeholder='Questão ou Resposta' />
              </div>
              <CategorySelector category={category} changeHandler={e => {
                  handleChangeCategory(e.target.value)
                  setCategory(e.target.value)
              }} />
          </div>

          <TableContainer component={Paper} className='h-[calc(100%-140px)]'>
              {isLoading ?
                  <div className='flex justify-center p-4'>
                      <CircularProgress />
                  </div>
                  :
                  <Table aria-label="tabela-editar-quiz" className='h-[100%] outline-none' >
                      <TableBody className='h-[90%]'>
                          {questions.data.map((row, i) => (
                              <TableRow key={row.id + 'quiz_edit'} className={`table w-[100%] ${i % 2 === 1 ? 'bg-slate-100' : 'bg-white'}`}>
                                  <TableCell component="th" scope="row" className='w-[10%]' sx={{ borderRight: 'solid #ddd 2px !important' }}>
                                      <Checkbox
                                      checked={quizzQuestions.includes(row.id)}
                                      onClick={() => handleCheck(row.id)}
                                      />
                                  </TableCell>
                                  <TableCell component="th" scope="row" className='w-[90%]'>
                                      {row.question}
                                  </TableCell>
                              </TableRow>
                          ))}

                      </TableBody>
                  </Table>}
          </TableContainer>
          <TablePagination
              component={'div'}
              count={questions.total || 0}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
              labelRowsPerPage={<>Perguntas</>}
          />
      </div>
  )
}

export default EditQuizz