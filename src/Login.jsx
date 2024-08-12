import React, { useContext, useState } from 'react'
import './Login.css'
import { Button, Col, Container, Form, Row } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';
import AuthContext from './context/AuthContext';
import { api } from './Axios';

function Login() {
    const navigate = useNavigate();
  const { setToken, setUsername } = useContext(AuthContext); // Get setToken and setUsername from AuthContext
  const [inputvalue, setInputValue] = useState({
    User_Name: "",
    pwd: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await api.post('/Log/login', inputvalue);
      console.log(data.data?.token);
      localStorage.setItem("__token__", data.data?.token);
  
    setToken(data.data?.token);
      setUsername(inputvalue.User_Name); 
      navigate('/main');
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className='photes'>
          <div className='names' ><h1 className='log'>LOGIN</h1></div>
        <Container>
           
            <Row className='bordering'>
                <Col>
                
      <Form className='set' onSubmit={handleSubmit}>
        <Form.Group>
            <Form.Label>
              <h6>USER NAME</h6>  
            </Form.Label>
            <Form.Control className='box' placeholder="Enter User Name"
              value={inputvalue.User_Name}
              onChange={(e) =>
                setInputValue({ ...inputvalue,User_Name: e.target.value })
              }/>
        </Form.Group> <br />
        <Form.Group>
            <Form.Label>
            <h6>PASSWORD</h6> 
                
            </Form.Label>
            <Form.Control className='box' placeholder="Enter Password" type='Password'  value={inputvalue.pwd}
         onChange={(e) =>
           setInputValue({ ...inputvalue,pwd: e.target.value })
         } />
        </Form.Group> <br />
        <Form.Group>
            <Form.Label>
            <h6>BRANCHES</h6> 
                
            </Form.Label>
            <Form.Control className='box' type="password" placeholder="Enter Branches"/>
        </Form.Group> <br />
        <Form.Group className='buts'>
         <Button variant="secondary" className='but' type='submit'>Login</Button>
          <Button type="submit" className='but' variant="secondary">Cencel</Button>
        </Form.Group>
      </Form>
      </Col>
      </Row>
    </Container>


    </div>
  )
}

export default Login