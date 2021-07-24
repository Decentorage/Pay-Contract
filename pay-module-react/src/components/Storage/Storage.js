import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button } from 'react-bootstrap'
import logo from '../../decentorage_icon.png';
import axios from 'axios';
import url from '../../url';
//import './Storage.css';


function Storage() {
    const history = useHistory();
    let availability = 0;
    useEffect(() => {
        if(localStorage.getItem('accessToken') === null){
            history.push('/');
            return;
        }
        getContracts();
    }, []);

    const [contracts, setContracts] = useState([]);

    const logOut = (event) => {
        event.preventDefault();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('username');
        setContracts([]);
        history.push('/');
    }

    const getContracts = () => {
        axios.get(url + '/storage/getStorageInfo',{
            headers: {
              'token': `${localStorage.getItem('accessToken')}`
            }
          }).then((response) => {
            const contracts = response.data["contracts_info"];
            availability = response.data["availability"];
            // setContracts(contracts);
            const itemRows = [];
            for (let contract of contracts) {
                console.log(contract.shard_id)
                const row = (
                <Row className="row2">
                    <Col sm={3} className="cell" data-title="filename">
                        <p>{contract.shard_id}</p>
                    </Col>
                    <Col sm={3} className="cell" data-title="size (in KB)">
                        <p>{contract.payment_per_interval}</p>
                    </Col>
                    <Col sm={3} className="cell" data-title="download count">
                        <p>{contract.payment_left}</p>
                    </Col>
                    <Col sm={3} className="cell" data-title="duration in months">
                        <p>{contract.next_payment_date}</p>
                    </Col>
                </Row>
              );
              itemRows.push(row);
            };
            setContracts(itemRows);
        }).catch(error => {
            setContracts([]);
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
                    <h3>availability: {availability}</h3>
                </div>
            </Col>
        </Row>
        <div className="wrapper">
            <div className="table">
                <Row className="row2 header Navy-blue">
                    <Col sm={3} className="cell">
                        <p>Filename</p>
                    </Col>
                    <Col sm={3} className="cell">
                        <p>payment per week (wei)</p>
                    </Col>
                    <Col sm={3} className="cell">
                        <p>payment left</p>
                    </Col>
                    <Col sm={3} className="cell">
                        <p>next payment date</p>
                    </Col>
                </Row>
                
                {contracts}

            </div>
        </div>
        </>
    );
}

export default Storage;