// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {LibDiamond} from "../../shared/libraries/LibDiamond.sol";

struct Dathlete {
    address owner;
    bool locked;
    uint16 seasonId;
    uint32 id;
}

struct ChallengeType {
    string name;
    string description;
    uint256 maxQuantity; //Total number that can be minted of this challenge.
    uint256 totalQuantity; //The total quantity of this challenge minted so far
    uint32 id;
    bool canPurchaseWithPrtcle;
    uint256 prtclePrice; //How much PRTCLE this challenge costs
    bool canBeTransferred;
    string believerOption;
    string doubterOption;
    uint8 status; //(0) Open | (1) Active | (2) Resolved | (3) Cancelled
    uint8 result; // (0) No result | (1) Believers | (2) Doubters
    address resolver;
    uint32 dathleteId;
}

struct Prediction {
    uint32 id;
    address owner;
    uint32 challengeId;
    bool isBeliever;
    address token;
    uint256 amount;
}

struct Season {
    uint256 seasonMaxSize; //The max size of the Haunt
    uint256 dathletePrice;
    uint24 totalCount;
}

struct AppStorage {
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) nftChallengeBalances;
    mapping(address => mapping(uint256 => uint256[])) nftChallenges;
    ChallengeType[] challengeTypes;
    // indexes are stored 1 higher so that 0 means no items in items array
    mapping(address => mapping(uint256 => mapping(uint256 => uint256))) nftChallengeIndexes;
    mapping(uint256 => Season) seasons;
    mapping(address => mapping(uint256 => uint256)) ownerChallengeBalances;
    mapping(address => uint256[]) ownerChallenges;
    // indexes are stored 1 higher so that 0 means no items in items array
    mapping(address => mapping(uint256 => uint256)) ownerChallengeIndexes;
    mapping(uint256 => Dathlete) dathletes;
    mapping(address => uint32[]) ownerTokenIds;
    mapping(address => mapping(uint256 => uint256)) ownerTokenIdIndexes;
    uint32[] tokenIds;
    mapping(uint256 => uint256) tokenIdIndexes;
    mapping(address => mapping(address => bool)) operators;
    mapping(uint256 => address) approved;
    Prediction[] predictions;
    mapping(uint32 => uint32[]) challengePredictions;
    mapping(address => mapping(uint256 => uint256)) ownerPredictionIdIndexes;
    mapping(uint32 => uint256) predictionBelieverBalance;
    mapping(uint32 => mapping(address => uint256)) predictionDoubterBalance;
    uint32 tokenIdCounter;
    uint16 currentSeasonId;
    string challengesBaseUri;
    string name;
    string symbol;
    address prtcleContract;
    address dao;
    address daoTreasury;
    mapping(address => bool) allowedTokens;
    mapping(address => bool) challengeManagers;
}

library LibAppStorage {
    function diamondStorage() internal pure returns (AppStorage storage ds) {
        assembly {
            ds.slot := 0
        }
    }
}

contract Modifiers {
    AppStorage internal s;
    modifier onlyDathleteOwner(uint256 _tokenId) {
        require(msg.sender == s.dathletes[_tokenId].owner, "LibAppStorage: Only dathlete owner can call this function");
        _;
    }
    modifier onlyUnlocked(uint256 _tokenId) {
        require(s.dathletes[_tokenId].locked == false, "LibAppStorage: Only callable on unlocked Dathlete");
        _;
    }

    modifier onlyOwner() {
        LibDiamond.enforceIsContractOwner();
        _;
    }

    modifier onlyDao() {
        address sender = msg.sender;
        require(sender == s.dao, "Only DAO can call this function");
        _;
    }

    modifier onlyDaoOrOwner() {
        address sender = msg.sender;
        require(sender == s.dao || sender == LibDiamond.contractOwner(), "LibAppStorage: Do not have access");
        _;
    }

    modifier onlyChallengeManager() {
        address sender = msg.sender;
        require(s.challengeManagers[sender] == true, "LibAppStorage: only an ChallengeManager can call this function");
        _;
    }
    modifier onlyOwnerOrChallengeManager() {
        address sender = msg.sender;
        require(
            sender == LibDiamond.contractOwner() || s.challengeManagers[sender] == true,
            "LibAppStorage: only an Owner or ChallengeManager can call this function"
        );
        _;
    }

    modifier onlyChallengeResolver(uint256 _challengeId) {
        address sender = msg.sender;
        ChallengeType storage challenge = s.challengeTypes[_challengeId];
        require(sender == challenge.resolver, "LibAppStorage: only a ChallengeResolver can call this function");
        _;
    }
    modifier onlyChallengeManagerOrChallengeResolver(uint256 _challengeId) {
        address sender = msg.sender;
        ChallengeType storage challenge = s.challengeTypes[_challengeId];
        require(
            sender == challenge.resolver || s.challengeManagers[sender] == true,
            "LibAppStorage: only a ChallengeResolver can call this function"
        );
        _;
    }
}
