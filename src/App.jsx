import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './layout/Navbar'
import SignUp from './screens/Sign/SignUp'
import Login from './screens/Sign/Login'
import ForgotPassword from "./screens/Sign/Login/ForgotPassword";
import SectionContainer from './layout/Home/SectionContainer'
import './App.css'
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentUser } from '../store/User/UserAction';
import Loading from './components/Loading'
import DashboardCards from './layout/Section'
import UploadMaterial from './layout/Section/Upload'
import ChatComponent from './layout/Section/Chat'
import FlashCard from './layout/Section/FlashCard'
import Profile from './screens/Home/Profile';
import About from './screens/Home/About';

function App() {
  const dispatch = useDispatch();
  const isAuthChecked = useSelector(state => state.user.authChecked);
  const location = useLocation();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  if (!isAuthChecked) {
    return <Loading/>;
  }

  return (
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<SectionContainer />} />
          <Route path="/about" element={<About />} />
          <Route path='/signup'  element={<SignUp/>}/>
          <Route path='/login' element={<Login/>} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/section/:sectionId' element={<DashboardCards/>} />
          <Route path='/section/:sectionId/upload' element={<UploadMaterial/>} />
          <Route path='/section/:sectionId/chat' element={<ChatComponent />} />
          <Route path='/section/:sectionId/flashcard' element={<FlashCard/>} />
        </Routes>
      </main>
    </div>
  )
}

export default App
