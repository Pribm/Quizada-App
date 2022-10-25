import * as field from 'yup'

export const contactFormSchema = field.object({
    name: field.string().required('Você precisa preencher o seu nome antes de enviar o email'),
    subject: field.string().required('O campo de mensagem é obrigatório'),
    message: field.string().required('O campo de assunto é obrigatório'),
})