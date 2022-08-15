import React from 'react'

import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';

import { FaSearch } from 'react-icons/fa';
import { height } from '@mui/system';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('button')(({ theme }) => ({
    position: 'absolute',
    right: '0',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.5rem',
    height: '100%',
    width: '35px'
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(0)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '40ch',
            '&:focus': {
                width: '35ch',
            },
        },
    },
}));

export const SearchBox = (props) => {
    const {searchHandler, ...rest} = props
    return (
        <Search>
            <StyledInputBase
              inputProps={{ 'aria-label': 'search' }}
              {...rest}
            />
            <SearchIconWrapper
                className='cursor-pointer z-50'
                onClick={() => searchHandler()}
            >
              <FaSearch className='text-white'/>
            </SearchIconWrapper>
        </Search>
    )
}
