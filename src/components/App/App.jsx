import { Routes, Route } from 'react-router-dom'; import Navigation from '../Navigation/Navigation';

import HomePage from '../../pages/HomePage.jsx';
import LoginForm from '../../forms/LoginForm.jsx';
import SignupForm from '../../forms/SignupForm.jsx';
import PageNotFound from '../../pages/PageNotFound.jsx';
import Profile from '../../pages/Profile.jsx';
import ProtectedRoute from '../ProtectedRoute.jsx';

import './App.css';

export default function App() {

  return (
    <div className="App">
      <h1>PlateScout</h1>
      <Navigation />
      <Routes>     
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path='/signup' element={<SignupForm />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<PageNotFound/>}/>
      </Routes>
    </div>
  );
}
