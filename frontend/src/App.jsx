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

  function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("close-div").style.width = "100%";
  }
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("close-div").style.width = "0"
  }


  return (
    <>
      <div className='navBar'>
        <Link to='/' className='logo'>
          <span href='#'>
            <h2>dipol</h2>
          </span>
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
              <button className='navButton' style={{ cursor: 'default' }}>
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
      <div className='navBar-responsive'>
      <span className='open-nav' onClick={openNav}>&#9776;</span>
      <Link to='/' className='logo'>
          <span href='#'>
            <span>dipol</span>
          </span>
        </Link>
        <div id="mySidenav" class="sidenav">
          <button href="javascript:void(0)" class="closebtn" onClick={closeNav}>&times;</button>
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
              <button className='navButton' style={{ cursor: 'default' }}>
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
        <div id="close-div" className='close-div' onClick={closeNav}>

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
