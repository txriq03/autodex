// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CarMarketplace is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;

    struct Car {
        string make;
        string model;
        uint256 year;
        string vin; // Unique Vehicle Identification Number
        uint256 mileage;
        bool forSale;
        uint256 price;
        string tokenURI;
    }

    mapping(uint256 => Car) private cars; // tokenID mapped to Car struct
    mapping(uint256 => address payable) private carOwners; // tokenId linked to owner's address
    mapping(string => uint256 id) private vinToId; // Used to find VIN number from tokenID

    event CarMinted(uint256 tokenId, address owner, string vin);
    event CarListedForSale(uint256 tokenId, uint256 price);
    event CarSold(uint256 tokenId, address newOwner, uint256 price);

    constructor() ERC721("AutoDex", "ADX") Ownable(msg.sender) {}

    // Function to mint a new car token
    function mintCar(
        address to,
        string memory make,
        string memory model,
        uint256 year,
        string memory vin,
        uint256 mileage,
        uint256 price,
        string memory tokenURI
    ) public onlyOwner {
        require(bytes(vin).length > 0, "VIN must be provided");

        // Check if the VIN already exists, while getting the correct nextTokenId
        for (uint256 i = 0; i < nextTokenId; i++) {
            require(
                keccak256(abi.encodePacked(cars[i].vin)) !=
                    keccak256(abi.encodePacked(vin)),
                "VIN already exists"
            );
        }

        uint256 tokenId = nextTokenId;
        cars[tokenId] = Car(make, model, year, vin, mileage, true, price, tokenURI);
        carOwners[tokenId] = payable(to);
        vinToId[vin] = tokenId;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        nextTokenId++;
        emit CarMinted(tokenId, to, vin);
    }

    // Function puts the car up for sale
    function listCarForSale(uint256 tokenId, uint256 price) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only the owner of the vehicle can list it for sale."
        );
        require(price > 0, "Price must be greater than zero.");

        cars[tokenId].forSale = true;
        cars[tokenId].price = price;
        emit CarListedForSale(tokenId, price);
    }

    function buyCar(uint256 tokenId) public payable {
        require(cars[tokenId].forSale, "Car is not for sale");
        require(msg.value >= cars[tokenId].price, "Insufficient ETH sent.");

        address payable seller = carOwners[tokenId];
        require(seller != msg.sender, "You cannot buy your own car.");

        // Transfer ownership
        _transfer(seller, msg.sender, tokenId);

        // Transfer funds to seller
        seller.transfer(msg.value);

        // Update ownership details and reset values
        carOwners[tokenId] = payable(msg.sender);
        cars[tokenId].forSale = false;
        cars[tokenId].price = 0;

        emit CarSold(tokenId, msg.sender, msg.value);
    }

    // Function to get car details by tokenId
    function getCarDetails(uint256 tokenId) public view returns (Car memory) {
        _requireOwned(tokenId);
        // require(_exists(tokenId), "Car token does not exist");
        // require(_ownerOf(tokenId), "Car token does not exist.");
        return cars[tokenId];
    }

    // Function to fetch all cars
    function getAllCars() public view returns (Car[] memory) {
        Car[] memory all = new Car[](nextTokenId);
        for (uint256 i = 0; i < nextTokenId; i++) {
            all[i] = cars[i];
        }
        return all;
    }
}
