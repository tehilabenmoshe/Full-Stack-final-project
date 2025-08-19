import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/customer.css'
import { useAuth } from '../AuthProvider';


function Customer(){
    const [q, setQ] = useState('')
    const { user } = useAuth();

    return (
        <div>           
            <div className="layout">
                <Sidebar />
                <div className="main">
                    <Topbar query={q} onChange={setQ} />
                   
                     <h1>Welcome, {user?.name}!</h1>
                                         
                </div>
            </div>
        </div>
  
    );
}

export default Customer;