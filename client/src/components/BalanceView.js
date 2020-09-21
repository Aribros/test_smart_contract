
import React from 'react';


export default (props) => {

  return (
    <div className = "row my-4">
        <div className="col">
            <h6>Invested Tether Balance: </h6>
            <p>
                <span className="badge badge-danger">{props.tetherBalance} Tether</span>
            </p>
        </div>
        <div className="col">
            <h6> Earned Nezo Token Balance </h6>
            <p>
                <span className="badge badge-success">{props.nezoTokenBalance} Nezo</span>
            </p>            
        </div>        
        <div className="col">
            <h6> Available Tether balance </h6>
            <p>
                <span className="badge badge-info">{props.mockTetherBalance} Tether</span>
            </p>            
        </div>        
    </div>
  );

}