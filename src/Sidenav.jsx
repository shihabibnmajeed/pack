import React, { useState } from 'react'
import './Sidenave.css'
import { SideBarData } from './Data/Data'
import { useNavigate } from 'react-router-dom'

function Sidenav() {
 
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();
  const handleMenuItemClick = (index, path) => {
      setSelected(index);
      navigate(path); // Navigate to the specified path
  };
  return (
    <div className='sidebar'>
    <div className="menu">
        {SideBarData.map((item, index) => {
            return (
                <div className={selected === index ? 'menuitem active' : 'menuitem'}
                    key={index}
                    onClick={() => handleMenuItemClick(index, item.path)}>
                    <item.icon />
                    <span>
                        {item.heading}
                    </span>
                </div>
            );
        })}
       
    </div>
</div>
  )
}


export default Sidenav