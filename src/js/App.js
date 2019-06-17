import React from 'react';
import '../scss/main.scss';
import BookingsContainer from './BookingsContainer';
import logo from '../assets/adslot-logo.png'; 

function App() {
  return (
    <div className="container">
      <header className="header">
        <a className="header__logo" href="https://www.adslot.com/" target="_blank"><img src={logo} alt="Adslot" className="img-fluid"/></a>
      </header>
      <BookingsContainer/>
    </div>
  );
}

export default App;
