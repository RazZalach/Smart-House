import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Title.css';
import logo from '../assets/logo.png';

export default function Title() {
  return (
    <div>
      <Link to="/" className='head'>
        <h1 >
          <img src={logo} height={64} width={64} alt="Logo" /> Smart-House
        </h1>
      </Link>
    </div>
  );
}
