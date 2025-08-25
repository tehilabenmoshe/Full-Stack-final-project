import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import CategoryList from '../components/CategoryList';
import CartButton from '../components/CartButton'; 
import '../styles/customer.css'
import { useAuth } from '../AuthProvider';
import { Outlet } from 'react-router-dom';



function Customer(){
    const [q, setQ] = useState('')
    const { user } = useAuth();

     return (
        <div className="layout">
            <div className="sidebar"><Sidebar /></div>
                <div className="main">
                    <Topbar query={q} onChange={setQ} />
                    <div className="customer-header">
                        <CartButton />           
                    </div>
                    
                    <Outlet context={{ query: q }} />
                </div>
        </div>
  );

}

export default Customer;