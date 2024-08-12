import React, { useState } from 'react'
import Mainbaers from './Mainbaers'
import Sidenav from './Sidenav'
import { Button, Col, Container, Row, Table } from 'react-bootstrap'
import axios from 'axios';
import './DayendReport.css';

function DayendReport() {
  const today = new Date().toISOString().split('T')[0]; 
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState(today);
    const [toDate, setToDate] = useState(today);
  
    const fetchData = () => {
      setLoading(true);
      setError(null); // Clear any previous errors
  
      axios.get(  'http://localhost:5272/api/Report/combinedday-summary' , {
        params: {
          startDate: fromDate,
          endDate: toDate
        }
      })
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the day end report data!", error);
        setError("There was an error fetching the day end report data!");
        setLoading(false);
      });
    };
    const handleprint =() => {
    
      const contentToPrint= document.getElementById('printable-table');
      const orginalContent = document.body.innerHTML;


      document.body.innerHTML =contentToPrint.outerHTML;
      window.print();
      document.body.innerHTML= orginalContent;
      window.location.reload();
    };
  
  return (
    
  <div>
      <Mainbaers />
      <Sidenav />
      <Container className='mainspage'>
      <Row className='col2'>
          <h1>DAY REPORT</h1>
          <Col className='dayendcol1'>
            <h4 className='colh4'>&nbsp;&nbsp;From &nbsp;</h4>
            <input
              className='dayendform1'
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <h4 className='colh4'>To &nbsp;</h4>
            <input
              className='dayendform1'
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
            <br />&nbsp;
            <Button className='buttons' style={{ width: "100px", height: "35px" }} variant="outline-danger" onClick={fetchData}>VIEW</Button>&nbsp;
            <Button className='buttons' style={{ width: "100px", height: "35px" }} variant="outline-danger" onClick={handleprint}>PRINT</Button>
            <br />
          </Col><br />
          <Col  >
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <Table striped bordered hover variant="blue" id='printable-table'   className='tableclasss'>
                <thead>
                  <tr>
                    <th>DATE</th>
                    <th>CASH SALES</th>
                    <th>VISACARD SALES</th>
                    <th>BENEFITPAY SALES</th>
                    <th>TOTAL SALES</th>
                   
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index}>
                    <td>{new Date(item.invDate).toLocaleDateString()}</td>

                      <td>{item.cashSales}</td>
                      <td>{item.visaCardSales}</td>
                      <td>{item.benefitSale}</td>
                      <td>{item.totalNetAmount}</td>
                     
                      
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default DayendReport