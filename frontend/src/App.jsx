import './pages/Home/Home.css'
import Main from './index'
import { Link } from 'react-router-dom'

const NavigationButton = (props) => {
  return (
    <button className='navButton'>{props.name}</button>
  )
}

const NavBar = () => {
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
          <Link to='/registracija'>
            <NavigationButton name="REGISTRACIJA" />
          </Link>
          <Link to='/login'>
            <NavigationButton name="LOGIN" />
          </Link>
        </div>
      </div>
    </>
  )
}


const App = () => {

  return (
    <>
      <NavBar />
      <Main />
    </> 
  )
}
export default App
