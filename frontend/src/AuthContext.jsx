import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [korisnik, setKorisnik] = useState(() => {
    const storedKorisnik = localStorage.getItem('korisnik');
    return storedKorisnik ? JSON.parse(storedKorisnik) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('isAdmin') === 'true';
  });

  const [isAuthor, setIsAuthor] = useState(() => {
    return localStorage.getItem('isAuthor') === 'true';
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  
  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated);
    localStorage.setItem('isAdmin', isAdmin);
  }, [isAuthenticated, isAdmin]);

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
        // setIsAdmin(korisnikData.role.includes('admin'));
        // setIsAuthor(korisnikData.role.includes('autor'));
      } else {
        setIsAuthenticated(false);
        const errorData = await response.json();
        throw new Error(errorData.poruka || 'Authentication failed');
      }      
    } catch (error) {
      console.error('Authentication error:', error.message);
      setIsAuthenticated(false);
      throw error;
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
        setIsAdmin(false);
        setIsAuthor(false);
        setKorisnik(null);
        localStorage.removeItem('korisnik');
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('isAdmin');
        localStorage.removeItem('isAuthor');
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key.startsWith('konferencija_')) {
              localStorage.removeItem(key);
          }
        }      

      } else {
        throw new Error('Logout failed');
      }
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, isAuthor, korisnik, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
