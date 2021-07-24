import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button } from 'react-bootstrap'
import logo from '../../decentorage_icon.png';
import axios from 'axios';
import web3 from '../contract/web3';
import abi from '../../abi';
import url from '../../url'
import './User.css';


function User() {
    const history = useHistory();
    useEffect(() => {
        if(localStorage.getItem('accessToken') === null){
            history.push('/');
            return;
        }
        getContracts();
        getPenddingContracts();
    }, []);

    const [contracts, setContracts] = useState([]);
    const [pendding, setPendding] = useState([]);
    const [values, setvalues] = useState({
        creatingContractHash:null,
        payingContractHash:null
    });

    function calc(size) {
        size = size/1024/1024;
        var with2Decimals = size.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0]
        return with2Decimals;
    }

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        setContracts([]);
        setPendding([]);
        values.creatingContractHash = null;
        values.payingContractHash = null;
        setvalues(values);
        history.push('/');
    }

    // this function needs to be tested 
    // did not got tested for two reasons first no data 
    // second the api call does a lot of things we do not need for now
    const payForContract = async () => {
        let contract = new web3.eth.Contract(abi, localStorage.getItem('contractAddress'));
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const paylimit = parseInt(localStorage.getItem('price')) + 100000000000000
        await contract.methods.userPay().send({
            from: accounts[0],
            value: paylimit}, 
            function(err, hash){
                if(!err){
                    values.payingContractHash = hash;
                    setvalues(values);
                }
            });
        await web3.eth.getTransactionReceipt(values.payingContractHash);
        axios.get(url + '/user/payContract',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then((response)=>{
              setPendding([]);
          }).catch((error)=>{
              alert("a problem occured with payContract request");
          });   
    }

    const payforCreatingContract = () => {
        var decentorageAddress;
        axios.get(url + '/user/getDecentorageWalletAddress',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then(async (response) => {
            decentorageAddress = response.data["decentorage_wallet_address"]
            await window.ethereum.enable();
            const accounts = await web3.eth.getAccounts();
            // TODO: get the gas price and calculate the value of the contract deployment
            await web3.eth.sendTransaction(
                {to:decentorageAddress,
                from:accounts[0],
                value: 6000000000000000},
                function(err, Hash){
                    if (!err) {
                        values.creatingContractHash = Hash
                        setvalues(values)
                    }
                  });
            await web3.eth.getTransactionReceipt(values.creatingContractHash);
            axios.post(url + '/user/verifyTransaction',{
                transactionHash: values.creatingContractHash
                },{
                headers: {
                    'token': `${localStorage.getItem('accessToken')}`
                }
            }).then((response)=>{

            }).catch((error)=>{
                alert("could not verify the transaction");
            });
        }).catch((error)=>{
            alert("a problem happened while dealing with the transaction");
        })
    }

    const getContracts = () => {
        axios.get(url + '/user/getFiles',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then((response) => {
            const contracts = response.data;
            // setContracts(contracts);
            const itemRows = [];
            for (let contract of contracts) {
              const row = (
                <Row className="row2">
                    <Col sm={3} className="cell" data-title="filename">
                        {contract.filename}
                    </Col>
                    <Col sm={3} className="cell" data-title="size (in KB)">
                        {calc(contract.size)}
                    </Col>
                    <Col sm={3} className="cell" data-title="download count">
                        {contract.download_count}
                    </Col>
                    <Col sm={3} className="cell" data-title="duration in months">
                        {contract.duration_in_months}
                    </Col>
                </Row>
                
              );
              itemRows.push(row);
            };
            setContracts(itemRows);
        }).catch(error => {
            alert("could not fetch the active contracts");
        });
    }

    const getPenddingContracts = () => {
        axios.get(url + '/user/getContract',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then((response) => {
            const contract = response.data;
            localStorage.setItem('contractAddress', response.data["contract_address"])
            localStorage.setItem('price', response.data["price"])
            const row = (
            <Row className="row2">
                <Col sm={6} className="cell" data-title="filename">
                    {contract.filename}
                </Col>
                <Col sm={6} className="cell" data-title="pay button">
                    <Button className="user-button" onClick={payForContract}>pay for this file contract</Button>
                </Col>
            </Row>
            );
            setPendding(row);
        }).catch(error => {
            alert("there is no pending contracts");
        });
    }

    return (
        <>
        <Navbar className = "Navbar">
            <Container fluid>
                <Row>
                    <Col xl={1} lg={2} md={2} sm={3} ><img src={logo} alt="Logo" className='logo'/></Col>
                    <Col sm={2}><h1 className="logoName">Decentorage</h1></Col>
                    <Col xl={8} lg={6} md={5} sm={4}></Col>
                    <Col xl={1} lg={2} sm={3} className='logout-col'>
                        <Button size="lg" onClick={logOut} className="user-button">Log out</Button>
                    </Col>
                </Row>
            </Container>
        </Navbar>
        <Row>
            <Col sm={6}>
                <div className="pay-for-contract-button-container">
                    <h3>{localStorage.getItem('username')}</h3>
                </div>
            </Col>
            <Col sm={6}>
                <div className="pay-for-contract-button-container">
                    <Button size="lg" className="user-button" onClick={payforCreatingContract}>Buy seeds</Button>
                </div>
            </Col>
        </Row>
        <div className="wrapper">
            <div className="table">
                <Row className="row2 header">
                    <Col sm={6} className="cell">
                        Filename
                    </Col>
                    <Col sm={6} className="cell">
                        Pay button
                    </Col>
                </Row>
                
                {pendding}
                
            </div>
            
            <div className="table">
                <Row className="row2 header Navy-blue">
                    <Col sm={3} className="cell">
                        Filename
                    </Col>
                    <Col sm={3} className="cell">
                        Size (in MB)
                    </Col>
                    <Col sm={3} className="cell">
                        Download count
                    </Col>
                    <Col sm={3} className="cell">
                        Duration in months
                    </Col>
                </Row>
                
                {contracts}

            </div>
        </div>
        </>
    );
}

export default User;