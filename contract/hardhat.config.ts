import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { resolve } from "path";

dotenv.config({ path: resolve(__dirname, ".env.local") });

const PRIVATE_KEY = process.env.PRIVATE_KEY
const ALCHEMY_URL = process.env.ALCHEMY_URL

// if (!PRIVATE_KEY) {
//   throw new Error("PRIVATE_KEY is not set in environment variables");
// }

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: ALCHEMY_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : []
    }
  }
};

export default config;
