import React from 'react'
import DBStatusIndicator from '../Components/DBConnection_Status/Db_Status'

const homepage = () => {
  return (
    <div>
        <div className="dbstatus" style={{display:'flex',justifyContent:'flex-end'}}><DBStatusIndicator/></div>
        
    </div>
  )
}

export default homepage