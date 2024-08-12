import React, { useEffect, useState } from 'react';
import { Alert, Button, Col, Container, Form, Modal, Pagination, Row, Spinner, Table } from 'react-bootstrap';
import './Dayreport.css';
import Mainbaers from './Mainbaers';
import Sidenav from './Sidenav';
import axios from 'axios';

function Dayreport() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [firstPageItems] = useState(40);
  const [subsequentItems] = useState(20);
  const [selectedCounter, setSelectedCounter] = useState('');
  
 
  const today = new Date().toISOString().split('T')[0];  
  const [startTime, setStartTime] = useState(today);
  const [endTime, setEndTime] = useState(today);

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [combinedSummary, setCombinedSummary] = useState(null);
  const [isViewClicked, setIsViewClicked] = useState(false); 

  const [currentSet, setCurrentSet] = useState(1);
  const pagesPerSet = 20;

  useEffect(() => {
    axios.get("http://localhost:5272/api/Report/dayendreport")
      .then((response) => {
        setData(response.data);
        setFilteredData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("There was an error fetching the day end report data!", error);
        setError("There was an error fetching the day end report data!");
        setLoading(false);
      });
  }, []);

  const fetchCombinedSummary = async (dayid, shiftid, userid, counter, location, invdate, Transactionid) => {
    try {
      const response = await axios.get(`http://localhost:5272/api/Report/combined-summary`, {
        params: { dayid, shiftid, userid, counter, location, invdate, Transactionid }
      });
      setCombinedSummary(response.data);
    } catch (error) {
      console.error("There was an error fetching the combined summary data!", error);
    }
  };

  const itemsPerPage = currentPage === 1 ? firstPageItems : subsequentItems;
  const handleViewClick = () => {
    let filtered = data;

    if (selectedCounter) {
      filtered = filtered.filter(item => item.countername === selectedCounter);
    }

    if (startTime && endTime) {
      filtered = filtered.filter(item => {
        const itemStartTime = new Date(item.starttime).getTime();
        const filterStartTime = new Date(startTime).getTime();
        const filterEndTime = new Date(endTime).getTime();
        return itemStartTime >= filterStartTime && itemStartTime <= filterEndTime;
      });
    }

 
    const uniqueFiltered = filtered.filter((value, index, self) =>
      index === self.findIndex((t) => (
        t.dayid === value.dayid
      ))
    );

    setFilteredData(uniqueFiltered);
    setCurrentPage(1);
    setCurrentSet(1); 
    setIsViewClicked(true); 
  };

  const handleShowModal = async (item) => {
    const startDateTime = new Date(item.starttime);
    const endDateTime = item.endtime ? new Date(item.endtime) : null;

    await fetchCombinedSummary(item.dayid, item.shiftid, item.id, item.counterid, item.locationId, startDateTime, item.transactionId);

    setModalData({
      ...item,
      startDate: startDateTime.toLocaleDateString(),
      startTime: startDateTime.toLocaleTimeString(),
      endDate: endDateTime ? endDateTime.toLocaleDateString() : '',
      endTime: endDateTime ? endDateTime.toLocaleTimeString() : '',
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalData(null);
    setCombinedSummary(null);
  };

  let indexOfFirstItem, indexOfLastItem;

  if (currentPage === 1) {
    indexOfFirstItem = 0;
    indexOfLastItem = firstPageItems;
  } else {
    indexOfFirstItem = firstPageItems + (currentPage - 2) * subsequentItems;
    indexOfLastItem = indexOfFirstItem + subsequentItems;
  }

  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalSale = combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) || 0;
  const totalReturnSale = combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) || 0;
  const totalAfterReturn = totalSale - totalReturnSale;
  const totalCategory = combinedSummary?.itemCategorySummary.filter(item => item.categoryName !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalNetAmount, 0) || 0;

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const totalSets = Math.ceil(Math.ceil(filteredData.length / (firstPageItems + subsequentItems)) / pagesPerSet);

  return (
    <div>
      <Mainbaers />
      <Sidenav />
      <Container className='mainspage'>
        <Row>
          <h1>DAY END REPORTS</h1>
          <Col className='dayendcol1'>
          <h4 className='colh4'>&nbsp;&nbsp;COUNTER</h4>
            <Form.Select
              aria-label="Default select example"
              className='dayendform1'
              value={selectedCounter}
              onChange={(e) => setSelectedCounter(e.target.value)}
            >
              <option value="" disabled>Select an option</option>
              {[...new Set(data.map(option => option.countername))].map(countername => (
                <option key={countername} value={countername}>
                  {countername}
                </option>
              ))}
            </Form.Select>
            &nbsp;&nbsp;
            <h4 className='colh4'>START&nbsp;TIME</h4>
            <input
              className='dayendform1'
              type="date"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />&nbsp;&nbsp;
            <h4 className='colh4'>END&nbsp;TIME</h4>
            <input
              className='dayendform1'
              type="date"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />&nbsp;&nbsp;&nbsp;&nbsp;
            <br />
            <Button style={{ width: "100px", height: "35px" }} variant="outline-danger" onClick={handleViewClick}>VIEW</Button>
          </Col>
          <Col>
            {loading ? (
              <Spinner animation="border" />
            ) : error ? (
              <Alert variant="danger">
                {error}
              </Alert>
            ) : filteredData.length === 0 ? (
              <Alert variant="warning">
                No data available for the selected counter.
              </Alert>
            ) : (
              <>
                {isViewClicked && selectedCounter && startTime && endTime && (
                  <>
                    <Table striped hover variant="blue">
                      <thead>
                        <tr>
                          <th>USERNAME</th>
                          <th>DAYID</th>
                          <th>SHIFTID</th>
                          <th>COUNTER</th>
                          <th>BRANCH</th>
                          <th>START TIME</th>
                          <th>End Time</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentItems.map((item, index) => (
                          <tr key={index}>
                            <td>{item.user_Name}</td>
                            <td>{item.dayid}</td>
                            <td>{item.shiftid}</td>
                            <td>{item.countername}</td>
                            <td>{item.location}</td>
                            <td>{item.starttime}</td>
                            <td>{item.endtime}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                onClick={()=>handleShowModal(item)}
                              >
                                Show data
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    {showModal && (
                    <Modal show={showModal} onHide={handleCloseModal}>
    <Modal.Header closeButton>
      <Modal.Title style={{ marginLeft: "135px" }}>
        <h5 style={{ marginLeft: "49px" }}>Manama Center </h5> &nbsp;&nbsp;&nbsp;SHIFTENDREPORT <br />
      </Modal.Title>
    </Modal.Header>
    <div className='phead'>
      <div className='classphead2'><p>Start Date &nbsp;&nbsp;: </p><p className='classdatevalue'>{modalData?.startDate}</p></div>
      <div className='classphead2'><p>Start Time&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.startTime}</p></div>
      <div className='classphead2'><p>End Date&nbsp;&nbsp;&nbsp;&nbsp; :</p><p className='classdatevalue'>{modalData?.endDate}</p></div>
      <div className='classphead2'><p>End Time &nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.endTime}</p></div>
      <div className='classphead2'><p>UserName &nbsp; : </p><p className='classdatevalue'>{modalData?.user_Name}</p></div>
      <div className='classphead2'><p>Counter&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; : </p><p className='classdatevalue'>{modalData?.countername}</p></div>
    </div>
    <div className='classparticular'>
      <p>Particulars</p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <p>Count </p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      <p>Amount</p>
    </div><hr />
    <p style={{ paddingLeft: "25px" }}><b>SALES</b></p><hr />
    <div className='phead'>
      {combinedSummary?.salesSummary.map(({ paymode, count, amount }) => (
        paymode !== 'MULTIPAYMODE' && (
          <div className='classphead2' key={paymode}>
            <p>{paymode}</p>
            <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{count}</p>
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{amount.toFixed(3)}</p>
          </div>
        )
      ))}
      <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.count, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0).toFixed(3)}</p></div>
    </div>
    <hr />
    <p style={{ paddingLeft: "25px" }}><b>SALES RETURN</b></p><hr />
    <div className='phead'>
      {combinedSummary?.salesReturnSummary.map(({ paymode, count, amount }) => (
        paymode !== 'MULTIPAYMODE' && (
          <div className='classphead2' key={paymode}>
            <p>{paymode}</p>
            <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{count}</p>
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{amount.toFixed(3)}</p>
          </div>
        )
      ))}
      <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.count, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0).toFixed(3)}</p></div>
      <div className='classphead2'><p>TOTAL AFTER RETURN &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{(combinedSummary?.salesSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0) - combinedSummary?.salesReturnSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.amount, 0)).toFixed(3)}</p></div>
    </div>
    <hr />
    <p style={{ paddingLeft: "25px" }}><b>CATEGORY SUMMARY </b></p><hr />
    <div className='phead'>
      {combinedSummary?.itemCategorySummary.map(({ categoryName,   totalQuantity, totalNetAmount }) => (
        (
          <div className='classphead2' key={categoryName}>
            <p>{categoryName}</p>
            <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{totalQuantity}</p>
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalNetAmount.toFixed(3)}</p>
          </div>
        )
      ))}
            <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.itemCategorySummary.filter(item => item.categoryName !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalQuantity, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.itemCategorySummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.totalNetAmount, 0).toFixed(3)}</p></div>
      </div>
      <hr />
      <p style={{ paddingLeft: "25px" }}><b>EMPLOYEE SUMMARY</b></p><hr />
    <div className='phead'>
      {combinedSummary?.employeeSalesSummary.map(({ employeeName,totalTransactions,totalNetAmount }) => (
      (
          <div className='classphead2' key={employeeName}>
            <p>{employeeName}</p>
            <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{totalTransactions}</p>
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{totalNetAmount.toFixed(3)}</p>
          </div>
        )
      ))}
     
    </div>
    <hr />
    <p style={{ paddingLeft: "25px" }}><b>PRODUCT SUMMARY</b></p><hr />
    <div className='phead'>
      {combinedSummary?.productSummary.map(({ productName,productQuantity,productNetAmount }) => (
      (
          <div className='classphead2' key={productName}>
            <p>{productName}</p>
            <p style={{ position: "absolute", right: "250px" }} className='classdatevalue'>{productQuantity}</p>
            <p style={{ position: "absolute", right: "10px" }} className='classdatevalue'>{productNetAmount.toFixed(3)}</p>
          </div>
        )
      ))}
     <div className='classphead2'><p>TOTAL &nbsp;&nbsp;&nbsp; </p><p className='classdatevalue' style={{ position: "absolute", right: "250px" }}>{combinedSummary?.productSummary.filter(item => item.productName !== 'MULTIPAYMODE').reduce((total, item) => total + item.productQuantity, 0)}</p><p className='classdatevalue' style={{ position: "absolute", right: "10px" }}>{combinedSummary?.productSummary.filter(item => item.paymode !== 'MULTIPAYMODE').reduce((total, item) => total + item.productNetAmount, 0).toFixed(3)}</p></div>
    </div>
    <hr />
    <Modal.Body>
      <Table striped hover color='black' className='tableclass'>
        <tr>
          <th></th>
          <th>X</th>
          <th>=</th>
        </tr>
        <tr>
          <td className='TABLEROW'>20</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>10</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>5</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>1</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.500</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.100</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.050</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.025</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.010</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'>.005</td>
          <td className='TABLEROW'>X</td>
          <td className='TABLEROW'>=</td>
        </tr>
        <tr>
          <td className='TABLEROW'></td>
          <td className='TABLEROW'>Total</td>
          <td className='TABLEROW'>=</td>
        </tr>
      </Table>
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
    </Modal.Footer>
  </Modal>
                    )}
                    <Pagination>
                      <Pagination.Prev
                        onClick={() => currentSet > 1 && setCurrentSet(currentSet - 1)}
                      />
                      {[...Array(totalSets)].map((_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={currentSet === index + 1}
                          onClick={() => setCurrentSet(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      ))}
                      <Pagination.Next
                        onClick={() => currentSet < totalSets && setCurrentSet(currentSet + 1)}
                      />
                    </Pagination>
                  </>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Dayreport;
