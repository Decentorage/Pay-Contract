import Web3 from 'web3';

let web3;
try {
    web3 = new Web3(window.web3.currentProvider);
  }
  catch(err) {
    web3 = 'no provider in the current browser pleas consider to install metamask';
  }
// hijack the provider of metamask web3 provider and make it our web3 provider

export default web3;