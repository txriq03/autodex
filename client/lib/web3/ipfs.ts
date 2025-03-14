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

  export const uploadImageToIPFS = async (file: File) => {
    const formData = new FormData();
    console.log("File is", file);
    console.log("Type:", typeof file);
    console.log("Instanceof File:", file instanceof File);
    formData.append("network", "public");
    formData.append("file", file);

    try {
      const res = await fetch("/api/imageurl", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error("Failed to upload to IPFS");
      }

      const data = await res.json();
      console.log("Image IPFS upload response:", data);

      return data; // ✅ return the IPFS URL here
    } catch (err) {
      console.error("Image IPFS upload error:", err);
      throw err; // rethrow so it can be caught in the outer try/catch
    }
  };

  