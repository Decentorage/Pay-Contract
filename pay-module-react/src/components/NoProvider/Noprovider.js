import { Navbar, Container, Row, Col } from 'react-bootstrap';
import logo from '../../decentorage_icon.png';

function NoProvider() {
    return (
        <>
        <Navbar className = "Navbar">
            <Container fluid>
                <Row>
                    <Col xl={1} lg={2} md={2} sm={3} ><img src={logo} alt="Logo" className='logo'/></Col>
                    <Col sm={2}><h1 className="logoName">Decentorage</h1></Col>
                </Row>
            </Container>
        </Navbar>
        
        <h1>there is no provider please consider to installing metamask extension in your browser</h1>
        </>
    )
}

export default NoProvider;