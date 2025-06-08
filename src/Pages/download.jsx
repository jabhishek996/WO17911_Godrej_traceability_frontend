// // src/pages/ReportPage.jsx
// import React, { useState } from 'react';
// import axios from 'axios';
// import  './CSS/download.css'


// const ReportPage = () => {
//   const [date, setDate] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [reportGenerated, setReportGenerated] = useState(false);
//   const [message, setMessage] = useState('');

//   const handleGenerateReport = async () => {
//     setLoading(true);
//     setMessage('');
//     setReportGenerated(false);

//     try {
//       const response = await axios.post('http://192.168.1.59:7000/api/download/generate-daily-report', {
//         date: date,
//       });

//       if (response.data.success) {
//         setMessage(response.data.message);
//         setReportGenerated(true);
//       } else {
//         setMessage('Failed to generate report.');
//       }
//     } catch (error) {
//       console.error(error);
//       setMessage('Error generating report.');
//     }

//     setLoading(false);
//   };

//   const handleDownloadReport = () => {
//     window.location.href = 'http://192.168.1.59:7000/download/downloadReport';
//   };

//   return (
//     <div style={{ padding: '2rem' }}>
//       <h2>Generate and Download Daily Report</h2>

//       <label>Select Date: </label>
//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//       />
//       <button onClick={handleGenerateReport} disabled={!date || loading}>
//         {loading ? 'Generating...' : 'Generate Report'}
//       </button>

//       <p>{message}</p>

//       <button
//         onClick={handleDownloadReport}
//         disabled={!reportGenerated}
//         style={{ marginTop: '1rem' }}
//       >
//         Download Report
//       </button>
//     </div>
//   );
// };

// export default ReportPage;


// src/pages/ReportPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import  './CSS/download.css'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ReportPage = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [reportGenerated, setReportGenerated] = useState(false);
  const [message, setMessage] = useState('');

  const handleGenerateReport = async () => {
    setLoading(true);
    setMessage('');
    setReportGenerated(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/download/generate-daily-report`, {
        date: date,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setReportGenerated(true);
      } else {
        setMessage('Failed to generate report.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Error generating report.');
    }

    setLoading(false);
  };

  const handleDownloadReport = () => {
    window.location.href = `${API_BASE_URL}/download/downloadReport`;
  };

  return (
    <div className="report-container">
      <div className="report-wrapper">
        <h2>Generate and Download Daily Report</h2>

        <div className="date-input-section">
          <label htmlFor="report-date">Select Date:</label>
          <input
            type="date"
            id="report-date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          className="action-button"
          onClick={handleGenerateReport}
          disabled={!date || loading}
        >
          {loading ? 'Generating...' : 'Generate Report'}
        </button>

        <p className="message">{message}</p>

        <button
          className="action-button"
          onClick={handleDownloadReport}
          disabled={!reportGenerated}
          style={{ marginTop: '16px' }}
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
