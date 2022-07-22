import * as field from 'yup'

export const questionFormSchema = field.object({
    question: field.string().required('O Campo de perguntas deve ser preenchido').min(10,'O campo de perguntas precisa de no mínimo 10 caracteres'),
    correct_answer: field.string().required('Este campo deve ser preenchido'),
    answer_2: field.string().required('Este campo deve ser preenchido'),
    answer_3: field.string().required('Este campo deve ser preenchido'),
    answer_4: field.string().required('Este campo deve ser preenchido'),
    answer_5 : field.string().required('Este campo deve ser preenchido'),
})