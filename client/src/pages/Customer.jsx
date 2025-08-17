import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar'
import Topbar from '../components/Topbar'
import '../styles/customer.css'


function Customer(){
    const [q, setQ] = useState('')

    return (
        <div> 
          
            <div className="layout">
       
                <Sidebar />
                <div className="main">
                    <Topbar query={q} onChange={setQ} />
                    
                </div>
            </div>

        </div>


     
       
       
    );
}

export default Customer;