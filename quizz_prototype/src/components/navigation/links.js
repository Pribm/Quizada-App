import {IoMdCreate, IoMdHome, IoMdList} from 'react-icons/io'
import { HiEye } from 'react-icons/hi'
import { RiEditLine } from 'react-icons/ri'
import { IoPerson } from 'react-icons/io5'
import { FaUserFriends } from 'react-icons/fa'
import { BsCardChecklist } from 'react-icons/bs'
import { GrConfigure } from 'react-icons/gr'

import {AwardMedal, Tournment, PlayAlone} from 'assets'

import { change as changeQuizz } from 'store/Actions/quizz.action'
import { MdPendingActions, MdPublic } from 'react-icons/md'
import { BiCategory } from 'react-icons/bi'

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
        title: 'Ranking',
        subtitle: 'Veja Sua Colocação',
        image: AwardMedal,
        loop: true,
        link: '/quizz/finished',
        initialSegment: [45,100]
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
        text: 'Quizzes pendentes',
        icon: <MdPendingActions/>,
        linkTo: '/multiplayer?show_pending=true'
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
        setDivider: true,
    },
    {
        text: 'Categorias Cadastradas',
        icon: <BiCategory/>,
        linkTo: '/categories',
        setDivider: true,
    },
    {
        text: 'Painel Administrativo',
        icon: <GrConfigure/>,
        linkTo: '/panel-admin',
        user_role: 'admin'
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