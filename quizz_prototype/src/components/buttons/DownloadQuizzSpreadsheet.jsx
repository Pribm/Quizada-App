import React from 'react'

import { Button } from '@mui/material'
import { HttpAuth } from 'config/Http';


const DownloadQuizzSpreadsheet = ({fileName, quizzId}) => {
  return (
    <Button className='pl-2 pt-4' size='small' onClick={() => HttpAuth.get('quizz/export/'+quizzId, {
        responseType: 'blob'
    }).then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `${fileName}.xlsx`); 
        document.body.appendChild(link);
        document.body.removeChild(link)
    link.click();
    })}>
        Exportar Quizz
    </Button>           
  )
}

export default DownloadQuizzSpreadsheet