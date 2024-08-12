import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './Login'
import Main from './Main'
import Paymode from './Paymode'
import Sales from './Sales'
import Dayreport from './Dayreport'
import DayendReport from './DayendReport'


function Routers() {
  return (
    <div>
 <BrowserRouter>
        <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/main' element={<Main/>}/>
        <Route path='/paymode' element={<Paymode/>}/>
        <Route path='/sales' element={<Sales/>}/>
        <Route path='/day' element={<Dayreport/>}/>
        <Route path='/dayreport' element={<DayendReport/>}/>
        </Routes>

        </BrowserRouter>

        
    </div>
  )
}

export default Routers