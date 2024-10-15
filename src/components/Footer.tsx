import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'

function Footer() {
  return (
    <div style={{ backgroundColor: '#003366', color: '#FFF', padding: '3rem 0', marginTop: '3rem' }}>
                <Container>
          <Row>
            <Col md={4}>
              <p>Simply browse through our extensive list of trusted doctors, schedule your appointment hassle-free.</p>
            </Col>
            <Col md={4}>
              <h5>Company</h5>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                <li><a href="/about" style={{ color: '#FFF', textDecoration: 'none' }}>About us</a></li>
                <li><a href="/contact" style={{ color: '#FFF', textDecoration: 'none' }}>Contact us</a></li>
                <li><a href="/privacy-policy" style={{ color: '#FFF', textDecoration: 'none' }}>Privacy policy</a></li>
              </ul>
            </Col>
            <Col md={4}>
              <h5>Get in Touch</h5>
              <p>+94-112-965-301</p>
              <p>healthcare@gmail.com</p>
            </Col>
          </Row>
          <hr style={{ backgroundColor: '#FFF', margin: '2rem 0' }} />
          <div style={{ textAlign: 'center' }}>
            <p>&copy; 2024 CSSE - All Right Reserved.</p>
          </div>
        </Container>
    </div>
  )
}

export default Footer