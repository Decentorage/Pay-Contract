const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode } = require('./compile');

const provider = new HDWalletProvider (
    'shallow what car cycle list attitude life melody heavy into skull weekend',
    'https://rinkeby.infura.io/v3/ce82784002a74166a87fe8556d5b1fe9'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('Attempting to deploy from account', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: [499, 100]})    //the arguments should be sent to  the contract constructor
        .send({gas: '1000000', from: accounts[0]});

    console.log(interface);
    console.log('Contract deployed to', result.options.address);
};
deploy();