import { Button, TextField } from "@mui/material"
import { logo } from "assets"
import { useState } from "react"
import { FcUnlock } from "react-icons/fc"
import { HiChevronLeft } from "react-icons/hi"
import { useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { forgotPassword } from "store/Actions/auth.action"

export const Forgot = () => {

    const [email, setEmail] = useState()
    const dispatch = useDispatch()
    
    return (
        <div className="min-h-screen w-full bg-sky-600 md:flex">
            <div className="bg-blue-500 h-[50vh] flex flex-col justify-center items-center md:min-w-[60vw] md:h-[100vh] relative">
                <Link to={'/'}>
                    <HiChevronLeft className="absolute text-white top-5 left-5" size={40}/>
                </Link>
                <FcUnlock size={150}/>
                <h1 className="text-3xl text-white">Esqueceu sua senha?</h1>
                <h3 className="text-xl text-white text-center px-4">Entre com seu endereço de email para recuperar sua senha</h3>
            </div>
            <div className="bg-white h-[50vh] flex flex-col items-center px-8 md:h-[100vh] md:justify-center">
                <img src={logo} alt="logo_quizada" className="h-[130px] mt-4 md:mt-0"/>
                <h3 className="mt-12 text-justify mb-4 text-blue-500">
                    Em alguns Instantes enviaremos uma mensagem no seu Inbox com a sua nova senha, caso não encontre, verifique a sua caixa de Spam
                </h3>
                <TextField
                    fullWidth
                    className="mx-4 md:mt-0 md:mb-6"
                    label='email'
                    type={'email'}
                    value={email || ''}
                    onChange={e => setEmail(e.target.value)}
                />
                <Button
                    variant="contained"
                    className="mt-12 md:mt-0"
                    onClick={() => dispatch(forgotPassword(email)).then(() => setEmail(''))}
                >
                    Recuperar Senha
                </Button>
            </div>
        </div>
    )
}