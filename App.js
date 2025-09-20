import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import "./App.css";
import { contractAddress } from "./Config";
import { connectContract } from "./ethers";
import abi from "./ClubVoting.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const contract = await connectContract();
        setContract(contract);
      }
    };
    init();
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        setProvider(provider);
        setSigner(signer);

        const contract = new ethers.Contract(contractAddress, abi.abi, signer);
        setContract(contract);

        const address = await signer.getAddress();
        setAccount(address);

        loadCandidates(contract);
      } catch (err) {
        console.error("Wallet connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const loadCandidates = async (contract) => {
    try {
      const count = await contract.getCandidates();
      setCandidates(count);
    } catch (err) {
      console.error("Error loading candidates:", err);
    }
  };

  const vote = async (id) => {
    try {
      const tx = await contract.vote(id);
      await tx.wait();
      setMessage(`✅ Successfully voted for candidate #${id}`);
      loadCandidates(contract);
    } catch (err) {
      console.error("Voting failed:", err);
      setMessage("❌ Voting failed (maybe you already voted?)");
    }
  };

  return (
    <div className="App">
      <h1>🗳 Club Voting DApp</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Wallet</button>
      ) : (
        <p>Connected: {account}</p>
      )}

      {candidates.length > 0 ? (
        <div>
          <h2>Candidates:</h2>
          <ul>
            {candidates.map((c, index) => (
              <li key={index}>
                {c.name} — Votes: {c.votes}{" "}
                <button onClick={() => vote(index)}>Vote</button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Load candidates after connecting wallet.</p>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default App;
