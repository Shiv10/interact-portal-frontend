import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from './utils/WaveFolder.json';

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [mining, setMining] = useState(false);
  const [jokes, setJokes] = useState(0);
  const contractAddress = "0x06EB61f4781fFB986E6d052b59c87bbdCb6424e5";
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

  const getJokeNumber =  async () => {
    try {
      const { ethereum } = window;

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const jokePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        let count = await jokePortalContract.getTotalJokes();
        setJokes(count.toNumber());
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

      if(ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const jokePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const jokeTxn = await jokePortalContract.joke();
        setMining(true);
        await jokeTxn.wait();
        setMining(false);
        console.log(jokeTxn.hash);
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

        <button className="waveButton" onClick={getJokeNumber}>
          Read number of jokes
        </button>

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
      </div>
    </div>
  );
}
