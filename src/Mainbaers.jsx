import React, { useContext } from 'react'
import { Container, Navbar} from 'react-bootstrap';
import AuthContext from './context/AuthContext';

import './Mainbars.css'
function Mainbaers() {
    const {username} = useContext(AuthContext);
  return (
    <div>
        < responsive>
      <Container fluid className='navesbar'  >
        <Navbar className=" bg-body-tertiary">
      <Navbar.Brand href="#home"><h1 className='cmdy' >Product company</h1> </Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          
         <h4 responsive> Loged in:{username}</h4> 
         
        </Navbar.Collapse>
     
    </Navbar> </Container></responsive>
    </div>
  )
}

export default Mainbaers