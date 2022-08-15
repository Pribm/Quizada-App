import React, { useEffect, useRef, useState } from 'react'
import MenuWrapper from 'components/wrappers/MenuWrapper'

import Lottie from 'lottie-react'
import { UploadSpaceship } from 'assets'

import { InputBase, ButtonBase, TextField, Fab } from '@mui/material'

import Dialog from 'components/dialog/Dialog'

import {AiFillPlusCircle, AiOutlineSearch} from 'react-icons/ai'

import {useDispatch, useSelector} from 'react-redux'
import {change as changeRules} from 'store/Actions/rules.action'
import { change, create as createQuizz } from 'store/Actions/quizz.action'
import {change as changeCategory, create, error} from 'store/Actions/categories.action'


import {useFormik} from 'formik'
import { createQuizzSchema } from './schemas/createQuizzSchema'
import { FcImageFile, FcPlus } from 'react-icons/fc'
import { BsFileRuled } from 'react-icons/bs'
import {  MdClose } from 'react-icons/md'
import CategorySelector from 'components/categorySelector/CategorySelector'

const CreateQuizz = () => {

    const [createNewCategory, setCreateNewCategory] = useState(false)
    const [categoryThumbnail, setCategoryThumbnail] = useState('')
    const [createCategory, setCreateCategory] = useState('')

    const dispatch = useDispatch()
    const {newQuizz: {image}, newQuizz, quizz} = useSelector(state => state.quizzReducer)
    const {errors: categoryErrors, category} = useSelector(state => state.categoriesReducer)
    const {rules} = useSelector(state => state.rulesReducer)

    const {values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue} = useFormik({
        initialValues: {
            category: 0,
            title: '',
            image: '',
            description: '',
        },
        validationSchema: createQuizzSchema,
        onSubmit: (v) => submitData(v),
    })

    const submitData = (values) => {
        if(quizz.length === 0){
            createNewQuizz(values)
        }

        if(quizz.length > 0){
            
            const fd = new FormData()
            fd.append('category_id', category.id)
            fd.append('title', values.title)
            fd.append('description', values.description)
            quizz.forEach((q,i) => fd.append(`questions[${i}]`, q))

            Object.keys(rules).forEach((rule) => {
                fd.append(rule, rules[rule])
            })
            
            if(imageInputRef.current.files.length > 0){
                fd.append('image', imageInputRef.current.files[0])
            }
    
            dispatch(createQuizz(fd))      
        }
    }

    const imageInputRef = useRef(null)
    const categoryImageRef = useRef(null)

    const createNewQuizz = (values) => {
        dispatch(change({
            creatingNewQuizz: true,
            newQuizz: {
                ...rules,
                category_id: category.id,
                title: values.title,
                image: image,
                description: values.description
            }
        }))
    }

    const handleImageUpload = e => {
        dispatch(change({newQuizz: {...newQuizz, image: URL.createObjectURL(e.target.files[0])}}))
    }


    const handleCreateCategory = async () => {
        let fd = new FormData()
        fd.append('image', categoryImageRef.current.files[0])
        fd.append('name', createCategory)
        dispatch(create(fd)).then(res => {
            if(res.success){
      
                setCreateNewCategory(false)
                setCreateCategory('')
                setFieldValue('category', res.category)
            }
        })
    }

  return (
    <div className='flex flex-col items-center min-h-[75vh] md:w-[30vw] md:mx-auto'>
        <Fab color="primary" aria-label="add" variant="extended" className='fixed bottom-[90px] left-4' onClick={() => dispatch(changeRules({open: true}))}>
            <BsFileRuled className='mr-2'/>
            Regras
          </Fab>
        <div
        onClick={() => {
            imageInputRef.current.click()
        }}
        className="p-4 mt-4 w-[200px] h-[200px] rounded-lg cursor-pointer"
        style={{border: 'dashed white 1px'}}>
            {
                !image ?
                <>
                    <h2 className='text-white md:text-xl text-center'>Imagem de capa</h2>
                    <div className='h-[150px] md:h-[150px] relative flex justify-center'>
                        <Lottie animationData={UploadSpaceship} />
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
            <div className="flex items-center mt-4">
            <CategorySelector size='medium' className='mr-2' changeHandler={e => setFieldValue('category', e.target.value)}/>
            <FcPlus size={60} className='my-auto text-white cursor-pointer' onClick={() => setCreateNewCategory(true)}/>
            </div>

            {errors.category && touched.category && <div className='bg-red-500 mt-2 text-center text-white p-2'>{errors.category}</div>}            
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
                handleSubmit()
            }}
            className='bg-orange-500 rounded-xl p-4 text-white'>
                Criar Quizz
            </ButtonBase>
        </div>

        <Dialog
            open={createNewCategory}
            dialogtitle='Deseja criar uma nova categoria?'
            dialogcontenttext='Ainda não temos a categoria que você selecionou na nossa base de dados, por favor cadastre.'
            actionButtonText='Confirmar'
            handleConfirm={handleCreateCategory}
            handleClose={() => {
                setCreateNewCategory(false)
                setCategoryThumbnail('')
            }}
        >
            <div className='w-[100%] flex flex-col justify-center items-center '>
                <div
                onClick={() => categoryImageRef.current.click()}
                className='w-[120px] h-[120px] rounded-2xl flex justify-center items-center mb-4 relative cursor-pointer'
                style={{border: 'dashed #ccc 1px'}}
                >
                
                    {
                        !categoryThumbnail ?
                        <>
                            <div className="flex flex-col items-center text-slate-500">
                            <h2>Imagem</h2>
                            <FcImageFile size={30}/>
                            </div>
                            <FcPlus size={30} className='absolute right-[-10px] bottom-[-10px]'/>
                        </>
                        :
                       <>
                        <MdClose
                        className='bg-red-500 text-white rounded-full top-2 right-2 z-10 absolute'
                        onClick={() => {
                            setCategoryThumbnail('')
                            categoryImageRef.current.value = ''
                            if(categoryErrors.image){
                                let currErrors = categoryErrors;
                                currErrors = delete currErrors.image
                                dispatch(error(currErrors))
                            }
                        }}
                        />
                        <img src={categoryThumbnail} alt="category_thumb"  className='w-[100%] h-[100%] rounded-2xl object-cover'/>
                       </>
                    }
                </div>
                {categoryErrors.image && <label className='text-red-500'>{categoryErrors.image[0]}</label>}
            </div>
            <TextField
            label='imagem'
            type={'file'}
            fullWidth
            size='small'
            className='hidden'
            inputRef={categoryImageRef}
            onChange={e => {
                setCategoryThumbnail(URL.createObjectURL(e.target.files[0]))
                if(categoryErrors.image){
                    let currErrors = categoryErrors;
                    currErrors = delete currErrors.image
                    dispatch(error(currErrors))
                }

            }}
            />
            <TextField
            value={createCategory || ''}
            onChange={e => {
                setCreateCategory(e.target.value)
                if(categoryErrors.name){
                    let currErrors = categoryErrors;
                    currErrors = delete currErrors.name
                    dispatch(error(currErrors))
                }
            }}
            label='Título da categoria'
            type={'text'}
            fullWidth size='small'
            error={categoryErrors.name ? true : false}
            helperText={categoryErrors.name ? categoryErrors.name[0] : ''}
            />
        </Dialog>
    </div>
  )
}

export default MenuWrapper(CreateQuizz)