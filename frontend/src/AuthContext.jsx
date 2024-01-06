import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [korisnik, setKorisnik] = useState(() => {
    const storedKorisnik = localStorage.getItem('korisnik');
    return storedKorisnik ? JSON.parse(storedKorisnik) : null;
  });

  const [isAdminOrHigher, setisAdminOrHigher] = useState(() => {
    return localStorage.getItem('isAdminOrHigher') === 'true';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('isAdminOrHigher', isAdminOrHigher);
  }, [isAuthenticated, isAdminOrHigher]);

  const login = async (email, lozinka) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, lozinka }),
        credentials: 'include',
      });

      if (response.ok) {
        const korisnikData = await response.json();
        setKorisnik(korisnikData);
        localStorage.setItem('korisnik', JSON.stringify(korisnikData));
        setIsAuthenticated(true);

        if (JSON.stringify(korisnikData.role) === JSON.stringify(['admin'])) {
          setisAdminOrHigher(true);
        } else {
          setisAdminOrHigher(false);
        }

      } else {
        setIsAuthenticated(false);
        throw new Error('Authentication failed');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
      setIsAuthenticated(false);
      throw new Error('Authentication failed');
    }
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        setIsAuthenticated(false);
        setKorisnik(null);
        setisAdminOrHigher(false);
        localStorage.removeItem('korisnik');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdminOrHigher');
      } else {
        throw new Error('Logout failed');
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdminOrHigher, korisnik, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
