import { useState, useEffect } from 'react';
import { Navbar, Container, Row, Col, Button } from 'react-bootstrap'
import logo from '../../decentorage.png';
import web3 from '../contract/web3';
import './User.css';


function User() {
    useEffect(() => {
        getContracts()
    }, []);

    const [contracts, setContracts] = useState([]);

    const logOut = () => {

    }

    const payforCreatingContract = async () => {
        // TODO: request for an address for decentorage addresss
        const accounts = await web3.eth.getAccounts();
        web3.eth.sendTransaction({to: '0x0ffAF5741968f1865656a0f435d40b59CC872A6d', from: accounts[0], value: 500000000000000000});
    }

    // TODO: this function should be async
    const getContracts = () => {
        // request to contracts active and requested
        const contracts = ["contract1", "contract2", "contract3"];
        setContracts(contracts);
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
            <Col sm={6}>{contracts.map(contract => (<h1>{contract}</h1>))}</Col>
            <Col sm={6}>{contracts.map(contract => (<h1>{contract}</h1>))}</Col>
        </Row>
        </>
    );
}

export default User;