import  * as field  from 'yup';

const updateFormSchema = field.object({
    name: field
    .string()
    .required('O preenchimento do nome é obrigatório')
    .min(4, 'O campo nome precisa de no mínimo 4 caracteres'),
    nickname: field
    .string()
    .required('O preenchimento do nome é obrigatório')
    .min(4, 'O campo nome precisa de no mínimo 4 caracteres')
    .max(32, 'O campo nome precisa de no máximo 32 caracteres'),
    email: field
    .string()
    .email('O campo precisa ser um email válido')
    .required('O preenchimento do email é obrigatório')
})

export {
    updateFormSchema
}