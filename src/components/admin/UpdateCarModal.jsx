import React, { useState, useEffect } from 'react';
import { Modal, Box, Button, TextField, Select, MenuItem } from '@mui/material';
import axios from 'axios';

// Modal styling
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 3, // Padding added here to avoid inputs sticking to edges
};

export default function UpdateCarModal({ car, open, handleClose, onCarUpdated }) {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    Model: '',
    YearProduction: '',
    DailyPrice: '',
    PlateNum: '',
    CategoryId: '',
    Photo: null,
  });
  const [message, setMessage] = useState('');

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get('https://localhost:7017/api/Categories/getAll');
      if (response.data) {
        setCategories(response.data);
      } else {
        setMessage('No categories available.');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setMessage('Failed to fetch categories.');
    }
  };

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  // Update form data when the car prop changes
  useEffect(() => {
    if (car) {
      setFormData({
        Model: car.model || '',
        YearProduction: car.yearProduction || '',
        DailyPrice: car.dailyPrice || '',
        PlateNum: car.plateNum || '',
        CategoryId: car.categoryId || '',
        Photo: null, // Reset photo field
      });
    }
  }, [car]);

  // Handle form input changes
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

  // Update car
  const handleCarUpdate = async () => {
    if (!formData.Model || !formData.YearProduction || !formData.DailyPrice || !formData.CategoryId || !formData.PlateNum) {
      setMessage('Please fill in all fields.');
      return;
    }

    if (formData.PlateNum.length !== 7) {
      setMessage('Plate number must have exactly 7 characters.');
      return;
    }

    try {
      const reservationData = new FormData();
      reservationData.append('Model', formData.Model);
      reservationData.append('YearProduction', formData.YearProduction);
      reservationData.append('DailyPrice', formData.DailyPrice);
      reservationData.append('CategoryId', formData.CategoryId);
      reservationData.append('PlateNum', formData.PlateNum);
      if (formData.Photo) reservationData.append('Photo', formData.Photo);

      // Send PUT request to update the car
      const response = await axios.put(
        `https://localhost:7017/api/Cars/update/${car.id}`,
        reservationData, 
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      console.log('Car updated successfully', response.data);

      onCarUpdated();  // Refresh the car list after successful update
      handleClose();  // Close the modal
    } catch (error) {
      console.error('Error updating car:', error);
      setMessage('Failed to update car.');
    }
  };

  if (!car) return null;

  return (
    <Modal open={open} onClose={handleClose} aria-labelledby="modal-title" aria-describedby="modal-description">
      <Box sx={modalStyle}>
        <form style={{ width: '100%' }}>
          <TextField
            label="Model"
            name="Model"
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
            margin="normal"
          >
            {categories.map((category) => (
              <MenuItem key={category.categoryId} value={category.categoryId}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
          <TextField type="file" variant="outlined" fullWidth margin="normal" onChange={handleFileChange} />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 2 }}>
            <Button onClick={handleClose} className="btn btn-primary rounded-pill" sx={{ marginTop: 2 }}>
              Cancel
            </Button>
            <Button onClick={handleCarUpdate} className="btn btn-primary rounded-pill" sx={{ backgroundColor: '#1F2E4E', marginTop: 2 }}>
              Save Changes
            </Button>
          </Box>

          {message && <Box sx={{ textAlign: 'center', marginTop: 2 }}>{message}</Box>}
        </form>
      </Box>
    </Modal>
  );
}
