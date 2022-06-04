# when-zp

Imagine small team of 5 guys raised 1000 ETH on ICO to build their pet project.
We would like to create salary smart contract that helps them to be paid on monthly basis in decentralised way. 

## Description
Goals: 
1. Create smart contract(SC) that represents bank with collected ETH with next properties:
   - Has predefined list with 5 team members wallets and their USD monthly salary  
   - Everyone inside and outside of list can deposit ETH on it
   - Possibility to withdraw all ETH funds from contract when 3 of 5 members agree with it. (Some kind of multi sig functionality)
   - Once per month contract should change some part of ETH at any DEX(Uniswap, Curve or others) to get USDT/USDC required to pay salary to all 5 members and send them to team.  
2. Write tests for all functionality
3. Deploy this SC to any public test net (Rinkeby, Robsten or other)
