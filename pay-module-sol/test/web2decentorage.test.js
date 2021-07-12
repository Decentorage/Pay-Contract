const assert = require('assert');    //assertion
const ganache = require('ganache-cli'); //ganache creates local test network for testing
const Web3 = require('web3')    //constructor
const web3 = new Web3(ganache.provider());      //provider to connect to some network

const {interface, bytecode} = require('../compile');
const paymentDate = 1625870900
var paymentDates = [1625870900, 1625870900, 1625870900, 1625870900];

let web2decentorage;
let accounts;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //console.log(accounts);

    //deploy to ganache network the contract
    web2decentorage = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data:bytecode , arguments: [499,100]})
        .send({from: accounts[0], gas: '1000000'});
});

describe('web2decentorage', ()=>{

    it('deploy a contract', async () => {
        //this assertion to make sure that the contract has address so it has been deployed
        //also the address indicates the address that where the contract has been deployed in the network
        assert.ok(web2decentorage.options.address);
        assert.equal(accounts[0], await web2decentorage.methods.getDecentorage().call({
            from: accounts[0]
        }))
    });

    it('user will enter the contract and pay for storage', async () => {
        await web2decentorage.methods.userPay().send({
            from: accounts[1],
            value: 500
        });

        assert.equal(accounts[1], await web2decentorage.methods.getwebUser().call({
            from: accounts[0]
        }))
    });

    it('a storage node will be part of this contract and be added as one of the storage nodes that stores the data', async() => {
        await web2decentorage.methods.addStorageNode(accounts[1]).send({
            from: accounts[0]
        });

        await web2decentorage.methods.addPaymentDate(accounts[1]).send({
            from: accounts[0]
        });

        var storageNodes = await web2decentorage.methods.getStorageNodes().call({
            from: accounts[0]
        });

        assert.equal(accounts[1],storageNodes[0]);
    });

    it('checking the contract balance after a user pay', async() => {
        await web2decentorage.methods.userPay().send({
            from: accounts[1],
            value: 500
        });

        const balance = await web2decentorage.methods.getBalance().call({
            from: accounts[0]
        });

        assert.equal(balance,500);
    });

    it('paying a storage node after getting paid by a user', async() => {
        console.log(await web3.eth.getBalance(accounts[1]));
        await web2decentorage.methods.userPay().send({
            from: accounts[1],
            value: 500
        });
        console.log(await web3.eth.getBalance(accounts[1]));

        var balance = await web2decentorage.methods.getBalance().call({
            from: accounts[0]
        });
        assert.equal(balance, 500);

        await web2decentorage.methods.addStorageNode(accounts[1]).send({
            from: accounts[0]
        });
       
        await web2decentorage.methods.addPaymentDate(0).send({
            from: accounts[0]
        });

        await web2decentorage.methods.payStorageNode(accounts[1]).send({
            from: accounts[1]
        });
        
        balance = await web2decentorage.methods.getBalance().call({
            from: accounts[0]
        });
        assert.equal(balance, 400);
    });

    it('adding and deleting storage nodes', async () => {
        await web2decentorage.methods.addStorageNode(accounts[1]).send({
            from: accounts[0]
        });

        await web2decentorage.methods.addPaymentDate(0).send({
            from: accounts[0]
        });

        await web2decentorage.methods.addStorageNode(accounts[2]).send({
            from: accounts[0]
        });

        await web2decentorage.methods.addPaymentDate(0).send({
            from: accounts[0]
        });

        var storageNodes = await web2decentorage.methods.getStorageNodes().call({
            from: accounts[0]
        });

        var paymentDates = await web2decentorage.methods.getPaymentDates().call({
            from: accounts[0]
        });

        assert.equal(2, paymentDates.length);
        assert.equal(2, storageNodes.length);
        assert.equal(accounts[1], storageNodes[0]);
        assert.equal(accounts[2], storageNodes[1]);

        await web2decentorage.methods.deletePaymentDate(accounts[1]).send({
            from: accounts[0]
        });

        await web2decentorage.methods.deleteStorageNode(accounts[1]).send({
            from: accounts[0]
        });

        storageNodes = await web2decentorage.methods.getStorageNodes().call({
            from: accounts[0]
        });

        paymentDates = await web2decentorage.methods.getPaymentDates().call({
            from: accounts[0]
        });

        assert.equal(1, paymentDates.length);
        assert.equal(1, storageNodes.length);
        assert.equal(accounts[2], storageNodes[0]);
    });

    it('swap a storage node with another', async () => {
        await web2decentorage.methods.addStorageNode(accounts[1]).send({
            from: accounts[0]
        });

        await web2decentorage.methods.addPaymentDate(0).send({
            from: accounts[0]
        });

        await web2decentorage.methods.swapStorageNode(accounts[1], accounts[2], 0).send({
            from: accounts[0]
        })

        var storageNodes = await web2decentorage.methods.getStorageNodes().call({
            from: accounts[0]
        });

        assert.equal(accounts[2], storageNodes[0])
    });

    it('checking for payment require is working (this test should always revert)', async() => {
        await web2decentorage.methods.userPay().send({
            from: accounts[1],
            value: 500
        });

        await web2decentorage.methods.addStorageNode(accounts[1]).send({
            from: accounts[0]
        });
       
        await web2decentorage.methods.addPaymentDate(604800).send({
            from: accounts[0]
        });

        await web2decentorage.methods.payStorageNode(accounts[1]).send({
            from: accounts[1]
        });
    });
});