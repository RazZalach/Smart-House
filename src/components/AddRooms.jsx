import React, { useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/init-firebase';
import { ChromePicker } from 'react-color';
import '../css/AddRooms.css'

export default function AddRooms() {
  const [roomname, setRoomName] = useState('');
  const [roomcolor, setRoomColor] = useState('#ffffff'); 
  const [showColorPicker, setShowColorPicker] = useState(false); 
  const [selectedRoomType, setSelectedRoomType] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (roomname === '' || selectedRoomType === '') {
      alert("You Must Field All Inputs!!")
      return;
    }

    const roomsCollref = collection(db, 'rooms');
    addDoc(roomsCollref, { selectedRoomType, roomname, roomcolor,products:[] })
      .then(res => {
        console.log(res);
        alert('Room added successfully!');
        // Navigate back to HomePage after adding a new room
        navigate('/');
      })
      .catch(err => {
        console.log(err.message);
    });
  }
  const handleColorChange = (newColor) => {
    setRoomColor(newColor.hex);
  };

  const handleColorInputClick = () => {
    setShowColorPicker(!showColorPicker);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
  };
  return (
    <div className="form-container">
    <div className="form-wrapper">
      <form onSubmit={handleSubmit}>
        <select value={selectedRoomType} onChange={(e) => setSelectedRoomType(e.target.value)}>
          <option value="">בחר חדר</option>
          <option value="bathroom">חדר רחצה</option>
          <option value="bedroom">חדר שינה</option>
          <option value="kitchen">מטבח</option>
        </select>
        <label htmlFor="name"> שם החדר</label>
        <input
          type="text"
          id="name"
          value={roomname}
          onChange={e => setRoomName(e.target.value)}
        />
        <label htmlFor="color">צבע החדר</label>
        <div>
            <input
              type="text"
              id="color"
              value={roomcolor}
              onClick={handleColorInputClick} // Show the color picker on click
              readOnly // Set as readOnly so the user cannot directly input the color
            />
            {showColorPicker && (
              <ChromePicker
                color={roomcolor}
                onChange={handleColorChange}
                onClose={handleColorPickerClose}
              />
            )}
          </div>
        <button type='submit'> הוסף חדר</button>
      </form>
    </div>
  </div>
  );
}
