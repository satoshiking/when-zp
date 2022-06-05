const hre = require("hardhat");

async function main() {
    let employees = []

    employees.push({"wallet": "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", "salaryUSD": 10000})
    employees.push({"wallet": "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", "salaryUSD": 5000})
    employees.push({"wallet": "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", "salaryUSD": 2000})
    employees.push({"wallet": "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", "salaryUSD": 2000})
    employees.push({"wallet": "0xcd3B766CCDd6AE721141F452C550Ca635964ce71", "salaryUSD": 2000})
    console.log("Prepared employees for deployment %s", employees);

    const Accounter = await hre.ethers.getContractFactory("Accounter");
    const accounter = await Accounter.deploy(employees);

    await accounter.deployed();
    console.log("accounter deployed to:", accounter.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
