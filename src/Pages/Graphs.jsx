// import React, { useEffect, useState } from 'react';
// import ReactECharts from 'echarts-for-react';
// import './CSS/Graphs.css';
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


// const ChartComponent = () => {
//   const [chartData, setChartData] = useState([]);
//   const [dateRange, setDateRange] = useState({ from: '', to: '' });

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/graph/cell-params/by-battery-id`)
//       .then(response => response.json())
//       .then(rawData => {
//         const transformedData = rawData.x_axis.map((id, index) => ({
//           electrode: id,
//           WEIGHT: rawData.y_axis_WEIGHT[index],
//           THICKNESS: rawData.y_axis_THICKNESS[index],
//           MOISTURE: rawData.y_axis_MOISTURE[index],
//           DENSITY: rawData.y_axis_DENSITY[index],
//           IR_TEMP_1: rawData.y_axis_IR_TEMP_1[index],
//           IR_TEMP_2: rawData.y_axis_IR_TEMP_2[index],
//           CHAIN_SPEED: rawData.y_axis_CHAIN_SPEED[index],
//           ZONE_TEMP_1: rawData.y_axis_ZONE_TEMP_1[index],
//           ZONE_TEMP_2: rawData.y_axis_ZONE_TEMP_2[index]
//         }));
//         setChartData(transformedData);
//         setDateRange({ from: rawData.date_from, to: rawData.date_to });
//       })
//       .catch(error => console.error("Error fetching chart data:", error));
//   }, []);

// const getOption = () => {
//   const xData = chartData.map(item => item.electrode);

//   const seriesKeys = ["WEIGHT", "THICKNESS", "MOISTURE", "DENSITY", "IR_TEMP_1"];
//   const colorPalette = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff7344'];

//   const series = seriesKeys.map((key, index) => ({
//     name: key,
//     type: 'line',
//     data: chartData.map(item => item[key]),
//     smooth: true,
//     // yAxisIndex: index > 2 ? 1 : 0, // First 3 metrics on left, others on right Y axis
//     lineStyle: { width: 3 },
//     emphasis: { focus: 'series' }
//   }));

//   return {
//     color: colorPalette,
//     tooltip: {
//       trigger: 'axis',
//       axisPointer: {
//         type: 'cross'
//       }
//     },
//     legend: {
//       data: seriesKeys
//     },
//     toolbox: {
//       feature: {
//         saveAsImage: {},
//         dataZoom: {
//           yAxisIndex: 'none'
//         },
//         restore: {}
//       }
//     },
//     dataZoom: [
//       {
//         type: 'inside',
//         start: 0,
//         end: 100
//       },
//       {
//         start: 0,
//         end: 100
//       }
//     ],
//     grid: {
//       left: '5%',
//       right: '8%',
//       bottom: '10%',
//       containLabel: true
//     },
//     xAxis: {
//       type: 'category',
//       boundaryGap: false,
//       data: xData
//     },
//     yAxis: [
//       {
//         type: 'value',
//         name: 'Primary',
//         position: 'left'
//       },
//       {
//         type: 'value',
//         name: 'Secondary',
//         position: 'right',
//         axisLine: {
//           lineStyle: {
//             color: '#999'
//           }
//         },
//         splitLine: {
//           show: false
//         }
//       }
//     ],
//     series
//   };
// };


//   return (
//     <div>
//       <h2 className='Heading-Dates'>{`Date Range: ${dateRange.from} to ${dateRange.to}`}</h2>
//       <ReactECharts
//         option={getOption()}
//         style={{ height: '500px', width: '100%' }}
//         className="chartcontainer"
//       />
//     </div>
//   );
// };

// export default ChartComponent;











// import React, { useState } from 'react';
// import * as echarts from 'echarts';
// import ReactECharts from 'echarts-for-react';

// const parameterNames = {
//   cell_ocv: 'OCV (V)',
//   cell_ir: 'IR (µΩ)',
//   cell_hrd: 'HRD',
//   cell_dry_wt: 'Dry Weight (g)',
//   cell_filled_wt: 'Filled Weight (g)',
//   cell_jelly_roll_wt: 'Jelly Roll Weight (g)',
//   cell_jelly_roll_dia: 'Jelly Roll Diameter (mm)'
// };

// const GraphsPage = () => {
//   const [batteryId, setBatteryId] = useState('BAT1234');
//   const [graphData, setGraphData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleFetch = async () => {
//     setLoading(true);
//     try {
//       const response = await fetch('http://192.168.1.59:5000/api/graph/cell-params/by-battery-id', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ battery_id: batteryId }),
//       });
//       const result = await response.json();
//       if (result.success) {
//         setGraphData(result.graphData);
//       } else {
//         alert('API responded with success: false');
//       }
//     } catch (error) {
//       console.error('Error fetching graph data:', error);
//       alert('Error fetching data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderChart = (paramKey) => {
//     if (!graphData) return null;

//     return {
      
//       title: {
//         text: parameterNames[paramKey],
//         left: 'center',
//         textStyle: {
//           fontSize: 14,
//           fontWeight: 'normal'
//         }
//       },
//       tooltip: {
//         trigger: 'axis',
        
//       },
//       xAxis: {
//         type: 'category',
//         data: graphData.horizontal_axis.cell_id_list,
//         name: 'Cell ID',
//         axisLabel: { rotate: 45 }
//       },
//       yAxis: {
//         type: 'value',
//         name: parameterNames[paramKey],
//         nameTextStyle: { fontWeight: 'bold' }
//       },
//       series: [
//         {
//           data: graphData.vertial_axis_dataPoints[paramKey],
//           type: 'line',
//           smooth: false,
//           lineStyle: {
//             width: 2
//           },
//           symbolSize: 6,
//           itemStyle: {
//             color: '#5470C6'
//           }
//         }
//       ]
//     };
//   };


//   return (
//     <div style={styles.container}>
//       <h2 style={styles.title}>Battery Graph Viewer</h2>
//       <div style={styles.inputSection}>
//         <input
//           type="text"
//           value={batteryId}
//           onChange={(e) => setBatteryId(e.target.value)}
//           placeholder="Enter Battery ID (e.g., BAT1234)"
//           style={styles.input}
//         />
//         <button onClick={handleFetch} disabled={loading} style={styles.button}>
//           {loading ? 'Loading...' : 'Search'}
//         </button>
//       </div>


// {graphData && (
//   <>
//     {/* Battery ID heading */}
//     <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>
//       Battery ID: {graphData.battery_id}
//     </h3>

//     <div style={styles.grid}>
//       {Object.keys(parameterNames).map((paramKey) => (
//         <div key={paramKey} style={styles.card}>
//           <ReactECharts option={renderChart(paramKey)} style={{ height: '300px' }} />
//         </div>
//       ))}
//     </div>
//   </>
// )}

//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '100%',
//     margin: 'auto',
//     padding: '30px 20px',
//     fontFamily: 'Segoe UI, sans-serif',
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: '28px',
//     marginBottom: '20px',
//     color: '#333'
//   },
//   inputSection: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '10px',
//     marginBottom: '30px',
//   },
//   input: {
//     padding: '10px 15px',
//     border: '1px solid #ccc',
//     borderRadius: '6px',
//     width: '300px',
//     fontSize: '16px'
//   },
//   button: {
//     padding: '10px 20px',
//     backgroundColor: '#2e7d32',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     fontSize: '16px',
//     cursor: 'pointer',
//     transition: 'background-color 0.2s',
//   },
//   grid: {
//     display: 'grid',
//     gridTemplateColumns: 'repeat(auto-fill, minmax(600px, 1fr))',
//     gap: '20px'
//   },
//   card: {
//     background: '#fff',
//     borderRadius: '8px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     padding: '10px',
//     transition: 'transform 0.2s ease',
//   }
// };

// export default GraphsPage;



// import React, { useState } from 'react';
// import axios from 'axios';
// import ReactECharts from 'echarts-for-react';

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const parameterNames = {
//   cell_ocv: 'OCV (V)',
//   cell_ir: 'IR (µΩ)',
//   cell_hrd: 'HRD',
//   cell_dry_wt: 'Dry Weight (g)',
//   cell_filled_wt: 'Filled Weight (g)',
//   cell_jelly_roll_wt: 'Jelly Roll Weight (g)',
//   cell_jelly_roll_dia: 'Jelly Roll Diameter (mm)'
// };

// const GraphsPage = () => {
//   const [mode, setMode] = useState('battery'); // battery or timestamp
//   const [batteryId, setBatteryId] = useState('BAT1234');
//   const [from, setFrom] = useState('');
//   const [to, setTo] = useState('');
//   const [graphData, setGraphData] = useState(null);
//   const [timestampData, setTimestampData] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const fetchBatteryData = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch(`${API_BASE_URL}/graph/cell-params/by-battery-id`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ battery_id: batteryId })
//       });
//       const result = await res.json();
//       if (result.success) {
//         setGraphData(result.graphData);
//       } else {
//         alert('Battery ID fetch failed');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error fetching battery data');
//     }
//     setLoading(false);
//   };

//   const fetchTimestampData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(`${API_BASE_URL}/graph/cell-params/by-testing-timestamp`, {
//         From: from,
//         To: to
//       });
//       setTimestampData(res.data.graphData);
//     } catch (err) {
//       console.error(err);
//       alert('Error fetching timestamp data');
//     }
//     setLoading(false);
//   };

// const renderChart = (paramKey, dataSource) => {
//   if (!dataSource) return null;

//   // Define a color map
//   const colorMap = {
//     cell_ocv: '#5470C6',
//     cell_ir: '#91CC75',
//     cell_hrd: '#FAC858',
//     cell_dry_wt: '#EE6666',
//     cell_filled_wt: '#73C0DE',
//     cell_jelly_roll_wt: '#3BA272',
//     cell_jelly_roll_dia: '#FC8452'
//   };

//   const timestamps = dataSource.horizontal_axis.cell_timestamp;

//   return (
//     <div className="upload-box" key={paramKey} style={{ marginBottom: '20px' }}>
//       <ReactECharts
//         option={{
//           title: { text: parameterNames[paramKey], left: 'center' },
//           tooltip: {
//             trigger: 'axis',
//             formatter: function (params) {
//               const idx = params[0].dataIndex;
//               const value = params[0].value;
//               const timestamp = timestamps[idx];
//               return `
//                 <b>${parameterNames[paramKey]}</b><br/>
//                 Value: ${value}<br/>
//                 Timestamp: ${timestamp}
//               `;
//             }
//           },
//           xAxis: {
//             type: 'category',
//             data: dataSource.horizontal_axis.cell_id_list,
//             axisLabel: { rotate: 45 }
//           },
//           yAxis: {
//             type: 'value',
//             name: parameterNames[paramKey]
//           },
//           series: [
//             {
//               name: parameterNames[paramKey],
//               type: 'line',
//               data: dataSource.vertial_axis_dataPoints[paramKey],
//               smooth: true,
//               lineStyle: {
//                 color: colorMap[paramKey]
//               },
//               itemStyle: {
//                 color: colorMap[paramKey]
//               }
//             }
//           ]
//         }}
//         style={{ height: '300px', width: '100%' }}
//       />
//     </div>
//   );
// };


//   return (
//     <div className="upload-container">
//       <div className="content-wrapper">
//         <h2>Battery/Cell Graph Viewer</h2>

//         {/* Toggle Mode */}
//         <div className="mode-toggle">
//           <button
//             className={`mode-btn ${mode === 'battery' ? 'active' : ''}`}
//             onClick={() => setMode('battery')}
//           >
//             Graph by Battery ID
//           </button>
//           <button
//             className={`mode-btn ${mode === 'timestamp' ? 'active' : ''}`}
//             onClick={() => setMode('timestamp')}
//           >
//             Graph by Timestamp
//           </button>
//         </div>

//         {/* Battery ID Input Mode */}
//         {mode === 'battery' && (
//           <div className="upload-box">
//             <div className="manual-section">
//               <label>
//                 Battery ID
//                 <input
//                   type="text"
//                   value={batteryId}
//                   onChange={(e) => setBatteryId(e.target.value)}
//                   placeholder="e.g., BAT1234"
//                 />
//               </label>
//               <button className="upload-btn" onClick={fetchBatteryData} disabled={loading}>
//                 {loading ? 'Loading...' : 'Search'}
//               </button>
//             </div>

//             {graphData && (
//               <>
//                 <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
//                   Battery ID: {graphData.battery_id}
//                 </h3>
//                 {Object.keys(parameterNames).map((key) => renderChart(key, graphData))}
//               </>
//             )}
//           </div>
//         )}

//         {/* Timestamp Input Mode */}
//         {mode === 'timestamp' && (
//           <div className="upload-box">
//             <div className="manual-section">
//               <label>
//                 From
//                 <input
//                   type="datetime-local"
//                   value={from}
//                   onChange={(e) => setFrom(e.target.value)}
//                 />
//               </label>
//               <label>
//                 To
//                 <input
//                   type="datetime-local"
//                   value={to}
//                   onChange={(e) => setTo(e.target.value)}
//                 />
//               </label>
//               <button className="upload-btn" onClick={fetchTimestampData} disabled={loading}>
//                 {loading ? 'Loading...' : 'Search'}
//               </button>
//             </div>

//             {timestampData && (
//               <>
//                 {Object.keys(parameterNames).map((key) => renderChart(key, timestampData))}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default GraphsPage;




import React, { useState } from 'react';
import axios from 'axios';
import ReactECharts from 'echarts-for-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const parameterNames = {
  cell_ocv: 'OCV (V)',
  cell_ir: 'IR (µΩ)',
  cell_hrd: 'HRD',
  cell_dry_wt: 'Dry Weight (g)',
  cell_filled_wt: 'Filled Weight (g)',
  cell_jelly_roll_wt: 'Jelly Roll Weight (g)',
  cell_jelly_roll_dia: 'Jelly Roll Diameter (mm)'
};

const GraphsPage = () => {
  const [mode, setMode] = useState('battery'); // battery | timestamp | fillingTimestamp
  const [batteryId, setBatteryId] = useState('BAT1234');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [graphData, setGraphData] = useState(null);
  const [timestampData, setTimestampData] = useState(null);
  const [fillingTimestampData, setFillingTimestampData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBatteryData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/graph/cell-params/by-battery-id`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ battery_id: batteryId })
      });
      const result = await res.json();
      if (result.success) {
        setGraphData(result.graphData);
      } else {
        alert('Battery ID fetch failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error fetching battery data');
    }
    setLoading(false);
  };

  const fetchTimestampData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/graph/cell-params/by-testing-timestamp`, {
        From: from,
        To: to
      });
      setTimestampData(res.data.graphData);
    } catch (err) {
      console.error(err);
      alert('Error fetching timestamp data');
    }
    setLoading(false);
  };

  const fetchFillingTimestampData = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE_URL}/graph/cell-params/by-filling-timestamp`, {
        From: from,
        To: to
      });
      setFillingTimestampData(res.data.graphData);
    } catch (err) {
      console.error(err);
      alert('Error fetching filling timestamp data');
    }
    setLoading(false);
  };

  const renderChart = (paramKey, dataSource) => {
    if (!dataSource) return null;

    const colorMap = {
      cell_ocv: '#5470C6',
      cell_ir: '#91CC75',
      cell_hrd: '#FAC858',
      cell_dry_wt: '#EE6666',
      cell_filled_wt: '#73C0DE',
      cell_jelly_roll_wt: '#3BA272',
      cell_jelly_roll_dia: '#FC8452'
    };

    // const timestamps = dataSource.horizontal_axis.cell_timestamp;
    const timestamps = dataSource.horizontal_axis.cell_timestamp || [];


    return (
      <div className="upload-box" key={paramKey} style={{ marginBottom: '20px' }}>
        <ReactECharts
          option={{
            title: { text: parameterNames[paramKey], left: 'center' },
            tooltip: {
              trigger: 'axis',
              // formatter: function (params) {
              //   const idx = params[0].dataIndex;
              //   const value = params[0].value;
              //   const timestamp = timestamps[idx];
              //   return `
              //     <b>${parameterNames[paramKey]}</b><br/>
              //     Value: ${value}<br/>
              //     Timestamp: ${timestamp}
              //   `;
              // }

              formatter: function (params) {
  const idx = params[0].dataIndex;
  const value = params[0].value;
  const timestamp = timestamps[idx] || 'N/A';
  return `
    <b>${parameterNames[paramKey]}</b><br/>
    Value: ${value}<br/>
    Timestamp: ${timestamp}
  `;
}

            },
            xAxis: {
              type: 'category',
              data: dataSource.horizontal_axis.cell_id_list,
              axisLabel: { rotate: 45 }
            },
            yAxis: {
              type: 'value',
              name: parameterNames[paramKey]
            },
            series: [
              {
                name: parameterNames[paramKey],
                type: 'line',
                data: dataSource.vertial_axis_dataPoints[paramKey],
                smooth: true,
                lineStyle: {
                  color: colorMap[paramKey]
                },
                itemStyle: {
                  color: colorMap[paramKey]
                }
              }
            ]
          }}
          style={{ height: '300px', width: '100%' }}
        />
      </div>
    );
  };

  return (
    <div className="upload-container">
      <div className="content-wrapper">
        <h2>Battery/Cell Graph Viewer</h2>

        {/* Toggle Mode */}
        <div className="mode-toggle">
          <button
            className={`mode-btn ${mode === 'battery' ? 'active' : ''}`}
            onClick={() => setMode('battery')}
          >
            Graph by Battery ID
          </button>
          <button
            className={`mode-btn ${mode === 'timestamp' ? 'active' : ''}`}
            onClick={() => setMode('timestamp')}
          >
            Graph by Testing Timestamp
          </button>
          <button
            className={`mode-btn ${mode === 'fillingTimestamp' ? 'active' : ''}`}
            onClick={() => setMode('fillingTimestamp')}
          >
            Graph by Filling Timestamp
          </button>
        </div>

        {/* Battery ID Input Mode */}
        {mode === 'battery' && (
          <div className="upload-box">
            <div className="manual-section">
              <label>
                Battery ID
                <input
                  type="text"
                  value={batteryId}
                  onChange={(e) => setBatteryId(e.target.value)}
                  placeholder="e.g., BAT1234"
                />
              </label>
              <button className="upload-btn" onClick={fetchBatteryData} disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>

            {graphData && (
              <>
                <h3 style={{ textAlign: 'center', marginTop: '20px' }}>
                  Battery ID: {graphData.battery_id}
                </h3>
                {Object.keys(parameterNames).map((key) => renderChart(key, graphData))}
              </>
            )}
          </div>
        )}

        {/* Timestamp Input Mode */}
        {mode === 'timestamp' && (
          <div className="upload-box">
            <div className="manual-section">
              <label>
                From
                <input
                  type="datetime-local"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="datetime-local"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>
              <button className="upload-btn" onClick={fetchTimestampData} disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>

            {timestampData && (
              <>
                {Object.keys(parameterNames).map((key) => renderChart(key, timestampData))}
              </>
            )}
          </div>
        )}

        {/* Filling Timestamp Input Mode */}
        {mode === 'fillingTimestamp' && (
          <div className="upload-box">
            <div className="manual-section">
              <label>
                From
                <input
                  type="datetime-local"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                />
              </label>
              <label>
                To
                <input
                  type="datetime-local"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                />
              </label>
              <button className="upload-btn" onClick={fetchFillingTimestampData} disabled={loading}>
                {loading ? 'Loading...' : 'Search'}
              </button>
            </div>

            {fillingTimestampData && (
              <>
                {Object.keys(parameterNames).map((key) => renderChart(key, fillingTimestampData))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GraphsPage;
