import { ethers } from 'ethers';
import EcoToken from '../EcoToken.json';

const contractAddress = '0x5B38Da6a701c568545dCfcB03FcB875f56beddC4'; // Replace with real address

export const getContract = (providerOrSigner) => {
  return new ethers.Contract(contractAddress, EcoToken.abi, providerOrSigner);
};
