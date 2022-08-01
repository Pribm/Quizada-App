import {
    BrowserRouter,
    Routes,
    Route,
  } from "react-router-dom";
import Quizz from "../components/screens/quizz/game/Quizz";
import Scores from "../components/screens/scores/Scores";
import Login from "../components/screens/Login/Login";
import ProtectedRoutes from "./protected.routes";
import Home from "../components/screens/home/Home";
import CreateQuizz from "../components/screens/quizz/create/CreateQuizzHub";
import Update from "components/screens/profile/Update";
import ListQuestions from "components/screens/Questions/index/ListQuestions";
import UploadSuccess from "components/screens/success/UploadSuccess";
import ListQuizz from "components/screens/quizz/index/ListQuizz";
import Register from "components/screens/Login/Register";
import CreateQuestions from "components/screens/Questions/create/CreateQuestions";
import { Forgot } from "components/screens/Login/ForgotPassword";
import { PasswordReset } from "components/screens/Login/PasswordReset";
import Friends from "components/screens/friends/Friends";
import Finished from "components/screens/quizz/finished/Finished";
import Donate from "components/screens/donate/Donate";
import Multiplayer from "components/screens/multiplayer/Multiplayer";
import PublicQuizzList from "components/screens/quizz/public_quizz/PublicQuizzList";


  const routes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" >
              <Route index element={<Login/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path="forgot-password" element={<Forgot/>}/>
              <Route path="reset/:token" element={<PasswordReset/>}/>

                <Route element={<ProtectedRoutes/>}>
                  <Route path="home" element={<Home/>}/>
                  <Route path="multiplayer" element={<Multiplayer/>}/>
                  <Route path="donate" element={<Donate/>}/>
                  <Route path="friends" element={<Friends/>}/>
                  
                  <Route path='quizz'>
                    <Route index element={<Quizz/>}/>
                    <Route path='list' element={<ListQuizz/>}/>
                    <Route path='create' element={<CreateQuizz/>}/>
                    <Route path='public' element={<PublicQuizzList/>}/>
                    <Route path='finished' element={<Finished/>}/>
                  </Route>

                  <Route path='questions'>
                    <Route index element={<ListQuestions/>}/>
                    <Route path='create' element={<CreateQuestions/>}/>
                  </Route>

                  <Route path='profile'>
                    <Route index element={<Update/>}/>
                  </Route>

                  <Route path='success'>
                    <Route path="upload" element={<UploadSuccess/>}/>
                  </Route>
                
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )

  export default routes