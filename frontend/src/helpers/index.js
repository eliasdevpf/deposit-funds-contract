import { ethers } from 'ethers';
import { App, GameContractABI } from '../config';

//Format an amount of wei into a decimal string representing
//the amount of ether.
function parseBalance(value) {
  return ethers.utils.formatEther(value);
}

export function hasMetaMask() {
  return typeof window !== 'undefined' && window.ethereum?.isMetaMask;
}
// A Web3Provider wraps a standard Web3 provider, which is
// what Metamask injects as window.ethereum into each page
export function getProvider() {
  if (!hasMetaMask()) return new ethers.providers.JsonRpcProvider(App.ETH_RPC);
  return new ethers.providers.Web3Provider(window.ethereum, 'any');
}
//Async function to fetch the data
export async function getInitialData() {
  const provider = await getProvider();
  // The Metamask plugin also allows signing transactions to
  // send ether and pay to change state within the blockchain.
  // For this, you need the account signer
  const signer = await provider.getSigner();
  const signerAddress = await signer.getAddress();
  const signerBalance = await signer.getBalance();
  console.log({ signerAddress });

  //new ethers.Contract( address , abi , signerOrProvider )
  const contract = new ethers.Contract(
    App.CONTRACT_ADDRESS,
    GameContractABI,
    signer
  );
  //Subscribe to event calling listener when the event occurs
  contract.on('depositEvent', (x) => {
    console.log('depositEvent Event', { x });
  });
  //
  return {
    contract,
    signer: { address: signerAddress, balance: parseBalance(signerBalance) },
  };
}
export async function getPastEvents(contract) {
  const _provider = getProvider();
  const signer = await _provider.getSigner();
  const signerAddress = await signer.getAddress();
  const filter = await contract.filters.depositEvent(signerAddress);
  const logs = await contract.queryFilter(filter);
  const filteredLogs = await _provider.getLogs(filter);
  console.log({ signerAddress, logs, filteredLogs });

  // const iface = new ethers.utils.Interface(GameContractABI)
  // const decodedEvents = logs?.map((log) => {
  // return iface.decodeEventLog('depositEvent', log.data)})
  // console.log(decodedEvents)
  // const toAddresses = decodedEvents.map((event) => event['values']['to'])
  // const fromAddresses = decodedEvents.map((event) => event['values']['from'])
  // const amounts = decodedEvents.map((event) => event['values']['value'])
  // return [fromAddresses, toAddresses, amounts]
}
