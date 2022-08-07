import { Avatar, Button} from '@mui/material'
import React from 'react'
import { removeAdmInvitation, sendAdmInvitation } from 'store/Actions/user.action'
import { getUserThumbnail } from 'utils/getThumbnails'

const FriendCard = ({ props }) => {

    return (
        <div className='bg-white shadow-md rounded-md h-[100px] flex items-center p-2 mb-4'>
            <Avatar src={props.avatar ? getUserThumbnail(props.avatar, props.id) : ''} alt={props.name} />
            <div className='px-2 text-start flex-1 text-sm'>
                <h1 className='font-bold text-blue-500'>{props.name}</h1>
                <h2 className='text-orange-500'>{props.nickname}</h2>
                <h3>{props.email}</h3>
            </div>

            <Button
            fullWidth
            disabled={props.adm_invitation_from.length > 0}
            color={`${props.role.role !== 'user' ? 'error' : 'primary'}`}
            onClick={() => {
                if(props.role.role === 'user'){
                    props.dispatch(sendAdmInvitation(props.id))
                }else{
                    props.dispatch(removeAdmInvitation(props.id))
                }
            }}
            >
                {props.role.role !== 'user' ?
                'Remover Adm'
                :
                props.adm_invitation_from.length <= 0 ?
                'Convidar para Adm'
                :
                'Usuário Convidado'
                }   
            </Button>
           {console.log(props)}
        </div>

    )
}

export default FriendCard