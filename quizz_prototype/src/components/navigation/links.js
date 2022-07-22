import {IoMdCreate, IoMdHome, IoMdList} from 'react-icons/io'
import { HiEye } from 'react-icons/hi'
import { RiEditLine } from 'react-icons/ri'
import { IoPerson, IoPodium } from 'react-icons/io5'
import { FaUserFriends } from 'react-icons/fa'

import { change as changeQuizz } from 'store/Actions/quizz.action'


const drawerLinks = [
    {
        text: 'Criar um novo quizz',
        icon: <IoMdCreate/>,
        linkTo: '/quizz/create',
        action: dispatch => dispatch(changeQuizz('clear'))
    },
    {
        text: 'Ver quizzes criados por você',
        icon: <IoMdList/>,
        linkTo: '/quizz/list',
        action: dispatch => dispatch(changeQuizz('clear'))
    },
    {
        text: 'Criar novas questões',
        icon: <RiEditLine/>,
        linkTo: '/questions/create',

    },
    {
        text: 'Ver questões que você criou',
        icon: <HiEye/>,
        linkTo: '/questions',

    },
]

const bottomNavbarLinks = [
    {
        label: 'Home',
        icon: <IoMdHome/>,
        linkTo: '/home'
    },
    {
        label: 'Ranking',
        icon: <IoPodium />,
        linkTo: '/ranking'
    },
    {
        label: 'Amigos',
        icon: <FaUserFriends/>,
        linkTo: '/friends'
    },
    {
        label: 'perfil',
        icon: <IoPerson />,
        linkTo: '/profile'
    }
]

export {
    drawerLinks,
    bottomNavbarLinks
}