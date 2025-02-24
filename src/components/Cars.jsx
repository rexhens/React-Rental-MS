import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from '../css/style.css'
import bootstrap from '../css/bootstrap.min.css'
import $ from "jquery";

// Pagination and search functionality added to Categories component
const Cars = () => {
  const [cars, setCars] = useState([]);
  const [message, setMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [filteredCars, setFilteredCars] = useState([]); // State for filtered cars
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [carsPerPage] = useState(6); // Number of cars to show per page

 const fetchCars = async () => {
   const apiKey = localStorage.getItem("apiKey"); // Retrieve the API key from localStorage
   if (!apiKey) {
     throw new Error("API key is not available in localStorage.");
   }
   try {
     const response = await fetch("https://localhost:7017/api/Cars/get_cars", {
       method: "GET", // Change to POST
       headers: {
         "Authorization": `Bearer ${apiKey}`,
       },
     });

     if (response.ok) { // Check if the response is successful (status 200-299)
       const data = await response.json(); // Parse the JSON response
       
       if (data && Array.isArray(data) && data.length > 0) {
        //console.log(data) 
        setCars(data); // Set cars if data is an array and has elements
       } else {
         setMessage("No cars available."); // Handle if the array is empty
       }
     } else {
       window.location.href = "/auth"
     }
   } catch (error) {
     console.error("Error fetching cars:", error);
     setMessage("Failed to fetch cars.");
     window.location.href = "/auth"
   }
};

  // Search functionality
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filter cars based on search query
  useEffect(() => {
    const filtered = cars.filter((car) =>
      car.model.toLowerCase().includes(searchQuery.toLowerCase()) || 
      car.category.categoryName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCars(filtered); // Update filtered cars based on search query
    setCurrentPage(1); // Reset to first page when search query changes
  }, [searchQuery, cars]);

  // Pagination logic
  const indexOfLastCar = currentPage * carsPerPage;
  const indexOfFirstCar = indexOfLastCar - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirstCar, indexOfLastCar);

  // Change page handler
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchCars(); // Fetch cars on component mount
  }, []);

  return (
    <section id="cars-section">
      <div className="container-fluid categories pb-5">
        <div className="container pb-5">
          <div
            className="text-center mx-auto pb-5 wow fadeInUp"
            data-wow-delay="0.1s"
            style={{ maxWidth: "800px" }}
          >
            <h1 className="display-5 text-capitalize mb-3">
              Vehicle <span className="text-primary">Categories</span>
            </h1>
            <p className="mb-0">
              Browse through our collection of available vehicles and find the one that suits you best!
            </p>
            <input
              type="text"
              placeholder="Search by Model or Category..."
              className="form-control my-4"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <select name="categoryFilter" id="categoryFilter">
            {cars
                  .map((car) => car.category.categoryName) 
                  .filter((value, index, self) => self.indexOf(value) === index)  
                  .map((categoryName, index) => (
                     <option key={index} value={categoryName} >
                        {categoryName}
                     </option>
            ))}

  
            </select>
          </div>
          
          {message && <p className="text-center">{message}</p>}

          <div className="categories-carousel owl-carousel wow fadeInUp" data-wow-delay="0.1s">
            {currentCars.map((car) => (
              <div className="categories-item p-4" key={car.id}>
                <div className="categories-item-inner">
                  <div className="categories-img rounded-top">
                    <img
                      src={`data:image/png;base64,${car.image}`}
                      className="img-fluid w-100 rounded-top"
                      alt={car.model}
                    />
                  </div>
                  <div className="categories-content rounded-bottom p-4">
                    <h4>{car.model}</h4>
                    <div className="categories-review mb-4">
                      <div className="me-3">4.5 Review</div>
                      {/* Star Rating */}
                      <div className="d-flex justify-content-center text-secondary">
                        {[...Array(5)].map((_, starIndex) => (
                          <i
                            key={starIndex}
                            className={`fas fa-star ${
                              starIndex < 4.5 ? "text-warning" : "text-body"
                            }`}
                          ></i>
                        ))}
                      </div>
                    </div>
                    <div className="mb-4">
                      <h4 className="bg-white text-primary rounded-pill py-2 px-4 mb-0">
                        ${car.dailyPrice} /Day
                      </h4>
                    </div>

                    <div className="row gy-2 gx-0 text-center mb-4">
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-users text-dark"></i> 
                        <span className="text-body ms-1">4 Seat</span>
                      </div>
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-car text-dark"></i> 
                        <span className="text-body ms-1">{car.yearProduction}</span>
                      </div>
                      <div className="col-4">
                        <i className="fa fa-gas-pump text-dark"></i> 
                        <span className="text-body ms-1">Petrol</span>
                      </div>
                    </div>

                    <div className="row gy-2 gx-0 text-center mb-4">
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-users text-dark"></i> 
                        <span className="text-body ms-1">Model: {car.model}</span>
                      </div>
                      <div className="col-4 border-end border-white">
                        <i className="fa fa-car text-dark"></i> 
                        <span className="text-body ms-1">Category: {car.category.categoryName}</span>
                      </div>
                      <div className="col-4">
                        <i className="fa fa-gas-pump text-dark"></i> 
                        <span className="text-body ms-1">Motor: 3.6L</span>
                      </div>
                    </div>

                    <a
                      href="#"
                      className="btn btn-primary rounded-pill d-flex justify-content-center py-3"
                    >
                      Book Now
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination-container text-center mt-4">
            <ul className="pagination">
              {[...Array(Math.ceil(filteredCars.length / carsPerPage))].map((_, index) => (
                <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
                  <button 
                    className="page-link" 
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Cars;
