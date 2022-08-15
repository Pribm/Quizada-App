import React from 'react'
import { Loading } from './components/loading/Loading'
import Alert from './components/alert/Alert'
import Routes from './routes/routes'
import { Confirm } from 'components/confirm/Confirm'

const App = () => {

    const screen = React.useRef(null)

    return (
        <div ref={screen}>
            <Confirm />
            <Alert/>
            <Loading/>
            <Routes/>
        </div>
    )
}

export default App