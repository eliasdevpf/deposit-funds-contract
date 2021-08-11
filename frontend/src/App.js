import { ethers } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import './App.css';
import { getInitialData } from './helpers';

function App2() {
  const [contract, setContract] = useState();
  const [signerData, setSignerData] = useState();

  const getData = useCallback(async () => {
    const { contract, signer } = await getInitialData();
    console.log(signer);
    setSignerData({ ...signer });
    setContract(contract);
  }, []);

  async function handleDepositFunds() {
    const bet = ethers.utils.parseUnits('1.5', 18);
    await contract.deposit(bet, {
      value: bet,
    });
  }

  async function handleReadDeposits() {
    try {
      await contract.getViewBalance();
    } catch (err) {
      console.log('error', err);
    }
  }

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>
          <strong>Address:</strong> {signerData?.address}
        </span>
        <span>
          <strong>Balance: </strong> {signerData?.balance} ETH
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={handleDepositFunds}
          style={{
            background: 'lightgreen',
            border: 'none',
            fontSize: '18px',
            padding: '1rem',
            cursor: 'pointer',
            margin: '1rem',
          }}
        >
          Deposit funds
        </button>
        <button
          style={{
            background: 'lightblue',
            border: 'none',
            fontSize: '18px',
            padding: '1rem',
            cursor: 'pointer',
            margin: '1rem',
          }}
          onClick={handleReadDeposits}
        >
          Read deposited funds
        </button>
      </div>
    </div>
  );
}

export default App2;
