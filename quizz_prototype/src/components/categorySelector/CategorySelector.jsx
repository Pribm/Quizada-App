import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { change, index } from 'store/Actions/categories.action'

const CategorySelector = (props) => {


    const {changeHandler, ...other} = props

    const dispatch = useDispatch()
    const { category, categories } = useSelector(state => state.categoriesReducer)

    useEffect(() => {
        dispatch(index(props.categorySelectorQuery))

        return () => dispatch(change('clear'))
    }, [])

    return (
        <FormControl fullWidth size={props.size ? props.size : 'small'}>
        <Select
          value={props.category || 0}
          placeholder="Categoria"
          className={`${other.className}`}
          inputProps={{className: `bg-white text-slate-500`}}
          onChange={e => {
            dispatch(change({ id: e.target.value }))
            if(changeHandler){
                changeHandler(e)
            }
        }}
        >

                <MenuItem value={0}>Selecione uma categoria</MenuItem>
                {
                    categories.data.map((c, index) => (
                        <MenuItem key={index} value={c.id}>{c.name}</MenuItem>
                    ))
                }
            </Select>
        </FormControl>
    )
}

export default CategorySelector