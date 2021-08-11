import { ethers } from 'ethers';
import { App, GameContractABI } from '../config';

function parseBalance(value) {
  return ethers.utils.formatEther(value);
}

export function hasMetaMask() {
  return typeof window !== 'undefined' && window.ethereum?.isMetaMask;
}

export function getProvider() {
  if (!hasMetaMask()) return new ethers.providers.JsonRpcProvider(App.ETH_RPC);
  return new ethers.providers.Web3Provider(window.ethereum, 'any');
}
export async function getInitialData() {
  const provider = await getProvider();
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  const signerBalance = await signer.getBalance();
  console.log({ signerAddress });

  const contract = new ethers.Contract(
    App.CONTRACT_ADDRESS,
    GameContractABI,
    signer
  );
  contract.on('depositEvent', (x) => {
    console.log('depositEvent Event', { x });
  });

  return {
    contract,
    signer: { address: signerAddress, balance: parseBalance(signerBalance) },
  };
}
