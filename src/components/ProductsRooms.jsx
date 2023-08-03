import React, { useState } from 'react';


export default function ProductsRooms({ onProductAdded }) {
  const [selectedProduct, setselectedProduct] = useState('');

  function addProd(e) {
    e.preventDefault();
    if (selectedProduct === '') {
      alert('Please choose a product.');
      return;
    }
    onProductAdded(selectedProduct);
  }

  return (
    <div className="productsRooms" >
      <form onSubmit={addProd}>
        <select
          value={selectedProduct}
          onChange={(e) => setselectedProduct(e.target.value)}
          className="productSelect"
        >
          <option value="">Choose Product</option>
          <option value="Lamp">
            Lamp &nbsp; 
          </option>
          <option value="AirCon">
            Air-Conditioner &nbsp; 
          </option>
          <option value="Boiler">
            Boiler &nbsp;
          </option>
          <option value="Stereo">
            Stereo-System &nbsp;
          </option>
        </select>
        <button type="submit" className="addButton">
          Add Product
        </button>
      </form>
    </div>
  );
}
