//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Accounter {
    uint256 public lastPaymentBlock;  // block number of last payed salary

    struct Employee {
        address wallet;  // employee's wallet where the salary should be sent
        uint salaryUSD;  // employee's salary nominated in USD
    }

    Employee[] public employees;  // A dynamically-sized array of `Employee` structs.

    // mapping(address => Employee) employees; // do we need mapping here ?

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

//    function deposit() public view returns () {
//        console.log("Deploying a Greeter with greeting:", _greeting);
//    }

    function withdraw(string memory _greeting) public {
        console.log("Withdraw");
    }

    function pay(string memory _greeting) public {
        /*
        Public transaction that anyone can call triggers swap and payment distribution if one month passed from
        previous payment.
        Rejects otherwise.
        */
        console.log("Payment is done or not");
    }
}
