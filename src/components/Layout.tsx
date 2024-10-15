import React, { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Container } from 'react-bootstrap'; // Bootstrap's container for responsiveness

// Define the prop types for the Layout component
interface LayoutProps {
  navbar?: boolean;
  children: ReactNode; // ReactNode to type children prop
}

const Layout: React.FC<LayoutProps> = ({ navbar = true, children }) => {
  
  // Inject custom styles directly into the document head
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      /* Custom styles for Layout component */
      .main-content {
        min-height: calc(100vh - 150px); /* Adjust height minus header/footer */
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 20px;
      }

      /* Media query for mobile devices */
      @media (max-width: 768px) {
        .main-content {
          padding: 15px; /* Reduce padding for mobile screens */
        }
      }

      @media (max-width: 576px) {
        .main-content {
          padding: 10px; /* Further reduce padding for very small screens */
        }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <>
      {/* Conditionally render the Navbar */}
      {navbar && <Navbar />}

      {/* Main content area with responsive container */}
      <Container fluid className="main-content">
        {children}
      </Container>

      <Footer />
    </>
  );
};

export default Layout;
