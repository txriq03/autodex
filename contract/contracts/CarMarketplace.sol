// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import {ERC721URIStorage, ERC721} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

contract CarMarketplace is ERC721URIStorage, Ownable {
    uint256 private nextTokenId;

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

    constructor() ERC721("AutoDex", "ADX") Ownable(msg.sender) {
        nextTokenId = 1;
    }

    // Function to mint a new car token
    function mintCar(
        string memory vin,
        uint256 price,
        string memory tokenURI
    ) public {
        require(bytes(vin).length > 0, "VIN must be provided");
        require(
            bytes(vin).length == 17,
            "Incorrect number of characters provided for VIN"
        );
        // Check if the VIN already exists, while getting the correct nextTokenId
        require(vinToId[vin] == 0, "VIN already used");

        uint256 tokenId = nextTokenId;

        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);

        // Creating the car struct
        cars[tokenId] = Car({
            tokenId: tokenId,
            tokenURI: tokenURI,
            price: price
        });

        vinToId[vin] = tokenId;
        ownershipHistory[tokenId].push(
            OwnershipRecord({owner: msg.sender, timestamp: block.timestamp})
        );

        nextTokenId++;
        emit CarMinted(tokenId, msg.sender, vin);
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
        require(
            getApproved(tokenId) == address(this) ||
                isApprovedForAll(seller, address(this)),
            "Contract not approved to transfer this token"
        );

        // Transfer ownership
        _transfer(seller, msg.sender, tokenId);
        ownershipHistory[tokenId].push(
            OwnershipRecord({owner: msg.sender, timestamp: block.timestamp})
        );

        // Transfer funds to seller
        payable(seller).transfer(msg.value);

        // Update ownership details and reset values
        cars[tokenId].price = 0;

        emit CarSold(tokenId, msg.sender, msg.value);
    }

    // Function to get car details by tokenId
    function getCarDetails(uint256 tokenId) public view returns (Car memory) {
        _requireOwned(tokenId);
        return cars[tokenId];
    }

    // List of getter functions
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
    function getIsServiceProvider(address provider) public view returns (bool) {
        return isServiceProvider[provider];
    }
    function getServiceHistory(
        uint256 tokenId
    ) public view returns (ServiceRecord[] memory) {
        require(_ownerOf(tokenId) != address(0), "Car does not exist");
        return serviceLogs[tokenId];
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
}
