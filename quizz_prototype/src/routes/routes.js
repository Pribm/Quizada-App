import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
  } from "react-router-dom";
import Quizz from "../screens/quizz/game/Quizz";
import Login from "../screens/Login/Login";
import ProtectedRoutes from "./protected.routes";
import Home from "../screens/home/Home";
import CreateQuizz from "../screens/quizz/create/CreateQuizzHub";
import Update from "screens/profile/Update";
import ListQuestions from "screens/Questions/index/ListQuestions";
import UploadSuccess from "screens/success/UploadSuccess";
import ListQuizz from "screens/quizz/index/ListQuizz";
import Register from "screens/Login/Register";
import CreateQuestions from "screens/Questions/create/CreateQuestions";
import { Forgot } from "screens/Login/ForgotPassword";
import { PasswordReset } from "screens/Login/PasswordReset";
import Friends from "screens/friends/Friends";
import Finished from "screens/quizz/finished/Finished";
import Donate from "screens/donate/Donate";
import Multiplayer from "screens/multiplayer/Multiplayer";
import PublicQuizzList from "screens/quizz/public_quizz/PublicQuizzList";
import AdminRoutes from "./admin.routes";
import PanelAdmin from "screens/admin/PanelAdmin";
import Categories from "screens/categories/Categories";


  const routes = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" >
              <Route index element={<Login/>}/>
              <Route path="register" element={<Register/>}/>
              <Route path="forgot-password" element={<Forgot/>}/>
              <Route path="reset/:token" element={<PasswordReset/>}/>

                <Route element={<ProtectedRoutes/>}>
                  <Route path="*" element={<Navigate to="/home" />} />
                  <Route path="home" element={<Home/>}/>
                  <Route path="multiplayer" element={<Multiplayer/>}/>
                  <Route path="donate" element={<Donate/>}/>
                  <Route path="friends" element={<Friends/>}/>
                  <Route path="categories" element={<Categories/>}/>
                  
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
                  

                  <Route element={<AdminRoutes/>}>
                    <Route path="/panel-admin" element={<PanelAdmin/>}/>
                  </Route>
                
                </Route>
            </Route>
        </Routes>
    </BrowserRouter>
  )

  export default routes