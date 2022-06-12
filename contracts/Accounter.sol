//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Accounter {
    uint256 public balance;           // remaining contract balance
    uint256 public lastPaymentBlock;  // block number of last payed salary

    struct Employee {
        address wallet;  // employee's wallet where the salary should be sent
        uint salaryUSD;  // employee's salary nominated in USD
    }

    Employee[] public employees;  // A dynamically-sized array of `Employee` structs.

    constructor(Employee[] memory _employees) {
        // Init contract for each of the provided employees adding then into array
        for (uint i = 0; i < _employees.length; i++) {
            employees.push(Employee({
                wallet: _employees[i].wallet,
                salaryUSD: _employees[i].salaryUSD
            }));
            console.log("Initializing employee wallet=%s salary=%s", _employees[i].wallet, _employees[i].salaryUSD);
        }

        console.log("Done deploying");
    }

    function deposit() public payable returns (uint256) {
        // Everyone can deposit ETH on contract's balance
        balance += msg.value;
        console.log("Deposit is made (Wei):", msg.value);
        console.log("New contract Balance (Wei):", balance);
        return balance;
    }

    function withdraw() public view {
        console.log("Withdraw");
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
