// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CarMarketplace is ERC721URIStorage, Ownable {
    uint256 private nextTokenId = 1;

    struct Car {
        uint256 tokenId;
        string tokenURI;
        uint256 price;
    }
    struct ServiceRecord {
        uint256 date;
        string description;
        string garageName;
        uint256 mileage;
    }
    struct OwnershipRecord {
        address owner;
        uint256 timestamp;
    }

    mapping(uint256 => Car) private cars; // tokenID mapped to Car struct
    mapping(string => uint256) private vinToId;
    mapping(uint256 => ServiceRecord[]) private serviceLogs;
    mapping(address => bool) public isServiceProvider;
    mapping(uint256 => OwnershipRecord[]) private ownershipHistory; // tokenID to list of ownership records

    event CarMinted(uint256 tokenId, address owner, string vin);
    event CarListedForSale(uint256 tokenId, uint256 price);
    event CarSold(uint256 tokenId, address newOwner, uint256 price);
    event ServiceProviderAdded(address indexed provider);
    event ServiceProviderRemoved(address indexed provider);
    event ServiceRecordAdded(uint256 indexed tokenId, string description);
    event OwnershipTransferred(uint256 tokenId, address from, address to);

    constructor() ERC721("AutoDex", "ADX") Ownable(msg.sender) {}

    // Function to mint a new car token
    function mintCar(
        address to,
        string memory vin,
        uint256 price,
        string memory tokenURI
    ) public {
        require(bytes(vin).length > 0, "VIN must be provided");

        // Check if the VIN already exists, while getting the correct nextTokenId
        require(vinToId[vin] == 0, "VIN already used");

        uint256 tokenId = nextTokenId;

        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Creating the car struct
        cars[tokenId] = Car({
            tokenId: tokenId,
            tokenURI: tokenURI,
            price: price
        });

        vinToId[vin] = tokenId;
        ownershipHistory[tokenId].push(
            OwnershipRecord({owner: to, timestamp: block.timestamp})
        );

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

        cars[tokenId].price = price;
        emit CarListedForSale(tokenId, price);
    }

    function buyCar(uint256 tokenId) public payable {
        address seller = ownerOf(tokenId);

        require(cars[tokenId].price > 0, "Car is not for sale");
        require(msg.value >= cars[tokenId].price, "Insufficient ETH sent.");
        require(seller != msg.sender, "You cannot buy your own car.");

        console.log("msg.sender:", msg.sender);
        console.log("ownerOf(tokenId):", ownerOf(tokenId));
        console.log("price sent:", msg.value);
        console.log("price expected:", cars[tokenId].price);

        // Transfer ownership
        transferFrom(seller, msg.sender, tokenId);

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        // Update ownership details and reset values
        cars[tokenId].price = 0;

        emit CarSold(tokenId, msg.sender, msg.value);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public override(ERC721, IERC721) {
        super.transferFrom(from, to, tokenId);
        ownershipHistory[tokenId].push(
            OwnershipRecord({owner: to, timestamp: block.timestamp})
        );
        emit OwnershipTransferred(tokenId, from, to);
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

    function getTokenIdByVIN(string memory vin) public view returns (uint256) {
        uint256 tokenId = vinToId[vin];
        require(_ownerOf(tokenId) != address(0), "VIN not found");
        return tokenId;
    }

    function getOwnershipHistory(
        uint256 tokenId
    ) public view returns (OwnershipRecord[] memory) {
        return ownershipHistory[tokenId];
    }

    function getPrice(uint256 tokenId) public view returns (uint256) {
        return cars[tokenId].price;
    }

    function addServiceProvider(address provider) public onlyOwner {
        require(!isServiceProvider[provider], "Already authorized");
        isServiceProvider[provider] = true;
        emit ServiceProviderAdded(provider);
    }

    function removeServiceProvider(address provider) public onlyOwner {
        require(isServiceProvider[provider], "Not authorized");
        isServiceProvider[provider] = false;
        emit ServiceProviderRemoved(provider);
    }

    function getIsServiceProvider(address provider) public view returns (bool) {
        return isServiceProvider[provider];
    }
    // Add a service record (MOT-style)
    function addServiceRecord(
        uint256 tokenId,
        string memory description,
        string memory garageName,
        uint256 mileage
    ) public {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        require(
            isServiceProvider[msg.sender],
            "Not authorized to add service record"
        );

        serviceLogs[tokenId].push(
            ServiceRecord({
                date: block.timestamp,
                description: description,
                garageName: garageName,
                mileage: mileage
            })
        );

        emit ServiceRecordAdded(tokenId, description);
    }

    // Get service history
    function getServiceHistory(
        uint256 tokenId
    ) public view returns (ServiceRecord[] memory) {
        require(_ownerOf(tokenId) != address(0), "Car does not exist");
        return serviceLogs[tokenId];
    }
}
