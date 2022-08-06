import { Button, TextField } from "@mui/material"
import { useFormik } from "formik"
import { FcUnlock } from "react-icons/fc"
import { HiChevronLeft } from "react-icons/hi"
import { useDispatch } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { resetPassword } from "store/Actions/auth.action"

import * as field from 'yup'

const passwordValidation = () => {
   const passwordValidationSchema = field.object({
    password: field.string()
                    .min(10, 'Este campo precisa de no mínimo 10 caracteres') 
                    .matches(/[A-Z]/, 'precisa ter pelo menos uma letra maiúscula')
                    .matches(/([a-z])/, 'precisa ter pelo menos uma letra minúscula')
                    .matches(/(\d)/, 'precisa ter pelo menos um número')
                    .matches(/[@$!%*#?&_]/, 'precisa de pelo menos um caractere especial')
    ,password_confirm: field.string()
    .required('Você precisa confirmar sua senha')
     .oneOf([field.ref('password'), null], 'A confirmação de senha está incorreta')

   })

   return passwordValidationSchema
}

export const PasswordReset = () => {
    const {
        values: {
            password,
            password_confirm
        },
        values,
        setFieldValue,
        resetForm,
        validateForm,
        errors
    } = useFormik({
        initialValues: {
            password: '',
            password_confirm: ''
        },
        validationSchema: passwordValidation
    })

    const dispatch = useDispatch()
    const params = useParams()
    
    return (
        <div className="min-h-screen w-full bg-sky-600 md:flex">
            <div className="bg-blue-500 h-[50vh] flex flex-col justify-center items-center md:min-w-[60vw] md:h-[100vh] relative">
                <Link to={'/'}>
                    <HiChevronLeft className="absolute text-white top-5 left-5" size={40}/>
                </Link>
                <FcUnlock size={150}/>
                <h1 className="text-3xl text-white">Recuperação de senha</h1>
                <h3 className="text-xl text-white text-center px-4">Entre sua nova senha para redefinir</h3>
            </div>
            <div className="bg-white h-[50vh] flex flex-col items-center px-8 md:h-[100vh] md:justify-center md:min-w-[40vw]">
                <h3 className="mt-12 text-justify mb-4 text-blue-500">
                    Após redefinir, você estará habilitado afazer login com sua nova senha.
                </h3>
                <TextField
                    fullWidth
                    className="mx-4 md:mt-0 md:mb-6 mb-4"
                    label='Senha'
                    type={'password'}
                    value={password || ''}
                    error={errors.password ? true : false}
                    helperText={errors.password && errors.password}
                    onChange={e => setFieldValue('password',e.target.value)}
                />

                <TextField
                    fullWidth
                    className="mx-4 md:mt-0 md:mb-6"
                    label='Confirmação de Senha'
                    type={'password'}
                    value={password_confirm || ''}
                    error={errors.password_confirm ? true : false}
                    helperText={errors.password_confirm && errors.password_confirm}
                    onChange={e => setFieldValue('password_confirm',e.target.value)}
                />
                <Button
                    variant="contained"
                    className="mt-12 md:mt-0"
                    onClick={() => {
                        validateForm().then(errors => {
                            if(Object.keys(errors).length === 0){
                                dispatch(resetPassword({...values, token: params.token})).then(() => resetForm())
                            }
                        })
                    }}
                >
                    Redefinir Senha
                </Button>
            </div>
        </div>
    )
}