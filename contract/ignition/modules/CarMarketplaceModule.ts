import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CarMarketplaceModule = buildModule("CarMarketplaceModule", (m) => {
    const carContract = m.contract("CarMarketplace");

    return { carContract };
})

export default CarMarketplaceModule;