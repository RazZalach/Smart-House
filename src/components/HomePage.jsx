import React from 'react';
import { Link } from 'react-router-dom';
import '../css/HomePage.css';
import Rooms from './Rooms';

export default function HomePage() {
  return (
    <div>
        
        <Rooms />
        <div className='container'>
        {/* Link to navigate to AddRoom */}
        <Link className='gg-add' to="/addroom"></Link>
        </div>
    </div>
  );
}
