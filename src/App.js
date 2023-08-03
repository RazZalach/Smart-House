import './App.css';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AddRooms from './components/AddRooms';
import Room from './components/Room';
import Title from './components/Title';

function App() {
  return (
    <div>
      <Router>
      <Title />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/addroom" element={<AddRooms />} />
          <Route path='/room/:roomId' element={<Room />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
