import React, { useState } from 'react';
import { parseUnits } from 'ethers';
import EcoToken from '../EcoToken.json';

const RewardUser = ({ signer, contractAddress }) => {
  const [user, setUser] = useState('');
  const [amount, setAmount] = useState('');
  const [activity, setActivity] = useState('');
  const [status, setStatus] = useState('');

  const handleReward = async () => {
    if (!signer || !user || !amount || !activity) {
      setStatus("Please fill all fields and connect wallet.");
      return;
    }

    try {
      const contract = new signer.provider.Contract(contractAddress, EcoToken.abi, signer);

      const formattedAmount = parseUnits(amount, 18); // Convert to 18 decimals

      const tx = await contract.rewardUser(user, formattedAmount, activity);
      await tx.wait();

      setStatus(`✅ Rewarded ${amount} ECO to ${user} for "${activity}".`);
    } catch (error) {
      console.error(error);
      setStatus("❌ Error rewarding user.");
    }
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Reward User for Eco-Activity</h3>
      <input
        type="text"
        placeholder="User wallet address"
        value={user}
        onChange={(e) => setUser(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Amount of ECO tokens"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      /><br />
      <input
        type="text"
        placeholder="Activity type (e.g. Recycling)"
        value={activity}
        onChange={(e) => setActivity(e.target.value)}
      /><br />
      <button onClick={handleReward}>Reward</button>
      <p>{status}</p>
    </div>
  );
};

export default RewardUser;
