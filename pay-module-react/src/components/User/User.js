import { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button, Table } from 'react-bootstrap'
import logo from '../../decentorage.png';
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
        getContracts()
        getPenddingContracts()
    }, []);

    const [contracts, setContracts] = useState([]);
    const [pendding, setPendding] = useState([]);
    const [values, setvalues] = useState({
        loggedout:false,
        creatingContractHash:null,
        payingContractHash:null
    });

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        history.push('/');
    }

    // this function needs to be tested 
    // did not got tested for two reasons first no data 
    // second the api call does a lot of things we do not need for now
    const payForContract = async (contractAddress, payLimit) => {
        let contract = new web3.eth.Contract(abi, contractAddress);
        const accounts = await web3.eth.getAccounts();
        await contract.methods.userPay().send({
        from: accounts[0],
        value: payLimit
        }, function(err, hash){
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

          }).catch((error)=>{

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
            const accounts = await web3.eth.getAccounts();
            // TODO: get the gas price and calculate the value of the contract deployment
            await web3.eth.sendTransaction(
                {to: decentorageAddress,
                from: accounts[0],
                value: 6000000},
                function(err, Hash){
                    if (!err) {
                        values.creatingContractHash = Hash
                        setvalues(values)
                    }
                      
                  });
            axios.post(url + '/user/verifyTransaction',{
                transactionHash: values.creatingContractHash
                },{
                headers: {
                    'token': `${localStorage.getItem('accessToken')}`
                }
            }).then((response)=>{

            }).catch((error)=>{

            });
        }).catch((error)=>{

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
                <tr key={contract.id}>
                    <td key={1}>{contract.filename}</td>
                    <td key={2}>{contract.size}</td>
                    <td key={3}>{contract.download_count}</td>
                    <td key={4}>{contract.duration_in_months}</td>
                </tr>
              );
              itemRows.push(row);
            }
            setContracts(itemRows);
        }).catch(error => {
            setContracts([]);
        });
    }

    const getPenddingContracts = () => {
        axios.get(url + '/user/getContract',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then((response) => {
            const contract = response.data;
            // setPendding(contracts);
            const row = (
            <tr key={contract.id}>
                <td key={5}>{contract.filename}</td>
                <td key={6}><Button onClick={() => payForContract(contract.contract_addresss, contract.price)}>pay for this file contract</Button></td>
            </tr>
            );
            setPendding(row);
        }).catch(error => {
            setPendding([]);
        });
    }

    return (
        <>
        <Navbar className = "Navbar">
            <Container fluid>
                <Row>
                    <Col sm={3}><img src={logo} alt="Logo" className='logo'/></Col>
                    <Col sm={7}></Col>
                    <Col sm={2} className='logout-col'>
                        <Button size="lg" onClick={logOut} className="logout-button">log out</Button>
                    </Col>
                </Row>
            </Container>
        </Navbar>
        <div className="pay-for-contract-button-container">
            <Button size="lg" className="pay-for-contract-button" onClick={payforCreatingContract}>pay for contract</Button>
        </div>
        <Row>
            <Col sm={12}>
                <Table striped bordered hover variant="dark">
                    <tr>
                        <th>filename</th>
                        <th>pay button</th>
                    </tr>
                    {pendding}
                </Table>
            </Col>
        </Row>
        <Row>
            <Col sm={12}>
                <Table striped bordered hover variant="dark">
                    <tr>
                        <th>filename</th>
                        <th>size (in KB)</th>
                        <th>download count</th>
                        <th>duration in months</th>
                    </tr>
                    {contracts}
                </Table>
            </Col>
        </Row>
        {values.loggedout && <Redirect to='/signin'/>}
        </>
        
    );
}

export default User;