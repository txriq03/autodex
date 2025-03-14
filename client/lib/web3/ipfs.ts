import { CarFormData } from "../validation";

export const uploadToIPFS = async (car: CarFormData, imageUrl: string | void, signerAddress: string) => {
    const make = car.make.charAt(0).toUpperCase() + car.make.slice(1)
    const model = car.model.charAt(0).toUpperCase() + car.model.slice(1)
    try {
      const response = await fetch('/api/ipfs', {
        method: 'POST',
        body: JSON.stringify({
          "name": make + " " + model,
          "description": "",
          "image": imageUrl,
          "owner": signerAddress,
          "attributes": [
            { "trait": "Make", "value": make},
            { "trait": "Model", "value": model},
            { "trait": "Year", "value": car.year},
            { "trait": "VIN", "value": car.vin},
            { "trait": "Registration Number", "value": "ABC1234"},
            { "trait": "Transmission", "value": "Manual"},
            { "trait": "Fuel Type", "value": "Electric"},
  
          ]
        })
      })
      const data: any = await response.json();
      console.log("IPFS URL:", data.url);
      return data;
    } catch (error) {
      console.error("IPFS upload error:", error);
    }

  }

  