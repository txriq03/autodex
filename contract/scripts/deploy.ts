import hre from "hardhat";
import CarMarketplaceModule from "../ignition/modules/CarMarketplaceModule";

async function main() {
  const { carContract } = await hre.ignition.deploy(CarMarketplaceModule);

  console.log(`AutoDex deployed to: ${await carContract.getAddress()}`);
}

main().catch(console.error);