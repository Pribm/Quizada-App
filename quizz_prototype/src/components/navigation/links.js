import {IoMdCreate, IoMdHome, IoMdList} from 'react-icons/io'
import { HiEye } from 'react-icons/hi'
import { RiEditLine } from 'react-icons/ri'
import { IoPerson, IoPodium } from 'react-icons/io5'
import { FaUserFriends } from 'react-icons/fa'
import { BsCardChecklist } from 'react-icons/bs'

import {Battle, Endurance, Tournment, PlayAlone} from 'assets'

import { change as changeQuizz } from 'store/Actions/quizz.action'
import { MdPublic } from 'react-icons/md'

const cards = [
    {
        title: 'Individual',
        subtitle: 'Jogue Sozinho',
        image: PlayAlone,
        link: '/quizz'
    },
    {
        title: 'Desafio',
        subtitle: 'Jogue contra outras Pessoas',
        image: Tournment,
        link: '/multiplayer'
    },
    {
        title: 'Resistência',
        subtitle: 'Mais perguntas em menos tempo',
        image: Endurance,
        loop: true,
        link: '/ranking'
    },
]

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
        text: 'Quizzes públicos',
        icon: <MdPublic/>,
        linkTo: '/quizz/public'
    },
    {
        text: 'Ranking dos quizzes concluídos',
        icon: <BsCardChecklist/>,
        linkTo: '/quizz/finished',
        setDivider: true
    },
    {
        text: 'Criar novas questões',
        icon: <RiEditLine/>,
        linkTo: '/questions/create?onlyquestions=true',

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
    // {
    //     label: 'Ranking',
    //     icon: <IoPodium />,
    //     linkTo: '/ranking'
    // },
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
    bottomNavbarLinks,
    cards
}