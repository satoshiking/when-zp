//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;
pragma experimental "ABIEncoderV2";

import {ECDSA} from  "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

import "hardhat/console.sol";

contract Accounter {
    uint256 public lastPaymentBlock;  // block number of last payed salary

    struct Employee {
        address wallet;  // employee's wallet where the salary should be sent
        uint salaryUSD;  // employee's salary nominated in USD
    }

    Employee[] public employees;  // A dynamically-sized array of `Employee` structs.

    struct WithdrawalInfo {  // represents request for withdraw
        uint256 amount;
        address to;
    }

    string constant private MSG_PREFIX = "\x19Ethereum Signed Message:\n32";

    uint256 public nonce;
    mapping(address => bool) private _isValidSigner;
    uint private _threshold = 3;

    bool private _lock;
    modifier nonReentrant() {
        require(!_lock);
        _lock = true;
        _;
        _lock = false;
    }

    constructor(Employee[] memory _employees) {
        // Init contract for each of the provided employees adding then into array
        for (uint i = 0; i < _employees.length; i++) {
            employees.push(Employee({
                wallet: _employees[i].wallet,
                salaryUSD: _employees[i].salaryUSD
            }));
            // console.log("Initializing employee wallet=%s salary=%s", _employees[i].wallet, _employees[i].salaryUSD);
            _isValidSigner[_employees[i].wallet] = true;
        }
        // console.log("Done deploying");
    }

    receive() external payable {
        // standard function to allow everyone deposit ETH on contract
        // console.log("Deposit is made (Wei):", msg.value);
        // console.log("New contract Balance (Wei):", address(this).balance);
    }

    function withdrawETH(
        WithdrawalInfo calldata _txn,
        uint256 _nonce,
        bytes[] calldata _multiSignature
    ) external nonReentrant {
        _verifyMultiSignature(_txn, _nonce, _multiSignature);
        _transferETH(_txn);
    }

    function _transferETH (WithdrawalInfo calldata _txn) private {
        (bool success, ) = payable(_txn.to).call{value: _txn.amount }("");
        require(success, "Transfer not fulfilled");
    }

    function _verifyMultiSignature(
        WithdrawalInfo calldata _txn,
        uint256 _nonce,
        bytes[] calldata _multiSignature
    ) private {
        require(_nonce > nonce, "nonce already used");
        uint256 count = _multiSignature.length;
        require(count >= _threshold, "not enough signers");
        bytes32 digest = _processWithdrawalInfo(_txn, _nonce);

        address initSignerAddress;
        for (uint256 i = 0; i < count; i++)
        {
            bytes memory signature = _multiSignature[i];
            address signerAddress = ECDSA.recover(digest, signature );
            require( signerAddress > initSignerAddress, "possible duplicate" );
            require(_isValidSigner[signerAddress], "not part of consortium");
            initSignerAddress = signerAddress;
        }
        nonce = _nonce;
    }

    function _processWithdrawalInfo(
        WithdrawalInfo calldata _txn,
        uint256 _nonce
    ) private pure returns(bytes32 _digest) {
        bytes memory encoded = abi.encode( _txn);
        _digest = keccak256(abi.encodePacked(encoded, _nonce));
        _digest = keccak256(abi.encodePacked(MSG_PREFIX, _digest));
    }

    function pay() public view {
        /*
        Public transaction that anyone can call triggers swap and payment distribution if one month passed from
        previous payment.
        Rejects otherwise.
        */
        console.log("Payment is done or not");
    }
}
