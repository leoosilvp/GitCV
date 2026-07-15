import './css/index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Contribute from './routes/Contribute';
import Login from './routes/Login';
import ProtectedRoute from './routes/ProtectedRoute';
import Download from './routes/Download';
import Contribution from './components/download/Contribution';
import Snapshot from './routes/Snapshot';
import { useIsMobile } from './hooks/useIsMobile';
import { MobileBlock } from './components/MobileBlock';

function App() {

  const isMobile = useIsMobile();

  if (isMobile) {
    return <MobileBlock />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/' element={<Navigate to='/home' />} />
          <Route path='/home' element={<Home />} />
          <Route path="/snapshot" element={<Snapshot />} />
          <Route path="/download" element={<Download />}>
            <Route index element={<Navigate to="/home" />} />
            <Route path="contributions" element={<Contribution />} />
          </Route>
          <Route path='/contribute' element={<Contribute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
