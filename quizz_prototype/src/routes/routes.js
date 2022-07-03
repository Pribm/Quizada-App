import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import Quizz from "../components/screens/quizz/game/Quizz";
import Scores from "../components/scores/Scores";
import Login from "../components/Login/Login";
import ProtectedRoutes from "./protected.routes";
import Home from "../components/home/Home";
import CreateQuizz from "../components/screens/quizz/create/CreateQuizzHub";


  const routes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/">
              <Route index element={<Login/>}/>
                <Route element={<ProtectedRoutes/>}>
                  <Route path="home" element={<Home/>}/>
                  
                  <Route path='quizz'>
                    <Route index element={<Quizz/>}/>
                    <Route path='create' element={<CreateQuizz/>}/>
                    <Route path='scores' element={<Scores/>}/>
                  </Route>
                
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )

  export default routes