import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const About: React.FC = () => {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', padding: '0' }}>
      <section className="container my-5">
        <h2 className="text-center">ABOUT US</h2>
        <div className="row align-items-center my-4">
          <div className="col-md-6 text-center">
            <img
              src="../../src/assets/about_image.png"
              alt="Doctors"
              className="img-fluid"
              style={{ maxWidth: '100%', borderRadius: '10px' }}
            />
          </div>
          <div className="col-md-6">
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Welcome to HeartPulse, your trusted partner in managing your healthcare needs
              conveniently and efficiently. At HeartPulse, we understand the challenges individuals
              face when it comes to scheduling doctor appointments and managing their health
              records.
            </p>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              HeartPulse is committed to excellence in healthcare technology. We continuously strive
              to enhance our platform, integrating the latest advancements to improve user
              experience and deliver superior service. Whether you’re booking your first appointment
              or managing ongoing care, HeartPulse is here to support you every step of the way.
            </p>
            <h4 style={{ marginTop: '20px' }}>Our Vision</h4>
            <p style={{ fontSize: '18px', lineHeight: '1.6' }}>
              Our vision at HeartPulse is to create a seamless healthcare experience for every user.
              We aim to bridge the gap between patients and healthcare providers, making it easier
              for you to access the care you need, when you need it.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-light py-5">
        <div className="container">
          <h3 className="text-center mb-4">WHY CHOOSE US</h3>
          <div className="row text-center">
            <div className="col-md-4">
              <h5>EFFICIENCY</h5>
              <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
            </div>
            <div className="col-md-4">
              <h5>CONVENIENCE</h5>
              <p>Access to a network of trusted healthcare professionals in your area.</p>
            </div>
            <div className="col-md-4">
              <h5>PERSONALIZATION</h5>
              <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;