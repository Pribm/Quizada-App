import React from 'react'
import { Loading } from './components/loading/Loading'
import Alert from './components/alert/Alert'
import Routes from './routes/routes'

const App = () => {

    const screen = React.useRef(null)

//    React.useEffect(() => {
//     if(screen.current.clientWidth < 768){
//         screen.current.addEventListener('click', function() {
//             screen.current.requestFullscreen();
//         }, false)
//     }
//    }, [])

    return (
        <div ref={screen}>
            <Alert/>
            <Loading/>
            <Routes/>
        </div>
    )
}

export default App