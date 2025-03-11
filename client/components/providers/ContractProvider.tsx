"use client"
import { createContext, ReactNode,  useState } from "react"

export const ContractContext = createContext<any>(null);

const ContractProvider = ({children}: {children: ReactNode}) => {
    const [account, setAccount] = useState(null);

  return (
    <ContractContext.Provider value={{ account, setAccount }}> 
        {children}
    </ContractContext.Provider>
  )
}

export default ContractProvider