# when-zp

Imagine small team of 5 guys raised 1000 ETH on ICO to build their pet project.
We would like to create salary smart contract that helps them to be paid on monthly basis in decentralised way. 

## Description
Goals: 
1. Create smart contract(SC) that represents bank with collected ETH with next properties:
   - Defined list with 5 team members wallets and their USD monthly salary during contract init  
   - Everyone inside and outside of list can deposit ETH on it
   - Possibility to withdraw all ETH funds from contract when 3 of 5 members agree with it. (Some kind of multi sig functionality)
   - Once per month contract should change some part of ETH at any DEX(Uniswap, Curve or others) to get USDT/USDC required to pay salary to all 5 members and send them to team.  
3. Write tests for all functionality
4. Deploy this SC to any public test net (Rinkeby, Robsten or other)


## Tools for development
1. [Solidity](https://docs.soliditylang.org/)
2. [Hard hat](https://hardhat.org/getting-started)
3. [Remix IDE](https://remix.ethereum.org/)


## Local Development
- `npx hardhat compile`
- `npx hardhat node`
- `npx hardhat run scripts/deploy.js --network localhost`
- `npx hardhat test` - to run all mocha tests


To deploy contract with Remix iDE we need to provide _employees argument while deploying:
```
[ 
   ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",  500], 
   ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8",  500], 
   ["0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",  500], 
   ["0x90F79bf6EB2c4f870365E785982E1f101E93b906",  1000], 
   ["0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",  100] 
]
```

### Links:
- [Example](https://github.com/EKami/test_project) of small test project that helped me to set up debugging for mocha tests

- [Article](https://www.codementor.io/@beber89/build-a-basic-multisig-vault-in-solidity-for-ethereum-1tisbmy6ze) - with great example how to implement multisig at ethereum SC. This functionality is copy/pasted from there. 
Along with it's [github](https://github.com/beber89/multisig-sample-solidity) repo.