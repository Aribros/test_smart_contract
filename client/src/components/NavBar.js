import React from 'react';


export default (props) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <a className="navbar-brand " href="#">Nezo Tokens</a>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto float-right">
          <li className="nav-item">
            <a className="nav-link disabled" href="#" tabIndex="-1" aria-disabled="true">
              Address: <strong>{props.address}</strong>
            </a>
          </li>
        </ul>        
      </div>
    </nav>
  );

}