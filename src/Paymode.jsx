import React, { useEffect, useState } from 'react'
import Sidenav from './Sidenav'
import Mainbaers from './Mainbaers'
import axios from 'axios';
import { Table } from 'react-bootstrap';
import './Paymode.css'
function Paymode() {
   
    const [first, setfirst] = useState([]);
 
  useEffect(() => {
    axios.get("http://localhost:5272/api/Log/Paymode").then((dis) => {
      console.log(dis);
      setfirst(dis.data);
    });
  }, []);
  return (
    <div>
        <Mainbaers/>
        <div className='pays'>
        <Sidenav/>
        <div className='pay'>
        <Table  striped bordered hover variant="blue" style={{borderRadius:"1rem"}}>
      <thead>
     
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>POST LEDGER</th>
          <th>POST LEDGER ID</th>
          <th>COMPANY ID</th>
        </tr>
      </thead>
      <tbody>
      {first.map((dis, ind) => {
            return (
        <tr>
          <td>{dis.id}</td>
          <td>{dis.name}</td>
          <td>{dis.post_ledger}</td>
          <td>{dis.post_Ledger_id}</td>
          <td>{dis.company_id}</td>
        </tr>
        
      );
    })}
      </tbody>
    </Table>
    </div>
    </div>

        </div>
    
  )
}

export default Paymode