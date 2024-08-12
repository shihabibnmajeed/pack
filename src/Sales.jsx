import React, { useContext, useEffect, useState } from 'react'
import Sidenav from './Sidenav';
import Mainbaers from './Mainbaers';
import axios from 'axios';
import AuthContext from './context/AuthContext';
import { Button, Form, Table } from 'react-bootstrap';
import './Sales.css'
import 'react-datepicker/dist/react-datepicker.css';
import ReactDatePicker from 'react-datepicker';

function Sales() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const itemsPerPage = 10;
  const { token } = useContext(AuthContext);

  useEffect(() => {
    axios.get("http://localhost:5272/api/Log/customer", {
      headers: { Authorization: `Bearer ${token}` }
    }).then((response) => {
      console.log(response);
      setData(response.data);
    });
  }, [token]);

  const handleFilter = () => {
    if (startDate && endDate) {
      const filteredData = data.filter(item => {
        const itemDate = new Date(item.invdate);
        return itemDate >= startDate && itemDate <= endDate;
      });
      return filteredData;
    }
    return data;
  };

  const filteredData = handleFilter();

  // Calculate the indices for the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const nextPage = () => {
    if (currentPage < Math.ceil(filteredData.length / itemsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <Mainbaers />
      <div className='payd'>
        <Sidenav />
       
        <div className='paytd'> 
        <Form.Select aria-label="Default select example" style={{width:"375px",marginLeft:"625px"}}>
      <option>Select branch</option>
      <option value="1">branch 1</option>
      <option value="2">branch 2</option>
      <option value="3">branch 3</option>
  </Form.Select>
  <div className="date-picker-container">
            <ReactDatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Start Date"
            />
            <ReactDatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="End Date"
            />
          </div>
          <Table striped bordered hover variant="blue" style={{ borderRadius: "1rem" }}>
            <thead>
              <tr>
                <th>NO</th>
                <th>SNO</th>
                <th>INVDATE</th>
                <th>NET AMOUNT</th>
                <th>CUSTOMER ID</th>
                <th>SALES MAN</th>
                <th>PID</th>
                <th>CUSTOMER NAME</th>
                <th>PAYMODE</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={indexOfFirstItem+index}>
                  <td>{indexOfFirstItem+index + 1}</td>
                  <td>{item.sno}</td>
                  <td>{item.invdate}</td>
                  <td>{item.netamount}</td>
                  <td>{item.cust_id}</td>
                  <td>{item.salesman}</td>
                  <td>{item.pid}</td>
                  <td>{item.custname}</td>
                  <td>{item.paymode}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Button onClick={prevPage} disabled={currentPage === 1}>
            Previous
          </Button>
          <Button onClick={nextPage} disabled={currentPage === Math.ceil(filteredData.length / itemsPerPage)}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Sales;
