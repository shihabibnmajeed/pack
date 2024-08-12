import LogoutIcon from '@mui/icons-material/Logout';
import { MdSpaceDashboard } from "react-icons/md";
import { MdOutlineShoppingCart } from "react-icons/md";
import { SiSimpleanalytics } from "react-icons/si";
import { MdPeopleAlt } from "react-icons/md";
export const SideBarData=[
    {
        icon:MdSpaceDashboard,
        heading:"Dashbord"
    },
    {
        icon:MdOutlineShoppingCart,
        heading:"PAYMODE",
        path:"/paymode"
    },
    {
        icon:MdPeopleAlt,
        heading:"Customers"
    },{
        icon:MdOutlineShoppingCart,
        heading:" SALES DETAILES",
        path:"/sales"
    },
        {
        icon:SiSimpleanalytics,
        heading:"DAYREPORT",
        path:"/dayreport"
    },   
    {
       icon:MdOutlineShoppingCart ,
       heading:"Inventory"
    }, 
    {
        icon:MdOutlineShoppingCart,
        heading:"DAY END REPORT",
        path:"/day"
    },
       {
        icon:LogoutIcon,
        heading:"LOGOUT",
        path:"/main"
    }   
]