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


To deploy contract with Remix iDE we need to provide _employees argument while deploying:
```
[ 
   ["0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199",  1000], 
   ["0xdd2fd4581271e230360230f9337d5c0430bf44c0",  1000], 
   ["0xbda5747bfd65f08deb54cb465eb87d40e51b197e",  1000], 
   ["0x2546bcd3c84621e976d8185a91a922ae77ecec30",  1000], 
   ["0xcd3b766ccdd6ae721141f452c550ca635964ce71",  1000] 
]
```