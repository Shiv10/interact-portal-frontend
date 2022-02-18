import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I'm Shivansh. Tell me something funny and you might win a few ETH 👀!
        </div>

        <button className="waveButton" onClick={wave}>
          Make the world a funnier place
        </button>
      </div>
    </div>
  );
}
