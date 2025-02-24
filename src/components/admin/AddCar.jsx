import React, { useState, useEffect } from 'react';
import { TextField, MenuItem, Select, Box, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // for navigation, if using React Router


export default function AddCar() {
  // Initialize state
  const [formData, setFormData] = useState({
    Model: "", // Ensure the property name is "Model"
    YearProduction: "",
    CategoryId: "",
    DailyPrice: "",
    PlateNum: "", // Ensure PlateNum is treated as a string
    Photo: null,
  });

  const [categories, setCategories] = useState([]);
  const [message, setMessage] = useState(""); // To show messages (success/error)

  // Fetch available categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get("https://localhost:7017/api/Categories/getAll");
      if (response.data && response.data.length > 0) {
        setCategories(response.data); // Update categories state
      } else {
        setMessage("No categories available.");
      }
      console.log(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setMessage("Failed to fetch categories.");
    }
  };

  useEffect(() => {
    fetchCategories(); // Fetch categories when the component is mounted
  }, []);

  // Handle form submission
  const handleCarAdd = async () => {
    // Check if all required fields are filled
    if (!formData.Model || !formData.YearProduction || !formData.DailyPrice || !formData.CategoryId || !formData.PlateNum) {
      setMessage("Please fill in all fields.");
      return;
    }

    // Validate Plate Number (must be exactly 7 characters)
    if (formData.PlateNum.length !== 7) {
      setMessage("Plate number must have exactly 7 characters.");
      return;
    }

    const reservationData = new FormData();
    reservationData.append("Model", formData.Model);
    reservationData.append("YearProduction", formData.YearProduction);
    reservationData.append("DailyPrice", formData.DailyPrice);
    reservationData.append("CategoryId", formData.CategoryId);
    reservationData.append("PlateNum", formData.PlateNum);
    if (formData.Photo) reservationData.append("Photo", formData.Photo);

    try {
      const response = await fetch("https://localhost:7017/api/Cars/add", {
        method: "POST",
        body: reservationData,
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Failed to create a new car.");
      }

      const result = await response.json();
      setMessage(result.Message || "Car created successfully.");
    } catch (error) {
      console.error("Error:", error);
      setMessage(error.message || "Error while creating the vehicle.");
    }
  };

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      Photo: e.target.files[0],
    }));
  };

  const navigate = useNavigate()
  const handlePreviousPageBtn = (link) => {
   navigate(link) // Navigate to the provided link (change link dynamically)
  };


  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center', // Horizontal centering
        alignItems: 'center',      // Vertical centering
        height: '100vh',           // Full viewport height
        backgroundColor: '#f5f5f5', // Optional: background color for the page
      }}
    >
      <form style={{ width: '400px' }}>
        <TextField
          label="Car Model" // Updated to be clear about the car model
          name="Model" // Make sure it's named "Model"
          value={formData.Model}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Year of Production"
          name="YearProduction"
          value={formData.YearProduction}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Daily Price"
          name="DailyPrice"
          value={formData.DailyPrice}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <TextField
          label="Plate Number"
          name="PlateNum"
          value={formData.PlateNum}
          onChange={handleInputChange}
          variant="outlined"
          fullWidth
          margin="normal"
        />
        <Select
          label="Category"
          name="CategoryId"
          value={formData.CategoryId}
          onChange={handleInputChange}
          fullWidth
          margin="none"
        >
          
          {categories.map((category) => (
            <MenuItem key={category.categoryId} value={category.categoryId}>
              {category.categoryName}
            </MenuItem>
          ))}
        </Select>
        <TextField
          type="file"
          variant="outlined"
          fullWidth
          margin="normal"
          onChange={handleFileChange}
        />
   <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: '80px'}}>
  <Button
    onClick={() =>handlePreviousPageBtn('/admin')}
    className="btn btn-primary rounded-pill"
    sx={{ marginTop: 2 }} // Optional margin-top for the first button
  >
    Back
  </Button>
  <Button
    onClick={() => handleCarAdd()}
    className="btn btn-primary rounded-pill"
    sx={{ backgroundColor:'red', marginTop: 2 }} // Optional margin-top for the second button
  >
    Add new Car
  </Button>
</Box>
        
        {message && <Box sx={{ textAlign: 'center', marginTop: 2 }}>{message}</Box>}
      </form>
    </Box>
  );
}
