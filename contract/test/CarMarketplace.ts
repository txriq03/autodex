import { ethers } from "hardhat";
import { expect } from "chai";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";
import { CarMarketplace } from "../typechain-types";

describe("CarMarketplace", function () {
  let carMarketplace: CarMarketplace;
  let owner: SignerWithAddress;
  let user1: SignerWithAddress;
  let user2: SignerWithAddress;
  let provider: SignerWithAddress;

  const vin = "1HGCM82633A004352"; // 17 characters
  const tokenURI = "ipfs://example";
  const price = ethers.parseEther("1");

  beforeEach(async () => {
    [owner, user1, user2, provider] = await ethers.getSigners();

    const CarMarketplaceFactory = await ethers.getContractFactory(
      "CarMarketplace"
    );
    carMarketplace = await CarMarketplaceFactory.deploy();
  });

  describe("Minting", () => {
    it("should mint a car with a unique VIN", async () => {
      await carMarketplace
        .connect(user1)
        .mintCar(user1.address, vin, price, tokenURI);
      const tokenId = await carMarketplace.getTokenIdByVIN(vin);
      expect(await carMarketplace.ownerOf(tokenId)).to.equal(user1.address);
    });

    it("should fail to mint with duplicate VIN", async () => {
      await carMarketplace
        .connect(user1)
        .mintCar(user1.address, vin, price, tokenURI);
      await expect(
        carMarketplace
          .connect(user2)
          .mintCar(user2.address, vin, price, tokenURI)
      ).to.be.revertedWith("VIN already used");
    });

    it("should require 17-character VIN", async () => {
      const invalidVin = "12345";
      await expect(
        carMarketplace
          .connect(user1)
          .mintCar(user1.address, invalidVin, price, tokenURI)
      ).to.be.revertedWith("Incorrect number of characters provided for VIN");
    });
  });

  describe("Listing and Buying", () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await carMarketplace
        .connect(user1)
        .mintCar(user1.address, vin, 0, tokenURI);
      tokenId = await carMarketplace.getTokenIdByVIN(vin);
    });

    it("should allow owner to list a car for sale", async () => {
      await carMarketplace.connect(user1).listCarForSale(tokenId, price);
      const car = await carMarketplace.getCarDetails(tokenId);
      expect(car.price).to.equal(price);
    });

    it("should not allow non-owner to list the car", async () => {
      await expect(
        carMarketplace.connect(user2).listCarForSale(tokenId, price)
      ).to.be.revertedWith(
        "Only the owner of the vehicle can list it for sale."
      );
    });

    it("should allow user to buy a listed car", async () => {
      await carMarketplace.connect(user1).listCarForSale(tokenId, price);

      // Allow marketplace contract to transfer the NFT
      await carMarketplace.connect(user1).approve(user2, tokenId);

      await expect(() =>
        carMarketplace.connect(user2).buyCar(tokenId, { value: price })
      ).to.changeEtherBalance(user1, price);

      const newOwner = await carMarketplace.ownerOf(tokenId);
      expect(newOwner).to.equal(user2.address);

      const car = await carMarketplace.getCarDetails(tokenId);
      expect(car.price).to.equal(0);
    });

    it("should fail if car is not listed", async () => {
      await expect(
        carMarketplace.connect(user2).buyCar(tokenId, { value: price })
      ).to.be.revertedWith("Car is not for sale");
    });

    it("should fail with insufficient ETH", async () => {
      await carMarketplace.connect(user1).listCarForSale(tokenId, price);
      await expect(
        carMarketplace.connect(user2).buyCar(tokenId, {
          value: ethers.parseEther("0.5"),
        })
      ).to.be.revertedWith("Insufficient ETH sent.");
    });

    it("should not allow seller to buy their own car", async () => {
      await carMarketplace.connect(user1).listCarForSale(tokenId, price);
      await expect(
        carMarketplace.connect(user1).buyCar(tokenId, { value: price })
      ).to.be.revertedWith("You cannot buy your own car.");
    });
  });

  describe("Service Providers", () => {
    let tokenId: bigint;

    beforeEach(async () => {
      await carMarketplace
        .connect(user1)
        .mintCar(user1.address, vin, price, tokenURI);
      tokenId = await carMarketplace.getTokenIdByVIN(vin);
    });

    it("should allow owner to add a service provider", async () => {
      await carMarketplace.connect(owner).addServiceProvider(provider.address);
      const isAuthorized = await carMarketplace.getIsServiceProvider(
        provider.address
      );
      expect(isAuthorized).to.be.true;
    });

    it("should allow authorized provider to add a service record", async () => {
      await carMarketplace.connect(owner).addServiceProvider(provider.address);

      await carMarketplace
        .connect(provider)
        .addServiceRecord(tokenId, "Brake check", "Garage A", 15000);

      const records = await carMarketplace.getServiceHistory(tokenId);
      expect(records.length).to.equal(1);
      expect(records[0].description).to.equal("Brake check");
    });

    it("should not allow unauthorized provider to add a service record", async () => {
      await expect(
        carMarketplace
          .connect(user2)
          .addServiceRecord(tokenId, "Brake check", "Garage A", 15000)
      ).to.be.revertedWith("Not authorized to add service record");
    });

    it("should allow owner to remove a service provider", async () => {
      await carMarketplace.connect(owner).addServiceProvider(provider.address);
      await carMarketplace
        .connect(owner)
        .removeServiceProvider(provider.address);
      const isAuthorized = await carMarketplace.getIsServiceProvider(
        provider.address
      );
      expect(isAuthorized).to.be.false;
    });
  });
});
