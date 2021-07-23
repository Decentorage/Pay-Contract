import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Navbar, Container, Row, Col, Button } from 'react-bootstrap'
import logo from '../../decentorage_icon.png';
import axios from 'axios';
import url from '../../url';
//import './Storage.css';


function Storage() {
    const history = useHistory();
    useEffect(() => {
        if(localStorage.getItem('accessToken') === null){
            history.push('/');
            return;
        }
        getContracts();
        alert("you have signed in");
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
                <div className="row2">
                    <div className="cell" data-title="filename">
                        {contract.filename}
                    </div>
                    <div className="cell" data-title="size (in KB)">
                        {contract.size}
                    </div>
                    <div className="cell" data-title="download count">
                        {contract.download_count}
                    </div>
                    <div className="cell" data-title="duration in months">
                        {contract.duration_in_months}
                    </div>
                </div>
                
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
            <Col sm={12}>
                <div className="pay-for-contract-button-container">
                    <h3>{localStorage.getItem('username')}</h3>
                </div>
            </Col>
        </Row>
        <div className="wrapper">
            <div className="table">
                <div className="row2 header Navy-blue">
                    <div className="cell">
                        Filename
                    </div>
                    <div className="cell">
                        Size (in KB)
                    </div>
                    <div className="cell">
                        Download count
                    </div>
                    <div className="cell">
                        Duration in months
                    </div>
                </div>
                
                {contracts}

            </div>
        </div>
        </>
    );
}

export default Storage;