import './css/index.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './routes/Home';
import Contribute from './routes/Contribute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/home' />} />
        <Route path='/home' element={<Home />} />
        <Route path='/contribute' element={<Contribute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
