import React, { useState } from 'react';
import { getContract } from '../utils/contract';

const AdminPanel = ({ signer }) => {
  const [validator, setValidator] = useState('');

  const handleAddValidator = async () => {
    const contract = getContract(signer);
    const tx = await contract.addValidator(validator);
    await tx.wait();
    alert('Validator added');
  };

  const handleRemoveValidator = async () => {
    const contract = getContract(signer);
    const tx = await contract.removeValidator(validator);
    await tx.wait();
    alert('Validator removed');
  };

  return (
    <div>
      <h3>Admin Panel</h3>
      <input placeholder="Validator Address" onChange={(e) => setValidator(e.target.value)} />
      <button onClick={handleAddValidator}>Add Validator</button>
      <button onClick={handleRemoveValidator}>Remove Validator</button>
    </div>
  );
};

export default AdminPanel;
