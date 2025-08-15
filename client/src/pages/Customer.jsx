import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';


function Customer(){


    return (
       <div>
        <h1> Welcome!</h1>
        <p>התחילי להזמין מהתפריט</p>
        <Link to="/menu">למעבר לתפריט</Link>
       </div>
    );
}

export default Customer;