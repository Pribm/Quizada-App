import  * as field  from 'yup';

const registerFormSchema = field.object({
  name: field
  .string()
  .required('O preenchimento do nome é obrigatório')
  .min(4, 'O campo nome precisa de no mínimo 4 caracteres'),
  nickname: field
  .string()
  .required('O preenchimento do apelido é obrigatório')
  .min(4, 'O campo apelido precisa de no mínimo 4 caracteres')
  .max(32, 'O campo apelido precisa de no máximo 32 caracteres'),
  email: field
  .string()
  .email('O campo precisa ser um email válido')
  .required('O preenchimento do email é obrigatório'),
  password: field.string().required('Você precisa fornecer ao menos uma senha'),
  passwordConfirm: field.string()
    .required('Você precisa confirmar sua senha')
     .oneOf([field.ref('password'), null], 'A confirmação de senha está incorreta')
})

export {
  registerFormSchema
}