import React from 'react';
import './CSS/about.css';
import DBStatusIndicator from '../Components/DBConnection_Status/Db_Status';

const About = () => {
  return (
    <div className="about-sec">
      <DBStatusIndicator />
      <h1>About Us</h1>
      

      <p>
        <strong>Multiquadrant Industrial Controls (I) Pvt. Ltd.</strong> is at the forefront of industrial automation, delivering intelligent control and automation solutions aligned with Industry 4.0. We specialize in designing, developing, and integrating advanced control systems that drive smarter, more connected, and efficient manufacturing environments.
      </p>

      <p>
        With a future-forward approach and deep technical expertise, we help industries transition towards digitally enabled operations, combining IoT, real-time data analytics, AI-driven monitoring, and cyber-physical systems.
      </p>

      <section>
        <h2>Our Mission</h2>
        <p>
          To accelerate industrial transformation through innovative automation and smart control solutions, ensuring enhanced connectivity, productivity, and decision-making capabilities for our clients.
        </p>
      </section>

      <section>
        <h2>Our Vision</h2>
        <p>
          To be a leading force in India’s Industry 4.0 revolution by delivering scalable and intelligent industrial automation systems that define the factories of the future.
        </p>
      </section>

      <section>
        <h2>Our Industry 4.0-Centric Offerings</h2>
        <ul>
          <li>⚙️ <strong>Smart PLC & SCADA Integration:</strong> Real-time process control and monitoring with integrated analytics dashboards.</li>
          <li>🌐 <strong>Industrial IoT (IIoT) Solutions:</strong> Sensor-based data acquisition and remote machine monitoring using edge and cloud platforms.</li>
          <li>📊 <strong>Data-Driven Insights & Predictive Maintenance:</strong> Improve uptime and reduce costs using predictive algorithms and trend analysis.</li>
          <li>🔗 <strong>Connectivity & Interoperability:</strong> OPC-UA, MQTT, and other protocols for seamless machine-to-system communication.</li>
          <li>🛠️ <strong>Customized Automation Systems:</strong> Scalable systems for batch, continuous, or hybrid process control.</li>
        </ul>
      </section>

      <section>
        <h2>Why Choose Multiquadrant?</h2>
        <ul>
          <li>✅ <strong>Industry 4.0 Alignment:</strong> Our systems are built for connectivity, adaptability, and intelligence.</li>
          <li>✅ <strong>Domain Expertise:</strong> Serving manufacturing, chemical, automotive, and energy sectors with tailor-made solutions.</li>
          <li>✅ <strong>Innovation-Driven:</strong> Continuously integrating smart sensors, wireless modules, AI, and cloud technologies.</li>
          <li>✅ <strong>Client-Centric Approach:</strong> We focus on real pain points and deliver measurable ROI with every deployment.</li>
        </ul>
      </section>

      <p className="final-message">
        Multiquadrant Industrial Controls (I) Pvt. Ltd. is not just about automation — we empower smart factories and redefine industrial performance in a connected world.
      </p>
    </div>
  );
};

export default About;
