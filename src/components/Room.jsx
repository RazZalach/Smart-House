import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import lampIcon from '../assets/lamp.png';
import airConditionerIcon from '../assets/air-conditioner.png';
import boilerIcon from '../assets/boiler.png';
import stereoIcon from '../assets/stereo.png';
import { db } from '../lib/init-firebase';
import ProductsRooms from './ProductsRooms';
import bathRoomIcon from '../assets/bathroom.png'
import bedRoomIcon from '../assets/bedroom.png'
import kitchenIcon from '../assets/kitchen.png'
import '../css/Room.css'
import trashIcon from '../assets/trash.png'

export default function Room() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [addFlag, setAddFlag] = useState(false);

  useEffect(() => {
    fetchRoomData();
  }, []); 

  async function fetchRoomData() {
    try {  
      const roomDocRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomDocRef);
      if (roomSnapshot.exists()) {
        setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
      } else {
        setRoom(null);
      }
    } catch (error) {
      console.error('Error fetching room data:', error);
      setRoom(null);
    }
  }

  function handleAddProd() {
    setAddFlag(!addFlag);
  }

  async function handleProductAdded(selectedProduct) {
    try {
      const roomDocRef = doc(db, 'rooms', roomId);
      const roomSnapshot = await getDoc(roomDocRef);
      const roomData = roomSnapshot.data();
  
      // Validation 1: Check if there is already a stereo system in the room
      if (selectedProduct === 'Stereo' && roomData.products.some(product => product.selectedProduct === 'Stereo')) {
        alert('There can be only 1 stereo system in the room.');
        return;
      }
  
      // Validation 2: Check if the room type is bathroom when adding a builder
      if (selectedProduct === 'Boiler' && roomData.selectedRoomType !== 'bathroom') {
        alert('Builders can be added only if the room type is bathroom.');
        return;
      }
  
      // Validation 3: Check if the maximum limit of products (5) has been reached
      if (roomData.products.length >= 5) {
        alert('Maximum limit of products (5) reached for this room.');
        return;
      }
  
      setRoom((prevRoom) => {
        if (prevRoom) {
          return {
            ...prevRoom,
            products: [...prevRoom.products, { selectedProduct: selectedProduct, active: false }],
          };
        }
        return null;
      });
  
      await updateDoc(roomDocRef, {
        products: arrayUnion({ selectedProduct: selectedProduct, active: false }),
      });
  
      setAddFlag(false);
    } catch (error) {
      console.error('Error adding product to room:', error);
    }
  }



  async function handleActivated(productIndex) {
    if (room && room.products) {
      const updatedProducts = [...room.products];
      updatedProducts[productIndex].active = !updatedProducts[productIndex].active;

      try {
        setRoom((prevRoom) => ({
          ...prevRoom,
          products: updatedProducts,
        }));

        const roomDocRef = doc(db, 'rooms', roomId);
        await updateDoc(roomDocRef, {
          products: updatedProducts,
        });
      } catch (error) {
        console.error('Error updating product activation:', error);
      }
    }
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

async function handleProductDeleted(productIndex) {
  if (room && room.products) {
    const updatedProducts = room.products.filter((_, index) => index !== productIndex);
    try {
      setRoom((prevRoom) => ({
        ...prevRoom,
        products: updatedProducts,
      }));

      const roomDocRef = doc(db, 'rooms', roomId);
      await updateDoc(roomDocRef, {
        products: updatedProducts,
      });
    } catch (error) {
      console.error('Error deleting product from room:', error);
    }
  }
}


  return (
    <div>
    {room ? (
      <div className='container' style={{ backgroundColor: isValidColor( room.roomcolor) }}>
        <div>
          <h1> {room.roomname}'s Room</h1> <br />
           <img height={120} width={120} src={getRoomIcon(room.selectedRoomType)} alt={room.selectedRoomType} />  <br />
        </div>
        <ul className="product-list">
          {room.products.map((product, index) => (
            <div className='cubes'>
              <li
                key={index}
                onClick={() => handleActivated(index)}
                className={`product-item ${product.active ? 'active' : 'inactive'}`}
              >
                {product.selectedProduct} 
                {(() => {
                  switch (product.selectedProduct) {
                    case 'Lamp':
                      return <img src={lampIcon} height={43} width={43} alt="Lamp" />;
                    case 'AirCon':
                      return <img src={airConditionerIcon} height={43} width={43} alt="Air Conditioner" />;
                    case 'Boiler':
                      return <img src={boilerIcon} height={43} width={43} alt="Boiler" />;
                    case 'Stereo':
                      return <img src={stereoIcon} height={43} width={43} alt="Stereo" />;
                    default:
                      return null;
                  }
                })()}
                <br />
                {/* {product.active ? 'Active' : 'Inactive'}
                <br /> */}
              </li>
              <button className='delbtn'   onClick={() => handleProductDeleted(index)} >
                  <img  src={trashIcon} width={50} height={50} alt="Delete" />
              </button>
            </div>
          ))}
        </ul>
        <div className='addprod'>       
          {addFlag ? (
            <ProductsRooms onProductAdded={handleProductAdded} />
          ) : (
            <button className='addbtn' onClick={handleAddProd}>הוסף מוצר</button>
          )}
        </div>
      </div>
    ) : (
      <p>Room not found</p>
    )}
  </div>
  );
}
