import { ethers } from "ethers";  // v6

import { contractAddress } from "./Config";
import ClubVotingABI from "./ClubVoting.json";

export const connectContract = async () => {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum); // v6
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(
      contractAddress,
      ClubVotingABI.abi,
      signer
    );
    return contract;
  } else {
    alert("Please install MetaMask!");
  }
};
