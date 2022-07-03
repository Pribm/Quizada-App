import React, { useEffect, useRef, useState } from 'react'
import MenuWrapper from 'components/wrappers/MenuWrapper'

import Lottie from 'lottie-react'
import { UploadSpaceship } from 'assets'

import { InputBase, ButtonBase, TextField } from '@mui/material'

import Dialog from 'components/dialog/Dialog'

import {AiFillPlusCircle, AiOutlineSearch} from 'react-icons/ai'

import {useDispatch, useSelector} from 'react-redux'
import { change } from 'store/Actions/quizz.action'
import {change as changeCategory, create, error} from 'store/Actions/categories.action'
import { index } from 'store/Actions/categories.action'


import {useFormik} from 'formik'
import { createQuizzSchema } from './schemas/createQuizzSchema'

const CreateQuizz = () => {

    const [searchTerm, setSearchTerm] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [createCategory, setCreateCategory] = useState('')

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(index(searchTerm)).then(() => {
                setShowSearchResults(true)
            })
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [searchTerm])

    useEffect(() => {
        return () => dispatch(changeCategory('clear'))
    }, [])

    const dispatch = useDispatch()
    const {newQuizz: {image}, newQuizz} = useSelector(state => state.quizzReducer)
    const {categories, category: categoryData, errors: categoryErrors} = useSelector(state => state.categoriesReducer)

    const {values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            category: '',
            title: '',
            image: '',
            description: '',
        },
        validationSchema: createQuizzSchema,
        onSubmit: (v) => submitData(v),
    })

    const submitData = (values) => {
        console.log(Object.keys(categoryData).length)
        if(Object.keys(categoryData).length === 0){
            setDialogOpen(true);
            return
        } 

        dispatch(change({
            creatingNewQuizz: true,
            newQuizz: {
                ...newQuizz,
                ...values
            }
        }))
    }

    const imageInputRef = useRef(null)
    const categoryImageRef = useRef(null)

    const handleImageUpload = e => {
        dispatch(change({newQuizz: {...newQuizz, image: URL.createObjectURL(e.target.files[0])}}))
    }

    const handleCategoriesSearch = e => {
        setShowSearchResults(false)
        dispatch(change({newQuizz: {...newQuizz, category: e.target.value}}))
        setSearchTerm(e.target.value)
    }

    const handleCreateCategory = () => {
       
        let fd = new FormData()
        fd.append('image', categoryImageRef.current.files[0])
        fd.append('name', createCategory)
        dispatch(create(fd)).then(() => {
            if(Object.keys(categoryErrors).length === 0){
                setDialogOpen(false)
            }
        })
    }

  return (
    <div className='flex flex-col items-center min-h-[75vh] md:w-[30vw] md:mx-auto'>
        <div
        onClick={() => imageInputRef.current.click()}
        className="p-4 mt-4 w-[250px] h-[250px] rounded-lg cursor-pointer"
        style={{border: 'dashed white 1px'}}>
            {
                !image ?
                <>
                    <h2 className='text-white md:text-xl text-center'>Imagem de capa</h2>
                    <div className='h-[20vh] md:h-[25vh] relative flex justify-center'>
                        <Lottie animationData={UploadSpaceship} className='absolute h-[100%]'/>
                        <AiFillPlusCircle size={40} className='absolute bottom-5 right-50 translate-x-[150%] z-10 rounded-full text-red-700 bg-white'/>
                    </div>
                </>
                :
                <img src={image} alt="quizz avatar" className='w-[100%] h-[100%] object-cover'/>
            }
        </div>
        <input type="file" className='hidden' ref={imageInputRef} onChange={handleImageUpload}/>
        <div className='mt-4 w-[100%] px-4 relative'>
            <h2 className='text-xl text-center text-white'>Categoria do quizz</h2>
            <InputBase
            fullWidth
            value={values.category}
            onChange={e => setFieldValue('category', e.target.value).then(() => handleCategoriesSearch(e))}
            onBlur={() => setShowSearchResults(false)}
            id="category"
            className={`mt-2 bg-white rounded-full h-[3rem] px-5 text-xl`}
            endAdornment={<AiOutlineSearch size={30}/>}
            />
            {errors.category && touched.category && <div className='bg-red-500 mt-2 text-center text-white p-2'>{errors.category}</div>}
            {
                (showSearchResults && values.category.length > 1) &&
                <div className='bg-slate-100 w-[75%] absolute bottom-0 right-[50%] translate-x-[50%] translate-y-[100%] z-20 max-h-[120px] shadow-xl overflow-y-scroll'>
                    {
                        categories?.map((category, i) => (
                            <div key={'catSearch_'+i} className=' border-orange-600 border-t p-4 cursor-pointer hover:bg-slate-200'
                            onClick={() => {
                                dispatch(changeCategory(category))
                                setShowSearchResults(false)
                                dispatch(change({newQuizz: {...newQuizz, category: category.name}}))
                            }}>

                                <h4>{category.name}</h4>
                            </div>
                        ))
                    }
                </div>
            }
            
        </div>

        <div className='mt-4 w-[100%] px-4'>
            <h2 className='text-xl text-center text-white'>Título do quizz</h2>
            <InputBase
            value={values.title}
            onChange={handleChange}
            onBlur={handleBlur}
            id="title"
            fullWidth
            className='mt-2 bg-white rounded-full h-[3rem] px-5 text-xl'/>
            {(errors.title && touched.title) && <div className='bg-red-500 mt-2 text-center text-white p-2'>{errors.title}</div>}
        </div>

        <div className='mt-4 w-[100%] px-4'>
            <h2 className='text-xl text-center text-white'>Descrição do quizz</h2>
            <InputBase
            value={values.description}
            onChange={handleChange}
            id="description"
            multiline
            fullWidth
            rows={5}
            className='mt-2 p-4 bg-white rounded-xl py-2 text-xl' />
        </div>

        <div className="flex justify-center mt-4 mb-4">
            <ButtonBase
            onClick={() => {
                if(categories.length === 0){
                    setDialogOpen(true)
                    return
                }
                handleSubmit()
            }}
            className='bg-orange-500 rounded-xl p-4 text-white'>
                Criar Quizz
            </ButtonBase>
        </div>

        <Dialog
            open={dialogOpen}
            dialogTitle='Deseja criar uma nova categoria?'
            dialogContentText='Ainda não temos a categoria que você selecionou na nossa base de dados, por favor cadastre.'
            actionButtonText='Confirmar'
            handleConfirm={handleCreateCategory}
            handleClose={() => setDialogOpen(false)}
            dialogBody={
                <>
                    <TextField
                    size='small'
                    fullWidth
                    margin='dense'
                    type={'text'}
                    label='Categoria'
                    value={createCategory}
                    onChange={e => {
                        if(categoryErrors.name){
                            let errs = Object.assign({}, categoryErrors)
                            delete errs.name
                            dispatch(error(errs))
                        }
                        setCreateCategory(e.target.value)
                    }}/>
                    {categoryErrors.name && <p className='text-red-500'>{categoryErrors.name[0]}</p>}
                    <TextField type={'file'} fullWidth margin='dense' size='small' inputRef={categoryImageRef}/>
                </>
            }
        />
    </div>
  )
}

export default MenuWrapper(CreateQuizz)