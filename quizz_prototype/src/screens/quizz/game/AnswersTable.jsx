import React from 'react'

import { Accordion, AccordionDetails, AccordionSummary, Typography } from '@mui/material'
import { MdExpandMore } from 'react-icons/md'
import { useSelector } from 'react-redux';

const AnswersTable = () => {

    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const {correctAnswers, wrongAnswers, quizz: {withTime}} = useSelector(state => state.gameReducer)

    return (
        <>
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')} className='md:w-[50vw]'>
                <AccordionSummary
                    expandIcon={<MdExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Respostas corretas
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>
                        {correctAnswers.length} Acerto{correctAnswers.length > 1 && 's'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <table className='w-[100%]'>
                        <tbody>
                            {correctAnswers.map((correctAnswer, i) => (
                                <React.Fragment key={'wrong_answer' + i}>
                                    <tr>
                                        <th className='text-center bg-green-600 text-white' colSpan={2}>Pergunta #{i + 1}</th>
                                    </tr>
                                    <tr>
                                        <th>Pergunta</th>
                                        <td>{correctAnswer.question}</td>
                                    </tr>

                                    <tr>
                                        <th>Você Respondeu</th>
                                        <td>{correctAnswer.answer}</td>
                                    </tr>

                                    <tr>
                                        <th>Sua pontuação para esta pergunta</th>
                                        <td>
                                            {
                                                withTime ?
                                                <>
                                                <p>{correctAnswer.remainingTime} x {correctAnswer.scoreModifier} + 1 = {Math.round(correctAnswer.remainingTime*correctAnswer.scoreModifier+1)}</p> 
                                                <p>Tempo restante x Modificador de tempo + questão resolvida</p>
                                                </>
                                                :
                                                1
                                            }
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </AccordionDetails>
            </Accordion>

            <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')} className='md:w-[50vw]'>
                <AccordionSummary
                    expandIcon={<MdExpandMore />}
                    aria-controls="panel1bh-content"
                    id="panel1bh-header"
                >
                    <Typography sx={{ width: '33%', flexShrink: 0 }}>
                        Respostas incorretas
                    </Typography>

                    <Typography sx={{ color: 'text.secondary' }}>{wrongAnswers.length} Erro{wrongAnswers.length > 1 && 's'}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <table className='w-[100%]'>
                        <tbody>
                            {wrongAnswers.map((resWrong, i) => (
                                <React.Fragment key={'wrong_answer' + i}>
                                    <tr>
                                        <th className='text-center bg-red-500 text-white' colSpan={2}>Pergunta #{i + 1}</th>
                                    </tr>
                                    <tr>
                                        <th>Pergunta</th>
                                        <td>{resWrong.question}</td>
                                    </tr>

                                    <tr>
                                        <th>Você Respondeu</th>
                                        <td>{resWrong.answer}</td>
                                    </tr>
                                    <tr>
                                        <th>Resposta Correta</th>
                                        <td>{resWrong.correct_answer}</td>
                                    </tr>

                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </AccordionDetails>
            </Accordion>
        </>
    )
}

export default AnswersTable