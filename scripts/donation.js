const hre = require("hardhat");

async function main() {
  const Greeter = await hre.ethers.getContractFactory("Donation");
  const donation = await Greeter.deploy();

  await donation.deployed();

  console.log("Donation deployed to:", donation.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
