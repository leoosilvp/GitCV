import './css/index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Contribute from './routes/Contribute';
import Login from './routes/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Download from './routes/Download';
import Contribution from './components/download/Contribution';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path='/contribute' element={<Contribute />} />
          <Route path="/download" element={<Download />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="contributions" element={<Contribution />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
