import React, { useEffect, useState, useRef } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WaveFolder.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);
  const [allJokes, setAllJokes] = useState([]);
  const currentJoke = useRef();
  const [jokes, setJokes] = useState(0);
  const contractAddress = "0x1Ae4462705F2c54aADDF6c62f1254efc452BF38A";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        console.log("Ethereum object present: ", ethereum);
      } else {
        console.log("Please connect to metamask");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_accounts"});

      if(accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found account: ", account);
        setCurrentAccount(account)
      } else {
        console.log("No authorized accounts found.");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const getAllJokes =  async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const jokePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await jokePortalContract.getTotalJokes();
        let jokes = await jokePortalContract.getAllJokes();
        setJokes(count.toNumber());
        let jokesCleaned = [];
        jokes.forEach(joke => {
          jokesCleaned.push({
            address: joke.joker,
            timestamp: new Date(joke.timestamp * 1000),
            message: joke.message
          });
        });
        setAllJokes(jokesCleaned);
        console.log("retrived total count from contract: ", count.toNumber());
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if(!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"});
      console.log("Connected: ", accounts[0]);
    } catch (e) {
      console.log(e);
    }
  }

  const joke =  async () => {
    try {
      const { ethereum } = window;

      const text = currentJoke.current.value;
      
      if(text==="") {
        alert("Enter a joke.");
        return;
      }

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const jokePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const jokeTxn = await jokePortalContract.joke(text);
        setMining(true);
        await jokeTxn.wait();
        setMining(false);
        console.log(jokeTxn.hash);
        alert("saved your joke!");
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (e) {
      console.log(e);
    }
  }

  useEffect( () => {
    checkIfWalletIsConnected();
  }, []);
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I'm Shivansh. Tell me something funny and you might win a few ETH 👀!
        </div>

        <button className="waveButton" onClick={getAllJokes}>
          See all jokes
        </button>

        <br/>
        <input ref={currentJoke} placeholder="Make me laugh!"></input>
        <button className="waveButton" onClick={joke} disabled={mining}>
          Crack a joke!
        </button>

        <h4>Total number of jokes cracked are: {jokes}</h4>

        {
          !currentAccount && (
            <button className="waveButton" onClick={connectWallet}>
              Connect Wallet
            </button>
          )
        }

        {allJokes.map((joke, index) => {
          return (
            <div key={index} style={{ backgroundColor: "OldLace", marginTop: "16px", padding: "8px" }}>
              <div>Address: {joke.address}</div>
              <div>Time: {joke.timestamp.toString()}</div>
              <div>Message: {joke.message}</div>
            </div>)
        })}
      </div>
    </div>
  );
}
