import React, { useContext } from 'react'
import { ContractContext } from './providers/ContractProvider'

const VehicleGrid = () => {
    const [contract] = useContext(ContractContext);

    
  return (
    <div>VehicleGrid</div>
  )
}

export default VehicleGrid