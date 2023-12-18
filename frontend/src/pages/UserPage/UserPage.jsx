// UserPage.jsx

import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserPage.css';
import { useAuth } from '../../AuthContext';


const UserPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  useEffect(() => {
    //provjeri je li korisnik prijavljen
    if (!isAuthenticated) {
      //ako nije prijavljen, preusmjeri ga na login
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    //pozovi funkciju za odjavu iz AuthContext
    logout();
  };

  return (
    <div className="container">
      {isAuthenticated ? (
        //ako je korisnik autentificiran
        <>
          <h1>Welcome to the user page!</h1>
          <p>This page is only accessible to logged-in users.</p>
          <p>User is authenticated.</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        //ako korisnik nije autentificiran
        <p>Error: User not authenticated.</p>
      )}
    </div>
  );
};

export default UserPage;
