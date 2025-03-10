import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";

describe("Token", function () {
    let carMarketplace;
    let owner;
    let buyer;
    let seller;
    let tokenId;
  
    // Test car details
    const testCar = {
        make: "Toyota",
        model: "Prius",
        year: 2020,
        vin: "1HGCM82633A123456",
        tokenURI: "ipfs://QmTest"
    };

    const testCar2 = {
        make: "Ford",
        model: "Fiesta",
        year: 2020,
        vin: "AW12KFS",
        tokenURI: "ipfs://KfTest"
    }

    async function deployTokenFixture() {
        [owner, buyer, seller] = await hre.ethers.getSigners();
        const CarFactory = await hre.ethers.getContractFactory("CarMarketplace");
        carMarketplace = await CarFactory.deploy();

        // Minted car token for testing
        const mintedCar = await carMarketplace.mintCar(
            owner.address,
            testCar.make,
            testCar.model,
            testCar.year,
            testCar.vin,
            testCar.tokenURI
        )

        const mintedCar2 = await carMarketplace.mintCar(
            seller.address,
            testCar2.make,
            testCar2.model,
            testCar2.year,
            testCar2.vin,
            testCar2.tokenURI
        )

         // Get the tokenId from the CarMinted event
        // const receipt = await mintedCar.wait();
        // const event: any = receipt?.events.find(event: any => event.event === 'CarMinted');
        // tokenId = event.args.tokenId;

        return { carMarketplace, owner, buyer, seller, mintedCar }
    }

    describe("Contract", function() {
        it("Should set the right owner", async function() {
            const { carMarketplace, owner, buyer }: any = await loadFixture(deployTokenFixture);
            expect(await carMarketplace.owner()).to.equal(owner.address);
        })

    })

    describe("Listing car for sale", function() {
        it("Should allow owner to list their car for sale", async function() {
            const { carMarketplace, owner, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const price = hre.ethers.parseEther('1'); // 1 ETH

            // List the car for sale
            await expect(carMarketplace.connect(seller).listCarForSale(tokenId, price)) // buyer will be treated as the msg.sender
            .to.emit(carMarketplace, 'CarListedForSale')
            .withArgs(tokenId, price)

            // Verify the car details were updated correctly
            const carDetails = await carMarketplace.getCarDetails(tokenId);
            expect(carDetails.forSale).to.equal(true);
            expect(carDetails.price).to.equal(price);
        })

        it("Should revert if non-owner tries to list the car", async function() {
            const { carMarketplace, buyer }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const listingPrice = hre.ethers.parseEther('1');

            await expect(carMarketplace?.connect(buyer).listCarForSale(tokenId, listingPrice))
            .to.be.revertedWith('Only the owner of the vehicle can list it for sale.');
        })

        it("Should revert if price is zero", async function() {
            const { carMarketplace, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const listingPrice = hre.ethers.parseEther('0');

            await expect(carMarketplace.connect(seller).listCarForSale(tokenId, listingPrice))
            .to.be.revertedWith("Price must be greater than zero.")
        })

        it("Update the price of an already listed car", async function() {
            const { carMarketplace, owner, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const initialPrice = hre.ethers.parseEther('2');
            const newPrice = hre.ethers.parseEther('1');
 
            // First listing the car
            await carMarketplace.connect(seller).listCarForSale(tokenId, initialPrice);
            
            // Update price
            await expect(carMarketplace.connect(seller).listCarForSale(tokenId, newPrice))
                .to.emit(carMarketplace, "CarListedForSale")
                .withArgs(tokenId, newPrice);
            
            // Verify the new price is set
            const carDetails = await carMarketplace.getCarDetails(tokenId);
            expect(carDetails.price).to.equal(newPrice);
        })
    })

    describe("Purchasing a listed car", function() {
        it("Should allow a buyer to purchase a listed car", async function() {
            const { carMarketplace, owner, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const listingPrice = hre.ethers.parseEther('1');

            // Get seller's inital balance
            const initialSellerBalance = await hre.ethers.provider.getBalance(seller.address);

            // List car for sale
            await carMarketplace.connect(seller).listCarForSale(tokenId, listingPrice);
            
            // Buy the car
            await expect(
                carMarketplace.connect(buyer).buyCar(tokenId, { value: listingPrice })
            ).to.emit(carMarketplace, 'CarSold')
            .withArgs(tokenId, buyer.address, listingPrice);

            // Grab car details
            const carDetails = await carMarketplace.getCarDetails(tokenId);

            // Verify the the state has changed correctly
            expect(await carMarketplace.ownerOf(tokenId)).to.equal(buyer.address);
            expect(carDetails.forSale).to.be.equal(false);
            expect(carDetails.price).to.be.equal(0);
        })

        it("Should revert if insufficient ETH is sent", async function() {
            const { carMarketplace, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const listingPrice = hre.ethers.parseEther('1');
            const offeredPrice = hre.ethers.parseEther('0.7');

            // List car for sale
            await carMarketplace.connect(seller).listCarForSale(tokenId, listingPrice);

            // Attempt to buy car with insufficient funds
            await expect(carMarketplace.connect(buyer).buyCar(tokenId, { value: offeredPrice }))
                .to.be.revertedWith("Insufficient ETH sent.");
        })

        it("Should revert if seller tries to buy their own car", async function() {
            const { carMarketplace, buyer, seller }: any = await loadFixture(deployTokenFixture);
            tokenId = 1;
            const listingPrice = hre.ethers.parseEther('1');

            // List car for sale
            await carMarketplace.connect(seller).listCarForSale(tokenId, listingPrice);

            // Attempt to buy own car
            await expect(carMarketplace.connect(seller).buyCar(tokenId, { value: listingPrice}))
                .to.be.revertedWith("You cannot buy your own car.");
        })

    })

})