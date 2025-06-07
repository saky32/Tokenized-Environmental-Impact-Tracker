import React, { useState } from 'react';
import ConnectWallet from './components/ConnectWallet';
import RewardUser from './components/RewardUser';
import AdminPanel from './components/AdminPanel';

function App() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ marginBottom: '1rem' }}>🌿 EcoToken DAO Dashboard</h1>
        <ConnectWallet setSigner={setSigner} setAccount={setAccount} />
      </header>

      <main>
        {signer ? (
          <>
            <RewardUser signer={signer} />
            <AdminPanel signer={signer} />
          </>
        ) : (
          <p>Please connect your wallet to access the dashboard features.</p>
        )}
      </main>
    </div>
  );
}

export default App;
