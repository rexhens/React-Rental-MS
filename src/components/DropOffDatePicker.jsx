import React, { useState } from "react";
import DropOffDatePicker from "./DropOffDatePicker";

const ReservationForm = () => {
  const [formData, setFormData] = useState({
    dropOffDate: null, // Initial state for DatePicker
    dropOffTime: "12:00AM", // Default time
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <DropOffDatePicker formData={formData} setFormData={setFormData} />
      <button type="submit" className="btn btn-primary mt-3">
        Submit
      </button>
    </form>
  );
};

export default ReservationForm;
