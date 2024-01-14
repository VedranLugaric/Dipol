import './pages/Home/Home.css'
import Main from './index'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext';

const NavigationButton = (props) => {
  return (
    <button className='navButton'>{props.name}</button>
  )
}


const NavBar = () => {
  const { isAuthenticated, korisnik, logout } = useAuth();


  const handleLogout = () => {
    //pozovi funkciju za odjavu iz AuthContext
    logout();
  };


  return (
    <>
      <div className='navBar'>
        <Link to='/' className='logo'>
          <a href='#'>
            <h2>dipol</h2>
          </a>
        </Link>
        <div className='navBtns'>
          
          <Link to='/konferencije'>
            <NavigationButton name="KONFERENCIJE" />
          </Link>
          <Link to='/proslekonferencije'>
                <NavigationButton name='PROŠLE KONFERENCIJE' />
              </Link>
          <NavigationButton name="O NAMA" />
          {isAuthenticated && (
            <>
              <button className='navButton' onClick={handleLogout}>ODJAVA</button>
              <button className='navButton' style={{ cursor: 'default'}}>
                  {korisnik && (
                  <>
                    {korisnik.ime.toUpperCase()} {korisnik.prezime.toUpperCase()}
                  </>
                )}
              </button>
            </>
          )}
          {!isAuthenticated && (
            <>
              <Link to='/registracija'>
                <NavigationButton name="REGISTRACIJA" />
              </Link>
              <Link to='/login'>
                <NavigationButton name="LOGIN" />
              </Link>
            </>
          )}
          </div>
        </div>
    </>
  );
};


const App = () => {

  return (
    <>
      <NavBar />
      <Main />
    </> 
  )
}
export default App
