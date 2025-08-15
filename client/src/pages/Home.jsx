import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';


function Home(){


    return (
       <div>
        <h1>ברוכה הבאה 👋</h1>
        <p>התחילי להזמין מהתפריט</p>
        <Link to="/menu">למעבר לתפריט</Link>
       </div>
    );
}

export default Home;