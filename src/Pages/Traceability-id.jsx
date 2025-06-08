// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "./CSS/BatteryTables.css"; // Add styles for borders, etc.

// const BatteryTable = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get("http://localhost:3001/api/table-data") // replace with your API
//       .then(res => setData(res.data))
//       .catch(err => console.error(err));
//   }, []);

//   const mergedIndices = (key) => {
//     const map = {};
//     data.forEach((row, idx) => {
//       if (!map[row[key]]) {
//         map[row[key]] = { start: idx, count: 1 };
//       } else {
//         map[row[key]].count += 1;
//       }
//     });
//     return map;
//   };

//   const batteryIDMap = mergedIndices("Battery ID");
//   const ocvMap = mergedIndices("Battery OCV");

//   return (
//     <div className="table-container">
//       <table className="battery-table">
//         <thead>
//           <tr>
//             <th rowSpan={2}>Sr. Nos</th>
//             <th rowSpan={2}>Battery ID</th>
//             <th rowSpan={2}>Battery OCV</th>
//             <th rowSpan={2}>Cell ID</th>
//             <th colSpan={4}>Testing Parameters</th>
//             <th colSpan={3}>Filling Parameters</th>
//             <th colSpan={2}>Assembly Parameters</th>
//           </tr>
//           <tr>
//             <th>Testing Time</th>
//             <th>OCV</th>
//             <th>IR</th>
//             <th>HRD</th>
//             <th>Filling Date & Time</th>
//             <th>Dry Weight</th>
//             <th>Filled Qty</th>
//             <th>Jelly Roll Weight</th>
//             <th>Jelly Roll Dia</th>
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((row, idx) => (
//             <tr key={idx}>
//               <td>{row["Sr. Nos"]}</td>

//               {/* Battery ID Merging */}
//               {batteryIDMap[row["Battery ID"]]?.start === idx && (
//                 <td rowSpan={batteryIDMap[row["Battery ID"]].count}>
//                   {row["Battery ID"]}
//                 </td>
//               )}

//               {/* Battery OCV Merging */}
//               {ocvMap[row["Battery OCV"]]?.start === idx && (
//                 <td rowSpan={ocvMap[row["Battery OCV"]].count}>
//                   {row["Battery OCV"]}
//                 </td>
//               )}

//               <td>{row["cell ID"]}</td>
//               <td>{row["Testing time"]}</td>
//               <td>{row["OCV"]}</td>
//               <td>{row["IR"]}</td>
//               <td>{row["HRD"]}</td>
//               <td>{row["filling date and time"]}</td>
//               <td>{row["Dry weight"]}</td>
//               <td>{row["Filled qty"]}</td>
//               <td>{row["Jelly roll weight"]}</td>
//               <td>{row["Jelly roll dia"]}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default BatteryTable;

// import React, { useState } from "react";
// import axios from "axios";
// import "./CSS/BatteryTables.css";

// const BatteryTable = () => {
//   const [data, setData] = useState([]);
//   const [batteryOCV, setBatteryOCV] = useState("");
//   const [manufacturedTime, setManufacturedTime] = useState("");
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const [searchInput, setSearchInput] = useState("BAT1233");
//   const [searchType, setSearchType] = useState("battery");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [electrodeData, setElectrodeData] = useState([]);

//   const fetchData = async (id) => {
//     setLoading(true);
//     setError("");
//     setLoginSuccess(false);
//     setData([]);
//     setBatteryOCV("");
//     setManufacturedTime("");
//     setElectrodeData([]);

//     const startTime = Date.now();

//     try {
//       const loginRes = await axios.post(
//         "http://192.168.1.32:5000/api/login",
//         { username: "abhishek", password: "1234" },
//         { withCredentials: true }
//       );

//       if (loginRes.data.success !== true) {
//         setError("Login failed: Invalid credentials");
//         return;
//       }

//       setLoginSuccess(true);

//       const endpoint =
//         searchType === "battery"
//           ? "http://192.168.1.32:5000/api/trace/battery-id"
//           : "http://192.168.1.32:5000/api/trace/cell-id";

//       const traceRes = await axios.post(
//         endpoint,
//         searchType === "battery" ? { battery_id: id } : { cell_id: id },
//         { withCredentials: true }
//       );

//       const trace = traceRes.data.trace;

//       if (!trace || !trace.cell_data) {
//         setError("No data found.");
       
//         return;
//       }

//       const formattedData = trace.cell_data.map((cell, index) => {
//         const cellData = cell.data || {};
//         return {
//           "Sr. Nos": index + 1,
//           "Battery ID": trace.battery_id || "Null",
//           "Battery OCV": trace.battery_ocv || "Null",
//           "Manufactured Time": new Date(trace.manufactured_timestamp).toLocaleString() || "Null",
//           "cell ID": cell.cell_id || "Null",
//           "Testing time": cellData.testing_timestamp 
//             ? new Date(cellData.testing_timestamp).toLocaleString()
//             : "",
//           "OCV": cellData.cell_ocv || "Null",
//           "IR": cellData.cell_ir || "Null",
//           "HRD": cellData.cell_hrd || "Null",
//           "filling date and time": cellData.filling_datetime
//             ? new Date(cellData.filling_datetime).toLocaleString()
//             : "Null",
//           "Dry weight": cellData.dry_weight || "Null",
//           "Filled qty": cellData.filled_weight || "Null",
//           "Jelly roll weight": cellData.jelly_roll_wt || "Null",
//           "Jelly roll dia": cellData.jelly_roll_dia || "Null",
//         };
//       });

//       const electrodeFormatted = trace.cell_data.flatMap((cell, cellIndex) => {
//         const electrodeDataArray = cell.electrode_data || [];

//         return electrodeDataArray.map((item, index) => {
//           const isAnode = item.anode_data !== undefined;
//           const ele = isAnode ? item.anode_data : item.cathode_data;

//           if (!ele) return null;

//           return {
//             Sr: cellIndex * 2 + index + 1,
//             Cell_ID: cell.cell_id || "Null",
//             Type: isAnode ? "Anode" : "Cathode" || "Null",
//             electrode_id: ele.electrode_id || "Null",
//             weight: ele.weight || "Null",
//             moisture: ele.moisture || "Null",
//             thickness: ele.thickness || "Null",
//             density: ele.density || "Null",
//             IR_temp_1: ele.IR_temp_1 || "Null",
//             IR_Temp_2: ele.IR_Temp_2 || "Null",
//             chain_speed: ele.chain_speed || "Null",
//             zone_temp_1: ele.zone_temp_1 || "Null",
//             zone_temp_2: ele.zone_temp_2 || "Null",
//             humidity: ele.humidity || "Null",
//           };
//         });
//       }).filter(Boolean);

//       setBatteryOCV(trace.battery_ocv);
//       setManufacturedTime(trace.manufactured_timestamp);
//       setData(formattedData);
//       setElectrodeData(electrodeFormatted);

//     } catch (err) {
//        setLoading(false);
//       setError("Error fetching data: " + err.message);
      
//       console.error(err);
      
//     } finally {
//       const elapsedTime = Date.now() - startTime;
//       const remainingTime = 2000 - elapsedTime;
//       if (remainingTime > 0) {
//         setTimeout(() => setLoading(false), remainingTime);
//       } else {
//         setLoading(false);
//       }
//     }
//   };

//   const mergedIndices = (key) => {
//     const map = {};
//     data.forEach((row, idx) => {
//       if (!map[row[key]]) {
//         map[row[key]] = { start: idx, count: 1 };
//       } else {
//         map[row[key]].count += 1;
//       }
//     });
//     return map;
//   };

//   const batteryIDMap = mergedIndices("Battery ID");
//   const ocvMap = mergedIndices("Battery OCV");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchInput.trim()) {
//       setError("Please enter an ID");
//       return;
//     }
//     fetchData(searchInput.trim());
//   };

//   return (
//     <div className="table-container">
//       <h3>Battery Trace Data</h3>

//       <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           style={{ padding: "0.5rem", marginRight: "0.5rem" }}
//         >
//           <option value="battery">Battery ID</option>
//           <option value="cell">Cell ID</option>
//         </select>

//         <input
//           type="text"
//           placeholder={`Enter ${searchType === "battery" ? "Battery" : "Cell"} ID`}
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           style={{ padding: "0.5rem", fontSize: "1rem", width: "200px", border: "none" }}
//         />

//         <button className="search_btn" type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Search"}
//         </button>
//       </form>

//       {loading && (
//         <div style={{ textAlign: "center", margin: "20px 0" }}>
//           <img src="/Animation_searching_pages.gif" alt="Loading..." width="300" style={{mixBlendMode:"multiply"}} />
//           <p>Loading data, please wait...</p>
//         </div>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loginSuccess && !loading && !error && (
        
//         <p>🔒 Please search for an ID to see data.</p>
//       )}

//       {loginSuccess && !loading && !error && data.length > 0 && (
//         <>
//           <p><strong>Battery OCV:</strong> {batteryOCV}</p>
//           <p><strong>Manufactured Time:</strong> {new Date(manufacturedTime).toLocaleString()}</p>

//           <table className="battery-table">
//             <thead>
//               <tr>
//                 <th rowSpan={2}>Sr. Nos</th>
//                 <th rowSpan={2}>Battery ID</th>
//                 <th rowSpan={2}>Battery OCV</th>
//                 <th rowSpan={2}>Cell ID</th>
//                 <th colSpan={4}>Testing Parameters</th>
//                 <th colSpan={3}>Filling Parameters</th>
//                 <th colSpan={2}>Assembly Parameters</th>
//               </tr>
//               <tr>
//                 <th>Testing Time</th>
//                 <th>OCV</th>
//                 <th>IR</th>
//                 <th>HRD</th>
//                 <th>Filling Date & Time</th>
//                 <th>Dry Weight</th>
//                 <th>Filled Qty</th>
//                 <th>Jelly Roll Weight</th>
//                 <th>Jelly Roll Dia</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row["Sr. Nos"]}</td>
//                   {batteryIDMap[row["Battery ID"]]?.start === idx && (
//                     <td rowSpan={batteryIDMap[row["Battery ID"]].count}>{row["Battery ID"]}</td>
//                   )}
//                   {ocvMap[row["Battery OCV"]]?.start === idx && (
//                     <td rowSpan={ocvMap[row["Battery OCV"]].count}>{row["Battery OCV"]}</td>
//                   )}
//                   <td>{row["cell ID"]}</td>
//                   <td>{row["Testing time"]}</td>
//                   <td>{row["OCV"]}</td>
//                   <td>{row["IR"]}</td>
//                   <td>{row["HRD"]}</td>
//                   <td>{row["filling date and time"]}</td>
//                   <td>{row["Dry weight"]}</td>
//                   <td>{row["Filled qty"]}</td>
//                   <td>{row["Jelly roll weight"]}</td>
//                   <td>{row["Jelly roll dia"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>

//           <h3 style={{ marginTop: "2rem" }}>Electrode Data (Anode / Cathode)</h3>
//           <table className="battery-table">
//             <thead>
//               <tr>
//                 <th>Sr</th>
//                 <th>Cell Id</th>
//                 <th>Type</th>
//                 <th>Electrode ID</th>
//                 <th>Weight</th>
//                 <th>Moisture</th>
//                 <th>Thickness</th>
//                 <th>Density</th>
//                 <th>IR Temp 1</th>
//                 <th>IR Temp 2</th>
//                 <th>Chain Speed</th>
//                 <th>Zone Temp 1</th>
//                 <th>Zone Temp 2</th>
//                 <th>Humidity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {electrodeData.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row.Sr}</td>
//                   <td>{row.Cell_ID}</td>
//                   <td>{row.Type}</td>
//                   <td>{row.electrode_id}</td>
//                   <td>{row.weight}</td>
//                   <td>{row.moisture}</td>
//                   <td>{row.thickness}</td>
//                   <td>{row.density}</td>
//                   <td>{row.IR_temp_1}</td>
//                   <td>{row.IR_Temp_2}</td>
//                   <td>{row.chain_speed}</td>
//                   <td>{row.zone_temp_1}</td>
//                   <td>{row.zone_temp_2}</td>
//                   <td>{row.humidity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default BatteryTable;

















// import React, { useState } from "react";
// import axios from "axios";
// import "./CSS/BatteryTables.css";

// const BatteryTable = () => {
//   const [data, setData] = useState([]);
//   const [batteryOCV, setBatteryOCV] = useState("");
//   const [manufacturedTime, setManufacturedTime] = useState("");
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const [searchInput, setSearchInput] = useState("BAT1233");
//   const [searchType, setSearchType] = useState("battery");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [electrodeData, setElectrodeData] = useState([]);

//   const fetchData = async (id) => {
//     setLoading(true);
//     setError("");
//     setLoginSuccess(false);
//     setData([]);
//     setBatteryOCV("");
//     setManufacturedTime("");
//     setElectrodeData([]);

//     try {
//       const loginRes = await axios.post(
//         "http://192.168.1.59:5000/api/login",
//         { username: "abhishek", password: "1234" },
//         { withCredentials: true }
//       );

//       if (loginRes.data.success !== true) {
//         setError("Login failed: Invalid credentials");
//         return;
//       }

//       setLoginSuccess(true);

//       const endpoint =
//         searchType === "battery"
//           ? "http://192.168.1.59:5000/api/trace/battery-id"
//           : searchType === "cell"
//           ? "http://192.168.1.59:5000/api/trace/cell-id"
//           : "http://192.168.1.59:5000/api/trace/electrode-id";

//       const postData =
//         searchType === "battery"
//           ? { battery_id: id }
//           : searchType === "cell"
//           ? { cell_id: id }
//           : { electrode_id: id };

//       const traceRes = await axios.post(endpoint, postData, {
//         withCredentials: true,
//       });

//       const trace = traceRes.data.trace;

//       if (!trace || !trace.cell_data) {
//         setError("No data found.");
//         return;
//       }

//       const formattedData = trace.cell_data.map((cell, index) => {
//         const cellData = cell.data || {};
//         return {
//           "Sr. Nos": index + 1,
//           "Battery ID": trace.battery_id || "Null",
//           "Battery OCV": trace.battery_ocv || "Null",
//           "Manufactured Time": new Date(trace.manufactured_timestamp).toLocaleString() || "Null",
//           "cell ID": cell.cell_id || "Null",
//           "Testing time": cellData.testing_timestamp
//             ? new Date(cellData.testing_timestamp).toLocaleString()
//             : "",
//           "OCV": cellData.cell_ocv || "Null",
//           "IR": cellData.cell_ir || "Null",
//           "HRD": cellData.cell_hrd || "Null",
//           "filling date and time": cellData.filling_datetime
//             ? new Date(cellData.filling_datetime).toLocaleString()
//             : "Null",
//           "Dry weight": cellData.dry_weight || "Null",
//           "Filled qty": cellData.filled_weight || "Null",
//           "Jelly roll weight": cellData.jelly_roll_wt || "Null",
//           "Jelly roll dia": cellData.jelly_roll_dia || "Null",
//         };
//       });

//       const electrodeFormatted = trace.cell_data
//         .flatMap((cell, cellIndex) => {
//           const electrodeDataArray = cell.electrode_data || [];

//           return electrodeDataArray.map((item, index) => {
//             const isAnode = item.anode_data !== undefined;
//             const ele = isAnode ? item.anode_data : item.cathode_data;

//             if (!ele) return null;

//             return {
//               Sr: cellIndex * 2 + index + 1,
//               Cell_ID: cell.cell_id || "Null",
//               Type: isAnode ? "Anode" : "Cathode" || "Null",
//               electrode_id: ele.electrode_id || "Null",
//               weight: ele.weight || "Null",
//               moisture: ele.moisture || "Null",
//               thickness: ele.thickness || "Null",
//               density: ele.density || "Null",
//               IR_temp_1: ele.IR_temp_1 || "Null",
//               IR_Temp_2: ele.IR_Temp_2 || "Null",
//               chain_speed: ele.chain_speed || "Null",
//               zone_temp_1: ele.zone_temp_1 || "Null",
//               zone_temp_2: ele.zone_temp_2 || "Null",
//               humidity: ele.humidity || "Null",
//             };
//           });
//         })
//         .filter(Boolean);

//       setBatteryOCV(trace.battery_ocv);
//       setManufacturedTime(trace.manufactured_timestamp);
//       setData(formattedData);
//       setElectrodeData(electrodeFormatted);
//     } catch (err) {
//       setLoading(false);
//       setError("Error fetching data: " + err.message);
//       console.error(err);
//     } finally {
//       setTimeout(() => setLoading(false), 1500);
//     }
//   };

//   const mergedIndices = (key) => {
//     const map = {};
//     data.forEach((row, idx) => {
//       if (!map[row[key]]) {
//         map[row[key]] = { start: idx, count: 1 };
//       } else {
//         map[row[key]].count += 1;
//       }
//     });
//     return map;
//   };

//   const batteryIDMap = mergedIndices("Battery ID");
//   const ocvMap = mergedIndices("Battery OCV");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchInput.trim()) {
//       setError("Please enter an ID");
//       return;
//     }
//     fetchData(searchInput.trim());
//   };

//   return (
//     <div className="table-container">
//       <h2>Battery Trace Data</h2>

//       <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//           style={{ padding: "0.5rem", marginRight: "0.5rem" }}
//         >
//           <option value="battery">Battery ID</option>
//           <option value="cell">Cell ID</option>
//           <option value="electrode">Electrode ID</option>
//         </select>

//         <input
//           type="text"
//           placeholder={`Enter ${searchType.charAt(0).toUpperCase() + searchType.slice(1)} ID`}
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//           style={{ padding: "0.5rem", fontSize: "1rem", width: "200px", border: "none" }}
//         />

//         <button className="search_btn" type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Search"}
//         </button>
//       </form>

//       {loading && (
//         <div style={{ textAlign: "center", margin: "20px 0" }}>
//           <img src="/Animation_searching_pages.gif" alt="Loading..." width="300" style={{ mixBlendMode: "multiply" }} />
//           <p>Loading data, please wait...</p>
//         </div>
//       )}

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {!loginSuccess && !loading && !error && (
//         <p>🔒 Please search for an ID to see data.</p>
//       )}

//       {loginSuccess && !loading && !error && data.length > 0 && (
//         <>
//           <p><strong>Battery OCV:</strong> {batteryOCV}</p>
//           <p><strong>Manufactured Time:</strong> {new Date(manufacturedTime).toLocaleString()}</p>

//           <table className="battery-table">
//             <thead>
//               <tr>
//                 <th rowSpan={2}>Sr. Nos</th>
//                 <th rowSpan={2}>Battery ID</th>
//                 <th rowSpan={2}>Battery OCV</th>
//                 <th rowSpan={2}>Cell ID</th>
//                 <th colSpan={4}>Testing Parameters</th>
//                 <th colSpan={3}>Filling Parameters</th>
//                 <th colSpan={2}>Assembly Parameters</th>
//               </tr>
//               <tr>
//                 <th>Testing Time</th>
//                 <th>OCV</th>
//                 <th>IR</th>
//                 <th>HRD</th>
//                 <th>Filling Date & Time</th>
//                 <th>Dry Weight</th>
//                 <th>Filled Qty</th>
//                 <th>Jelly Roll Weight</th>
//                 <th>Jelly Roll Dia</th>
//               </tr>
//             </thead>
//             <tbody>
//               {data.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row["Sr. Nos"]}</td>
//                   {batteryIDMap[row["Battery ID"]]?.start === idx && (
//                     <td rowSpan={batteryIDMap[row["Battery ID"]].count}>{row["Battery ID"]}</td>
//                   )}
//                   {ocvMap[row["Battery OCV"]]?.start === idx && (
//                     <td rowSpan={ocvMap[row["Battery OCV"]].count}>{row["Battery OCV"]}</td>
//                   )}
//                   <td>{row["cell ID"]}</td>
//                   <td>{row["Testing time"]}</td>
//                   <td>{row["OCV"]}</td>
//                   <td>{row["IR"]}</td>
//                   <td>{row["HRD"]}</td>
//                   <td>{row["filling date and time"]}</td>
//                   <td>{row["Dry weight"]}</td>
//                   <td>{row["Filled qty"]}</td>
//                   <td>{row["Jelly roll weight"]}</td>
//                   <td>{row["Jelly roll dia"]}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}

//       {loginSuccess && !loading && !error && electrodeData.length > 0 && (
//         <>
//           <h3 style={{ marginTop: "2rem" }}>Electrode Data (Anode / Cathode)</h3>
//           <table className="battery-table">
//             <thead>
//               <tr>
//                 <th>Sr</th>
//                 <th>Cell Id</th>
//                 <th>Type</th>
//                 <th>Electrode ID</th>
//                 <th>Weight</th>
//                 <th>Moisture</th>
//                 <th>Thickness</th>
//                 <th>Density</th>
//                 <th>IR Temp 1</th>
//                 <th>IR Temp 2</th>
//                 <th>Chain Speed</th>
//                 <th>Zone Temp 1</th>
//                 <th>Zone Temp 2</th>
//                 <th>Humidity</th>
//               </tr>
//             </thead>
//             <tbody>
//               {electrodeData.map((row, idx) => (
//                 <tr key={idx}>
//                   <td>{row.Sr}</td>
//                   <td>{row.Cell_ID}</td>
//                   <td>{row.Type}</td>
//                   <td>{row.electrode_id}</td>
//                   <td>{row.weight}</td>
//                   <td>{row.moisture}</td>
//                   <td>{row.thickness}</td>
//                   <td>{row.density}</td>
//                   <td>{row.IR_temp_1}</td>
//                   <td>{row.IR_Temp_2}</td>
//                   <td>{row.chain_speed}</td>
//                   <td>{row.zone_temp_1}</td>
//                   <td>{row.zone_temp_2}</td>
//                   <td>{row.humidity}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </>
//       )}
//     </div>
//   );
// };

// export default BatteryTable;





// import React, { useState, useRef } from "react";
// import axios from "axios";
// import jsPDF from "jspdf";
// import html2canvas from "html2canvas";
// import "./CSS/BatteryTables.css";

// const BatteryTable = () => {
//   const [data, setData] = useState([]);
//   const [batteryOCV, setBatteryOCV] = useState("");
//   const [manufacturedTime, setManufacturedTime] = useState("");
//   const [loginSuccess, setLoginSuccess] = useState(false);
//   const [searchInput, setSearchInput] = useState("BAT1233");
//   const [searchType, setSearchType] = useState("battery");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [electrodeData, setElectrodeData] = useState([]);

//   const tableRef = useRef(null); // 👈 used for PDF export

//   const fetchData = async (id) => {
//     setLoading(true);
//     setError("");
//     setLoginSuccess(false);
//     setData([]);
//     setBatteryOCV("");
//     setManufacturedTime("");
//     setElectrodeData([]);

//     try {
//       const loginRes = await axios.post(
//         "http://192.168.1.59:5000/api/login",
//         { username: "abhishek", password: "1234" },
//         { withCredentials: true }
//       );

//       if (loginRes.data.success !== true) {
//         setError("Login failed: Invalid credentials");
//         return;
//       }

//       setLoginSuccess(true);

//       const endpoint =
//         searchType === "battery"
//           ? "http://192.168.1.59:5000/api/trace/battery-id"
//           : searchType === "cell"
//           ? "http://192.168.1.59:5000/api/trace/cell-id"
//           : "http://192.168.1.59:5000/api/trace/electrode-id";

//       const postData =
//         searchType === "battery"
//           ? { battery_id: id }
//           : searchType === "cell"
//           ? { cell_id: id }
//           : { electrode_id: id };

//       const traceRes = await axios.post(endpoint, postData, {
//         withCredentials: true,
//       });

//       const trace = traceRes.data.trace;

//       if (!trace || !trace.cell_data) {
//         setError("No data found.");
//         return;
//       }

//       const formattedData = trace.cell_data.map((cell, index) => {
//         const cellData = cell.data || {};
//         return {
//           "Sr. Nos": index + 1,
//           "Battery ID": trace.battery_id || "Null",
//           "Battery OCV": trace.battery_ocv || "Null",
//           "Manufactured Time": new Date(trace.manufactured_timestamp).toLocaleString() || "Null",
//           "cell ID": cell.cell_id || "Null",
//           "Testing time": cellData.testing_timestamp
//             ? new Date(cellData.testing_timestamp).toLocaleString()
//             : "",
//           "OCV": cellData.cell_ocv || "Null",
//           "IR": cellData.cell_ir || "Null",
//           "HRD": cellData.cell_hrd || "Null",
//           "filling date and time": cellData.filling_datetime
//             ? new Date(cellData.filling_datetime).toLocaleString()
//             : "Null",
//           "Dry weight": cellData.dry_weight || "Null",
//           "Filled qty": cellData.filled_weight || "Null",
//           "Jelly roll weight": cellData.jelly_roll_wt || "Null",
//           "Jelly roll dia": cellData.jelly_roll_dia || "Null",
//         };
//       });

//       const electrodeFormatted = trace.cell_data
//         .flatMap((cell, cellIndex) => {
//           const electrodeDataArray = cell.electrode_data || [];

//           return electrodeDataArray.map((item, index) => {
//             const isAnode = item.anode_data !== undefined;
//             const ele = isAnode ? item.anode_data : item.cathode_data;
//             if (!ele) return null;

//             return {
//               Sr: cellIndex * 2 + index + 1,
//               Cell_ID: cell.cell_id || "Null",
//               Type: isAnode ? "Anode" : "Cathode" || "Null",
//               electrode_id: ele.electrode_id || "Null",
//               weight: ele.weight || "Null",
//               moisture: ele.moisture || "Null",
//               thickness: ele.thickness || "Null",
//               density: ele.density || "Null",
//               IR_temp_1: ele.IR_temp_1 || "Null",
//               IR_Temp_2: ele.IR_Temp_2 || "Null",
//               chain_speed: ele.chain_speed || "Null",
//               zone_temp_1: ele.zone_temp_1 || "Null",
//               zone_temp_2: ele.zone_temp_2 || "Null",
//               humidity: ele.humidity || "Null",
//             };
//           });
//         })
//         .filter(Boolean);

//       setBatteryOCV(trace.battery_ocv);
//       setManufacturedTime(trace.manufactured_timestamp);
//       setData(formattedData);
//       setElectrodeData(electrodeFormatted);
//     } catch (err) {
//       setError("Error fetching data: " + err.message);
//       console.error(err);
//     } finally {
//       setTimeout(() => setLoading(false), 1500);
//     }
//   };

//   const mergedIndices = (key) => {
//     const map = {};
//     data.forEach((row, idx) => {
//       if (!map[row[key]]) {
//         map[row[key]] = { start: idx, count: 1 };
//       } else {
//         map[row[key]].count += 1;
//       }
//     });
//     return map;
//   };

//   const batteryIDMap = mergedIndices("Battery ID");
//   const ocvMap = mergedIndices("Battery OCV");

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchInput.trim()) {
//       setError("Please enter an ID");
//       return;
//     }
//     fetchData(searchInput.trim());
//   };

//   const downloadPDF = () => {
//     const input = tableRef.current;
//     const btn = document.querySelector(".download-btn");
//     btn.style.display = "none";

//     html2canvas(input, { scale: 1 }).then((canvas) => {
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF("p", "mm", "a4");
//       const imgProps = pdf.getImageProperties(imgData);
//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save("battery_report.pdf");
//       btn.style.display = "inline-block";
//     });
//   };

//   return (
//     <div className="table-container">
//       <h2>Battery Trace Data</h2>

//       <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
//         <select
//           value={searchType}
//           onChange={(e) => setSearchType(e.target.value)}
//         >
//           <option value="battery">Battery ID</option>
//           <option value="cell">Cell ID</option>
//           <option value="electrode">Electrode ID</option>
//         </select>

//         <input
//           type="text"
//           placeholder={`Enter ${searchType.charAt(0).toUpperCase() + searchType.slice(1)} ID`}
//           value={searchInput}
//           onChange={(e) => setSearchInput(e.target.value)}
//         />

//         <button className="search_btn" type="submit" disabled={loading}>
//           {loading ? "Loading..." : "Search"}
//         </button>
//       </form>

//       {error && <p style={{ color: "red" }}>{error}</p>}

//       {loginSuccess && !loading && !error && data.length > 0 && (
//         <>
//           <div ref={tableRef}>
//             <p><strong>Battery OCV:</strong> {batteryOCV}</p>
//             <p><strong>Manufactured Time:</strong> {new Date(manufacturedTime).toLocaleString()}</p>

//             <table className="battery-table">
//               <thead>
//                 <tr>
//                   <th rowSpan={2}>Sr. Nos</th>
//                   <th rowSpan={2}>Battery ID</th>
//                   <th rowSpan={2}>Battery OCV</th>
//                   <th rowSpan={2}>Cell ID</th>
//                   <th colSpan={4}>Testing Parameters</th>
//                   <th colSpan={3}>Filling Parameters</th>
//                   <th colSpan={2}>Assembly Parameters</th>
//                 </tr>
//                 <tr>
//                   <th>Testing Time</th>
//                   <th>OCV</th>
//                   <th>IR</th>
//                   <th>HRD</th>
//                   <th>Filling Date & Time</th>
//                   <th>Dry Weight</th>
//                   <th>Filled Qty</th>
//                   <th>Jelly Roll Weight</th>
//                   <th>Jelly Roll Dia</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.map((row, idx) => (
//                   <tr key={idx}>
//                     <td>{row["Sr. Nos"]}</td>
//                     {batteryIDMap[row["Battery ID"]]?.start === idx && (
//                       <td rowSpan={batteryIDMap[row["Battery ID"]].count}>{row["Battery ID"]}</td>
//                     )}
//                     {ocvMap[row["Battery OCV"]]?.start === idx && (
//                       <td rowSpan={ocvMap[row["Battery OCV"]].count}>{row["Battery OCV"]}</td>
//                     )}
//                     <td>{row["cell ID"]}</td>
//                     <td>{row["Testing time"]}</td>
//                     <td>{row["OCV"]}</td>
//                     <td>{row["IR"]}</td>
//                     <td>{row["HRD"]}</td>
//                     <td>{row["filling date and time"]}</td>
//                     <td>{row["Dry weight"]}</td>
//                     <td>{row["Filled qty"]}</td>
//                     <td>{row["Jelly roll weight"]}</td>
//                     <td>{row["Jelly roll dia"]}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>

//             {electrodeData.length > 0 && (
//               <>
//                 <h3 style={{ marginTop: "2rem" }}>Electrode Data (Anode / Cathode)</h3>
//                 <table className="battery-table">
//                   <thead>
//                     <tr>
//                       <th>Sr</th>
//                       <th>Cell Id</th>
//                       <th>Type</th>
//                       <th>Electrode ID</th>
//                       <th>Weight</th>
//                       <th>Moisture</th>
//                       <th>Thickness</th>
//                       <th>Density</th>
//                       <th>IR Temp 1</th>
//                       <th>IR Temp 2</th>
//                       <th>Chain Speed</th>
//                       <th>Zone Temp 1</th>
//                       <th>Zone Temp 2</th>
//                       <th>Humidity</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {electrodeData.map((row, idx) => (
//                       <tr key={idx}>
//                         <td>{row.Sr}</td>
//                         <td>{row.Cell_ID}</td>
//                         <td>{row.Type}</td>
//                         <td>{row.electrode_id}</td>
//                         <td>{row.weight}</td>
//                         <td>{row.moisture}</td>
//                         <td>{row.thickness}</td>
//                         <td>{row.density}</td>
//                         <td>{row.IR_temp_1}</td>
//                         <td>{row.IR_Temp_2}</td>
//                         <td>{row.chain_speed}</td>
//                         <td>{row.zone_temp_1}</td>
//                         <td>{row.zone_temp_2}</td>
//                         <td>{row.humidity}</td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </>
//             )}
//           </div>

//           <button className="download-btn" onClick={downloadPDF} style={{ marginTop: "1rem" }}>
//             Download PDF
//           </button>
//         </>
//       )}
//     </div>
//   );
// };

// export default BatteryTable;





import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "./CSS/BatteryTables.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BatteryTable = () => {
  const [data, setData] = useState([]);
  const [batteryOCV, setBatteryOCV] = useState("");
  const [manufacturedTime, setManufacturedTime] = useState("");
  const [searchInput, setSearchInput] = useState("BAT1233");
  const [searchType, setSearchType] = useState("battery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [electrodeData, setElectrodeData] = useState([]);

  const fetchData = async (id) => {
    setLoading(true);
    setError("");
    setData([]);
    setBatteryOCV("");
    setManufacturedTime("");
    setElectrodeData([]);

    try {
      const endpoint =
        searchType === "battery"
          ? `${API_BASE_URL}/trace/battery-id`
          : searchType === "cell"
          ? `${API_BASE_URL}/trace/cell-id`
          : `${API_BASE_URL}/trace/electrode-id`;

      const postData =
        searchType === "battery"
          ? { battery_id: id }
          : searchType === "cell"
          ? { cell_id: id }
          : { electrode_id: id };

      const traceRes = await axios.post(endpoint, postData);

      const trace = traceRes.data.trace;

      if (!trace || !trace.cell_data &&  setLoading==false) {
       
        setError("No data found.");
        return;
      }

      const formattedData = trace.cell_data.map((cell, index) => {
        const cellData = cell.data || {};
        return {
          "Sr. Nos": index + 1,
          "Battery ID": trace.battery_id || "Null",
          "Battery OCV": trace.battery_ocv || "Null",
          "Manufactured Time": new Date(trace.manufactured_timestamp).toLocaleString() || "Null",
          "cell ID": cell.cell_id || "Null",
          "Testing time": cellData.testing_timestamp
            ? new Date(cellData.testing_timestamp).toLocaleString()
            : "",
          "OCV": cellData.cell_ocv || "Null",
          "IR": cellData.cell_ir || "Null",
          "HRD": cellData.cell_hrd || "Null",
          "filling date and time": cellData.filling_datetime
            ? new Date(cellData.filling_datetime).toLocaleString()
            : "Null",
          "Dry weight": cellData.dry_weight || "Null",
          "Filled qty": cellData.filled_weight || "Null",
          "Jelly roll weight": cellData.jelly_roll_wt || "Null",
          "Jelly roll dia": cellData.jelly_roll_dia || "Null",
        };
      });

      const electrodeFormatted = trace.cell_data
        .flatMap((cell, cellIndex) => {
          const electrodeDataArray = cell.electrode_data || [];

          return electrodeDataArray.map((item, index) => {
            const isAnode = item.anode_data !== undefined;
            const ele = isAnode ? item.anode_data : item.cathode_data;

            if (!ele) return null;

            return {
              Sr: cellIndex * 2 + index + 1,
              Cell_ID: cell.cell_id || "Null",
              Type: isAnode ? "Anode" : "Cathode" || "Null",
              electrode_id: ele.electrode_id || "Null",
              weight: ele.weight || "Null",
              moisture: ele.moisture || "Null",
              thickness: ele.thickness || "Null",
              density: ele.density || "Null",
              IR_temp_1: ele.IR_temp_1 || "Null",
              IR_Temp_2: ele.IR_Temp_2 || "Null",
              chain_speed: ele.chain_speed || "Null",
              zone_temp_1: ele.zone_temp_1 || "Null",
              zone_temp_2: ele.zone_temp_2 || "Null",
              humidity: ele.humidity || "Null",
            };
          });
        })
        .filter(Boolean);

      setBatteryOCV(trace.battery_ocv);
      setManufacturedTime(trace.manufactured_timestamp);
      setData(formattedData);
      setElectrodeData(electrodeFormatted);
    } catch (err) {
      setLoading(false);
      setError("Error fetching data: " + err.message);
      console.error(err);
    } finally {
      setTimeout(() => setLoading(false), 1500);
    }
  };

  const mergedIndices = (key) => {
    const map = {};
    data.forEach((row, idx) => {
      if (!map[row[key]]) {
        map[row[key]] = { start: idx, count: 1 };
      } else {
        map[row[key]].count += 1;
      }
    });
    return map;
  };

  const batteryIDMap = mergedIndices("Battery ID");
  const ocvMap = mergedIndices("Battery OCV");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      setError("Please enter an ID");
      return;
    }
    fetchData(searchInput.trim());
  };

  const handleDownloadPDF = async () => {
    const input = document.getElementById("pdf-content");
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 1,
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.6);
    const pdf = new jsPDF("p", "pt", "a4");

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const padding = 20;
    const imgWidth = pageWidth - 2 * padding;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = padding;

    pdf.addImage(imgData, "jpg", padding, position, imgWidth, imgHeight);

    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      pdf.addPage();
      position = 0;
      pdf.addImage(imgData, "jpg", padding, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const now = new Date();
    const timestamp = now
      .toISOString()
      .replace(/T/, "_")
      .replace(/:/g, "-")
      .replace(/\..+/, "");
    pdf.save(`battery_report_${timestamp}.pdf`);
  };

  return (
    <div className="table-container">
      <h2>Battery Trace Data</h2>

      <form onSubmit={handleSearch} style={{ marginBottom: "1rem" }}>
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          style={{ padding: "0.5rem", marginRight: "0.5rem" }}
        >
          <option value="battery">Battery ID</option>
          <option value="cell">Cell ID</option>
          <option value="electrode">Electrode ID</option>
        </select>

        <input
          type="text"
          placeholder={`Enter ${searchType.charAt(0).toUpperCase() + searchType.slice(1)} ID`}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{ padding: "0.5rem", fontSize: "1rem", width: "200px", border: "none" }}
        />

        <button className="search_btn" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </form>

      {!loading && (data.length > 0 || electrodeData.length > 0) && (
        <div style={{ display: "flex", justifyContent: "end" }}>
          <button className="downlaod-report" onClick={handleDownloadPDF} style={{ marginBottom: "1rem" }}>
            Download Report
          </button>
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", margin: "20px 0" }}>
          <img src="/Animation_searching_pages.gif" alt="Loading..." width="300" style={{ mixBlendMode: "multiply" }} />
          <p>Loading data, please wait...</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div id="pdf-content">
        {!loading && !error && data.length > 0 && (
          <>
            <p><strong>Battery OCV:</strong> {batteryOCV}</p>
            <p><strong>Manufactured Time:</strong> {new Date(manufacturedTime).toLocaleString()}</p>

            <table className="battery-table">
              <thead>
                <tr>
                  <th rowSpan={2}>Sr. Nos</th>
                  <th rowSpan={2}>Battery ID</th>
                  <th rowSpan={2}>Battery OCV</th>
                  <th rowSpan={2}>Cell ID</th>
                  <th colSpan={4}>Testing Parameters</th>
                  <th colSpan={3}>Filling Parameters</th>
                  <th colSpan={2}>Assembly Parameters</th>
                </tr>
                <tr>
                  <th>Testing Time</th>
                  <th>OCV</th>
                  <th>IR</th>
                  <th>HRD</th>
                  <th>Filling Date & Time</th>
                  <th>Dry Weight</th>
                  <th>Filled Qty</th>
                  <th>Jelly Roll Weight</th>
                  <th>Jelly Roll Dia</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row["Sr. Nos"]}</td>
                    {batteryIDMap[row["Battery ID"]]?.start === idx && (
                      <td rowSpan={batteryIDMap[row["Battery ID"]].count}>{row["Battery ID"]}</td>
                    )}
                    {ocvMap[row["Battery OCV"]]?.start === idx && (
                      <td rowSpan={ocvMap[row["Battery OCV"]].count}>{row["Battery OCV"]}</td>
                    )}
                    <td>{row["cell ID"]}</td>
                    <td>{row["Testing time"]}</td>
                    <td>{row["OCV"]}</td>
                    <td>{row["IR"]}</td>
                    <td>{row["HRD"]}</td>
                    <td>{row["filling date and time"]}</td>
                    <td>{row["Dry weight"]}</td>
                    <td>{row["Filled qty"]}</td>
                    <td>{row["Jelly roll weight"]}</td>
                    <td>{row["Jelly roll dia"]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {!loading && !error && electrodeData.length > 0 && (
          <>
            <h3 style={{ marginTop: "2rem" }}>Electrode Data (Anode / Cathode)</h3>
            <table className="battery-table">
              <thead>
                <tr>
                  <th>Sr</th>
                  <th>Cell Id</th>
                  <th>Type</th>
                  <th>Electrode ID</th>
                  <th>Weight</th>
                  <th>Moisture</th>
                  <th>Thickness</th>
                  <th>Density</th>
                  <th>IR Temp 1</th>
                  <th>IR Temp 2</th>
                  <th>Chain Speed</th>
                  <th>Zone Temp 1</th>
                  <th>Zone Temp 2</th>
                  <th>Humidity</th>
                </tr>
              </thead>
              <tbody>
                {electrodeData.map((row, idx) => (
                  <tr key={idx}>
                    <td>{row.Sr}</td>
                    <td>{row.Cell_ID}</td>
                    <td>{row.Type}</td>
                    <td>{row.electrode_id}</td>
                    <td>{row.weight}</td>
                    <td>{row.moisture}</td>
                    <td>{row.thickness}</td>
                    <td>{row.density}</td>
                    <td>{row.IR_temp_1}</td>
                    <td>{row.IR_Temp_2}</td>
                    <td>{row.chain_speed}</td>
                    <td>{row.zone_temp_1}</td>
                    <td>{row.zone_temp_2}</td>
                    <td>{row.humidity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
};

export default BatteryTable;
