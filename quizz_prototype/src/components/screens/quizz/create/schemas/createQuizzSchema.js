import * as yup from "yup"

const createQuizzSchema = yup.object().shape({
    category: yup.string().min(3, 'Você precisa inserir pelo menos 3 caracteres neste campo').required("Você precisa inserir uma categoria antes de criar um novo quizz"),
    title: yup.string().min(3, 'Você precisa inserir pelo menos 3 caracteres neste campo').required("Você precisa fornecer um titulo para este quizz"),
    description: yup.string().max(140, "Você precisa fornecer uma descrição mais curta do seu quizz")
})

export {createQuizzSchema}