import './pages/Home/Home.css'
import Main from './index'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext';

const NavigationButton = (props) => {
  return (
    <button className='navButton'>{props.name}</button>
  )
}

const Footer = () => {
  return (
    <div className='footer'>footer</div>
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
          <a href='#' className='logo'>
            <h2>dipol</h2>
          </a>
        </Link>
        <div className='navBtns'>
          <Link to='/konferencije'>
            <NavigationButton name="KONFERENCIJE" />
          </Link>
          <Link to='/uzivo'>
            <NavigationButton name="UŽIVO" />
          </Link>
          <NavigationButton name="O NAMA" />

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
          {isAuthenticated && (
            <>
              <button className='navButton' style={{ cursor: 'default' }}>
                  {korisnik && (
                  <>
                    {korisnik.ime.toUpperCase()} {korisnik.prezime.toUpperCase()}
                  </>
                )}
              </button>
              <button className='navButton' onClick={handleLogout}>ODJAVA</button>
              <Link to='/proslekonferencije'>
                <NavigationButton name='PROŠLE KONFERENCIJE' />
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
      <Footer />
    </> 
  )
}
export default App
