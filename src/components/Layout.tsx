import React, { ReactNode } from 'react';
import Navbar from './Navbar';

// Define the prop types for the Layout component
interface LayoutProps {
  navbar?: boolean;
  children: ReactNode; // ReactNode to type children prop
}

const Layout: React.FC<LayoutProps> = ({ navbar = true, children }) => {
  return (
    <>
      {/* Conditionally render the Navbar */}
      {navbar && <Navbar />}

      {/* Main content area with margin */}
      <div >{children}</div>
    </>
  );
};

export default Layout;
