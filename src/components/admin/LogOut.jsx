import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LogOut() {
  const navigate = useNavigate();

  useEffect(() => {
    // Remove the token (or apiKey) from localStorage
    localStorage.removeItem("apiKey");

    // Redirect to the authentication page
    navigate("/auth");
  }, [navigate]);

  return (
    <div>
      <h1>Logging out...</h1>
    </div>
  );
}
