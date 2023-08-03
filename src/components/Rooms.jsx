import React, { useEffect, useState } from 'react'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/init-firebase'
import '../css/rooms.css'
import { Link } from 'react-router-dom';
import bathRoomIcon from '../assets/bathroom.png'
import bedRoomIcon from '../assets/bedroom.png'
import kitchenIcon from '../assets/kitchen.png'
import trashIcon from '../assets/trash.png'

export default function Rooms() {
    const [rooms, setRooms] = useState([])
   
    useEffect(() => {
        getRooms()
    }, []) 
    function getRooms() {
        const roomsCollRef = collection(db, 'rooms')
        getDocs(roomsCollRef).then((querySnapshot) => {
            const roomsData = querySnapshot.docs.map(doc => ({
                data: doc.data(),
                id: doc.id
            }))
            setRooms(roomsData)
        }).catch(err => {
            console.log(err.message)
        })
    }
    function isValidColor(color) {
        const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if(hexColorRegex.test(color)){
            return  color; 
        } else {
            return '#ff0450'
        }
    }
    function getRoomIcon(selectedRoomType) {
      switch (selectedRoomType) {
        case 'bathroom':
          return bathRoomIcon;
        case 'bedroom':
          return bedRoomIcon;
        case 'kitchen':
          return kitchenIcon;
        default:
          return null;
      }
    }
    function getGlobalColor(backgroundColor){
      if(backgroundColor === '#FFFFFF' ){
        return '#000000';
      }
      else {
        return '#FFFFFF';
      }
    }
    function deleteRoom(id) {
      // Remove the room from the local state
      const updatedRooms = rooms.filter((room) => room.id !== id);
      setRooms(updatedRooms);
  
      // Remove the room from the Firebase Firestore database
      const roomDocRef = doc(db, 'rooms', id);
      deleteDoc(roomDocRef)
        .then(() => console.log('Room deleted successfully from the database.'))
        .catch((err) => console.log('Error deleting room from the database:', err.message));
    }
    return (
        <div className='allrooms'>
        {rooms.map(room => ( 
          
          <div key={room.id} className='room'>
            <button  className='delbtn' onClick={() => deleteRoom(room.id)} style={{maxWidth:'30px',maxHeight:'30px'}}>
              <img  height={25} width={25} src={trashIcon} alt="Delete"  />
            </button>
            <Link to={`/room/${room.id}`} style={{ textDecoration: 'none' }}>
              <div className='square' style={{ backgroundColor: isValidColor(room.data.roomcolor) }}>
                <div className='nameroom'>
                  {room.data.roomname}`s Room
                </div>
                
                <div className='content'>
                  

                  <img 
                  height={60} width={60}
                  src={getRoomIcon(room.data.selectedRoomType)}
                  alt={room.data.selectedRoomType}
                  style={{color:getGlobalColor(room.data.roomcolor)}}
                  
                  />
                  
                  
                </div>
               
              </div>
            </Link>
          </div>
        ))}
      </div>
    )
}
