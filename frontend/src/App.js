import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import RewardUser from './components/RewardUser';
import AdminPanel from './components/AdminPanel';

function App() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');

  return (
    <div className="App">
      <h1>EcoToken DAO Dashboard</h1>
      <ConnectWallet setSigner={setSigner} setAccount={setAccount} />
      {signer && (
        <>
          <RewardUser signer={signer} />
          <AdminPanel signer={signer} />
        </>
      )}
    </div>
  );
}

export default App;
