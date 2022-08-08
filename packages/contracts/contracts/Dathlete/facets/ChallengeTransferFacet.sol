// SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {Modifiers, Dathlete} from "../libraries/LibAppStorage.sol";
import {IERC721} from "../../shared/interfaces/IERC721.sol";
import {LibChallenges} from "../libraries/LibChallenges.sol";
import {LibERC1155} from "../../shared/libraries/LibERC1155.sol";

contract ChallengeTransferFacet is Modifiers {
    /**
        @notice Transfers `_value` amount of an `_id` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if balance of holder for token `_id` is lower than the `_value` sent.
        MUST revert on any other error.
        MUST emit the `TransferSingle` event to reflect the balance change (see "Safe Transfer Rules" section of the standard).
        After the above conditions are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call `onERC1155Received` on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _id      ID of the token type
        @param _value   Transfer amount
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to `onERC1155Received` on `_to`
    */
    function safeTransferFrom(
        address _from,
        address _to,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external {
        require(_to != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        address sender = msg.sender;
        require(
            sender == _from || s.operators[_from][sender] || sender == address(this),
            "ChallengesTransfer: Not owner and not approved to transfer"
        );
        LibChallenges.removeFromOwner(_from, _id, _value);
        LibChallenges.addToOwner(_to, _id, _value);
        emit LibERC1155.TransferSingle(sender, _from, _to, _id, _value);
        LibERC1155.onERC1155Received(sender, _from, _to, _id, _value, _data);
    }

    /**
        @notice Transfers `_values` amount(s) of `_ids` from the `_from` address to the `_to` address specified (with safety call).
        @dev Caller must be approved to manage the tokens being transferred out of the `_from` account (see "Approval" section of the standard).
        MUST revert if `_to` is the zero address.
        MUST revert if length of `_ids` is not the same as length of `_values`.
        MUST revert if any of the balance(s) of the holder(s) for token(s) in `_ids` is lower than the respective amount(s) in `_values` sent to the recipient.
        MUST revert on any other error.
        MUST emit `TransferSingle` or `TransferBatch` event(s) such that all the balance changes are reflected (see "Safe Transfer Rules" section of the standard).
        Balance changes and events MUST follow the ordering of the arrays (_ids[0]/_values[0] before _ids[1]/_values[1], etc).
        After the above conditions for the transfer(s) in the batch are met, this function MUST check if `_to` is a smart contract (e.g. code size > 0). If so, it MUST call the relevant `ERC1155TokenReceiver` hook(s) on `_to` and act appropriately (see "Safe Transfer Rules" section of the standard).
        @param _from    Source address
        @param _to      Target address
        @param _ids     IDs of each token type (order and length must match _values array)
        @param _values  Transfer amounts per token type (order and length must match _ids array)
        @param _data    Additional data with no specified format, MUST be sent unaltered in call to the `ERC1155TokenReceiver` hook(s) on `_to`
    */
    function safeBatchTransferFrom(
        address _from,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values,
        bytes calldata _data
    ) external {
        require(_to != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        require(_ids.length == _values.length, "ChallengesTransfer: ids not same length as values");
        address sender = msg.sender;
        require(sender == _from || s.operators[_from][sender], "ChallengesTransfer: Not owner and not approved to transfer");
        for (uint256 i; i < _ids.length; i++) {
            uint256 id = _ids[i];
            uint256 value = _values[i];
            LibChallenges.removeFromOwner(_from, id, value);
            LibChallenges.addToOwner(_to, id, value);
        }
        emit LibERC1155.TransferBatch(sender, _from, _to, _ids, _values);
        LibERC1155.onERC1155BatchReceived(sender, _from, _to, _ids, _values, _data);
    }

    /// @notice Transfer token from owner address to a token
    /// @param _from The owner address
    /// @param _id ID of the token
    /// @param _toContract The ERC721 contract of the receiving token
    /// @param _toTokenId The receiving token
    /// @param _value The amount of tokens to transfer
    function transferToParent(
        address _from,
        address _toContract,
        uint256 _toTokenId,
        uint256 _id,
        uint256 _value
    ) external {
        require(_toContract != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        address sender = msg.sender;
        require(sender == _from || s.operators[_from][sender], "ChallengesTransfer: Not owner and not approved to transfer");
        LibChallenges.removeFromOwner(_from, _id, _value);
        LibChallenges.addToParent(_toContract, _toTokenId, _id, _value);
        emit LibERC1155.TransferSingle(sender, _from, _toContract, _id, _value);
        emit LibERC1155.TransferToParent(_toContract, _toTokenId, _id, _value);
    }

    /// @notice Transfer ERC1155 tokens from owner address to a set of parent ERC721 tokens
    /// @param _from The owner address
    /// @param _toContract The ERC721 contract of the receiving token //will be the same for all the tokenIDs
    /// @param _toTokenIds IDs of the tokens receiving
    ///@param _ids IDs of the tokens to transfer
    /// @param _values The amounts of tokens to transfer
    function batchBatchTransferToParent(
        address _from,
        address _toContract,
        uint256[] calldata _toTokenIds,
        uint256[][] calldata _ids,
        uint256[][] calldata _values
    ) external {
        require(_toContract != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        require(_toTokenIds.length == _ids.length, "ChallengesTransfer: ids.length not the same as toTokenIds length");
        require(_ids.length == _values.length, "ChallengesTransfer: ids.length not the same as values.length");
        for (uint256 index = 0; index < _toTokenIds.length; index++) {
            uint256 tokenId = _toTokenIds[index];
            uint256[] calldata ids = _ids[index];
            uint256[] calldata values = _values[index];
            batchTransferToParent(_from, _toContract, tokenId, ids, values);
        }
    }

    /// @notice Transfer ERC1155 tokens from owner address to a parent ERC721 token
    /// @param _from The owner address
    /// @param _toContract The ERC721 contract of the receiving token
    /// @param _toTokenId ID of the token receiving
    ///@param _ids IDs of the tokens to transfer
    /// @param _values The amounts of tokens to transfer
    function batchTransferToParent(
        address _from,
        address _toContract,
        uint256 _toTokenId,
        uint256[] calldata _ids,
        uint256[] calldata _values
    ) public {
        require(_toContract != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        require(_ids.length == _values.length, "ChallengesTransfer: ids.length not the same as values.length");
        address sender = msg.sender;
        require(sender == _from || s.operators[_from][sender], "ChallengesTransfer: Not owner and not approved to transfer");
        for (uint256 i; i < _ids.length; i++) {
            uint256 id = _ids[i];
            uint256 value = _values[i];
            LibChallenges.removeFromOwner(_from, id, value);
            LibChallenges.addToParent(_toContract, _toTokenId, id, value);
            emit LibERC1155.TransferToParent(_toContract, _toTokenId, id, value);
        }
        emit LibERC1155.TransferBatch(sender, _from, _toContract, _ids, _values);
    }

    function transferFromTokenApproved(
        address _sender,
        address _fromContract,
        uint256 _fromTokenId
    ) internal view {
        if (_fromContract == address(this)) {
            address owner = s.dathletes[_fromTokenId].owner;
            require(
                _sender == owner || s.operators[owner][_sender] || _sender == s.approved[_fromTokenId],
                "ChallengesTransfer: Not owner and not approved to transfer"
            );
            require(s.dathletes[_fromTokenId].locked == false, "ChallengesTransfer: Only callable on unlocked Dathletes");
        } else {
            address owner = IERC721(_fromContract).ownerOf(_fromTokenId);
            require(
                owner == _sender ||
                    IERC721(_fromContract).getApproved(_fromTokenId) == _sender ||
                    IERC721(_fromContract).isApprovedForAll(owner, _sender),
                "ChallengesTransfer: Not owner and not approved to transfer"
            );
        }
    }

    /// @notice Transfer token from a token to an address
    /// @param _fromContract The address of the owning contract
    /// @param _fromTokenId The owning token
    /// @param _to The address the token is transferred to
    /// @param _id ID of the token
    /// @param _value The amount of tokens to transfer
    function transferFromParent(
        address _fromContract,
        uint256 _fromTokenId,
        address _to,
        uint256 _id,
        uint256 _value
    ) external {
        require(_to != address(0), "ChallengesTransfer: Can't transfer to 0 address");

        //To do: Check if the challenge can be transferred.
        require(s.challengeTypes[_id].canBeTransferred, "ChallengesTransfer: Challenge cannot be transferred");

        address sender = msg.sender;
        transferFromTokenApproved(sender, _fromContract, _fromTokenId);
        LibChallenges.removeFromParent(_fromContract, _fromTokenId, _id, _value);
        LibChallenges.addToOwner(_to, _id, _value);
        emit LibERC1155.TransferSingle(sender, _fromContract, _to, _id, _value);
        emit LibERC1155.TransferFromParent(_fromContract, _fromTokenId, _id, _value);
    }

    /// @notice Transfer tokens from a token to an address
    /// @param _fromContract The address of the owning contract
    /// @param _fromTokenId The owning token
    /// @param _to The address the token is transferred to
    /// @param _ids IDs of the tokens to be transferred out
    ///@param _values Values of the tokens to be transferred out
    function batchTransferFromParent(
        address _fromContract,
        uint256 _fromTokenId,
        address _to,
        uint256[] calldata _ids,
        uint256[] calldata _values
    ) external {
        require(_ids.length == _values.length, "ChallengesTransfer: ids.length not the same as values.length");
        require(_to != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        address sender = msg.sender;
        transferFromTokenApproved(sender, _fromContract, _fromTokenId);
        for (uint256 i; i < _ids.length; i++) {
            uint256 id = _ids[i];
            uint256 value = _values[i];

            //To do: Check if the challenge can be transferred.
            require(s.challengeTypes[id].canBeTransferred, "ChallengesTransfer: Challenge cannot be transferred");

            LibChallenges.removeFromParent(_fromContract, _fromTokenId, id, value);
            LibChallenges.addToOwner(_to, id, value);
            emit LibERC1155.TransferFromParent(_fromContract, _fromTokenId, id, value);
        }
        emit LibERC1155.TransferBatch(sender, _fromContract, _to, _ids, _values);
    }

    /// @notice Transfer challenge from an ERC721 parent token  to another ERC721 parent token
    /// @param _fromContract The ERC721 contract of the sending token
    /// @param _fromTokenId ID of the sending token
    /// @param _toContract The ERC721 contract of the receiving token
    /// @param _toTokenId The ID of the receiving token
    /// @param _value The amount of tokens to transfer

    function transferAsChild(
        address _fromContract,
        uint256 _fromTokenId,
        address _toContract,
        uint256 _toTokenId,
        uint256 _id,
        uint256 _value
    ) external {
        require(_toContract != address(0), "ChallengesTransfer: Can't transfer to 0 address");

        //To do: Check if the challenge can be transferred.
        require(s.challengeTypes[_id].canBeTransferred, "ChallengesTransfer: Challenge cannot be transferred");

        address sender = msg.sender;
        transferFromTokenApproved(sender, _fromContract, _fromTokenId);
        LibChallenges.removeFromParent(_fromContract, _fromTokenId, _id, _value);
        LibChallenges.addToParent(_toContract, _toTokenId, _id, _value);
        emit LibERC1155.TransferSingle(sender, _fromContract, _toContract, _id, _value);
        emit LibERC1155.TransferFromParent(_fromContract, _fromTokenId, _id, _value);
        emit LibERC1155.TransferToParent(_toContract, _toTokenId, _id, _value);
    }

    /// @notice Transfer challenges from an ERC721 parent token  to another ERC721 parent token
    /// @param _fromContract The ERC721 contract of the sending token
    /// @param _fromTokenId ID of the sending token
    /// @param _toContract The ERC721 contract of the receiving token
    /// @param _ids The IDs of the tokens to send
    /// @param _values The amounts of tokens to transfer
    function batchTransferAsChild(
        address _fromContract,
        uint256 _fromTokenId,
        address _toContract,
        uint256 _toTokenId,
        uint256[] calldata _ids,
        uint256[] calldata _values
    ) external {
        require(_ids.length == _values.length, "ChallengesTransfer: ids.length not the same as values.length");
        require(_toContract != address(0), "ChallengesTransfer: Can't transfer to 0 address");
        address sender = msg.sender;
        transferFromTokenApproved(sender, _fromContract, _fromTokenId);
        for (uint256 i; i < _ids.length; i++) {
            //To do: Check if the challenge can be transferred.

            uint256 id = _ids[i];
            uint256 value = _values[i];

            require(s.challengeTypes[id].canBeTransferred, "ChallengesTransfer: Challenge cannot be transferred");

            LibChallenges.removeFromParent(_fromContract, _fromTokenId, id, value);
            LibChallenges.addToParent(_toContract, _toTokenId, id, value);
            emit LibERC1155.TransferFromParent(_fromContract, _fromTokenId, id, value);
            emit LibERC1155.TransferToParent(_toContract, _toTokenId, id, value);
        }
        emit LibERC1155.TransferBatch(sender, _fromContract, _toContract, _ids, _values);
    }

    /**
        @notice Handle the receipt of a single ERC1155 token type.
        @dev An ERC1155-compliant smart contract MUST call this function on the token recipient contract, at the end of a `safeTransferFrom` after the balance has been updated.
        This function MUST return `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))` (i.e. 0xf23a6e61) if it accepts the transfer.
        This function MUST revert if it rejects the transfer.
        Return of any other value than the prescribed keccak256 generated value MUST result in the transaction being reverted by the caller.
        @return           `bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"))`
    */
    function onERC1155Received(
        address, /*_operator*/
        address, /*_from*/
        uint256, /*_id*/
        uint256, /*_value*/
        bytes calldata /*_data*/
    ) external pure returns (bytes4) {
        return LibERC1155.ERC1155_ACCEPTED;
    }

    /**
        @notice Handle the receipt of multiple ERC1155 token types.
        @dev An ERC1155-compliant smart contract MUST call this function on the token recipient contract, at the end of a `safeBatchTransferFrom` after the balances have been updated.
        This function MUST return `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))` (i.e. 0xbc197c81) if it accepts the transfer(s).
        This function MUST revert if it rejects the transfer(s).
        Return of any other value than the prescribed keccak256 generated value MUST result in the transaction being reverted by the caller.
        @return           `bytes4(keccak256("onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)"))`
    */
    function onERC1155BatchReceived(
        address, /*_operator*/
        address, /*_from*/
        uint256[] calldata, /*_ids*/
        uint256[] calldata, /*_values*/
        bytes calldata /*_data*/
    ) external pure returns (bytes4) {
        return LibERC1155.ERC1155_BATCH_ACCEPTED;
    }

    ///@notice Used to extract challenges that have been accidentally burned with Dathletes
    function extractChallengesFromBurnedDathlete(
        address _to,
        uint256 _tokenId,
        uint256[] calldata _challengeIds,
        uint256[] calldata _values
    ) external onlyChallengeManager {
        address sender = msg.sender;

        Dathlete storage dathlete = s.dathletes[_tokenId];
        require(dathlete.owner == address(0), "Dathlete has not been sacrificed");

        for (uint256 i; i < _challengeIds.length; i++) {
            uint256 challengeId = _challengeIds[i];
            uint256 value = _values[i];
            LibChallenges.removeFromParent(address(this), _tokenId, challengeId, value);
            LibChallenges.addToOwner(_to, challengeId, value);

            emit LibERC1155.TransferFromParent(sender, _tokenId, challengeId, value);
            emit LibERC1155.TransferSingle(sender, address(this), _to, challengeId, value);
        }
    }

    ///@notice Used to extract challenges that have been accidentally sent to the Diamond contract

    function extractChallengesFromDiamond(
        address _to,
        uint256[] calldata _challengeIds,
        uint256[] calldata _values
    ) external onlyChallengeManager {
        address sender = msg.sender;

        for (uint256 i; i < _challengeIds.length; i++) {
            uint256 challengeId = _challengeIds[i];
            uint256 value = _values[i];
            LibChallenges.removeFromOwner(address(this), challengeId, value);
            LibChallenges.addToOwner(_to, challengeId, value);
        }

        emit LibERC1155.TransferBatch(sender, address(this), sender, _challengeIds, _values);
    }
}
