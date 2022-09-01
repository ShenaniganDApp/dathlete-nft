// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {AppStorage} from "./libraries/LibAppStorage.sol";
import {LibDiamond} from "../shared/libraries/LibDiamond.sol";
import {IDiamondCut} from "../shared/interfaces/IDiamondCut.sol";
import {IERC165} from "../shared/interfaces/IERC165.sol";
import {IDiamondLoupe} from "../shared/interfaces/IDiamondLoupe.sol";
import {IERC173} from "../shared/interfaces/IERC173.sol";

contract InitDiamond {
    AppStorage internal s;

    struct Args {
        address dao;
        address daoTreasury;
        address prtcleContract;
        string name;
        string symbol;
        address[] allowedTokens;
    }

    function init(Args memory _args) external {
        LibDiamond.DiamondStorage storage ds = LibDiamond.diamondStorage();

        // adding ERC165 data
        ds.supportedInterfaces[type(IERC165).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondCut).interfaceId] = true;
        ds.supportedInterfaces[type(IDiamondLoupe).interfaceId] = true;
        ds.supportedInterfaces[type(IERC173).interfaceId] = true;

        s.dao = _args.dao;
        s.daoTreasury = _args.daoTreasury;
        s.prtcleContract = _args.prtcleContract;
        s.challengesBaseUri = "ipfs://f0{id}";

        for (uint256 i; i < _args.allowedTokens.length; i++) {
            address token = _args.allowedTokens[i];
            s.allowedTokens[token] = true;
        }

        s.name = _args.name;
        s.symbol = _args.symbol;
    }
}
