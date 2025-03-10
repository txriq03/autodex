import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const carModule = buildModule("CarMarketplaceModule", (m) => {
    const carContract = m.contract("CarMarketplace");

    return { carContract };
})

export default carModule;