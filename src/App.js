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
  const contractAddress = "0xB01951338013B4a22E899562350a3526Df4C2F64";
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
        
        const jokeTxn = await jokePortalContract.joke(text, { gasLimit: 300000 });
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
    getAllJokes();

    let jokePortalContract;

    const onNewJoke = (from, timestamp, message) => {
      console.log("NewJoke", from, timestamp, message);
      setAllJokes(prevState => [
        ...prevState, {
          address: from,
          timestamp: new Date(timestamp*1000),
          message: message
        }
      ]);
    };

    if(window.ethereum ) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      jokePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      jokePortalContract.on("newJoke", onNewJoke);
    }

    return () => {
      if (jokePortalContract) {
        jokePortalContract.off("newJoke", onNewJoke);
      }
    };

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
        <img src="data:image/jpeg;base64,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"></img>
      </div>
    </div>
  );
}
