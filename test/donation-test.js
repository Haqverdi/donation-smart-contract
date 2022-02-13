const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Donation", async function () {
  it("Should receive donation", async function () {
    const [deployer, donater] = await ethers.getSigners();
    const DonationContract = await ethers.getContractFactory(
      "Donation",
      deployer
    );
    const donationContract = await DonationContract.deploy();
    await donationContract.deployed();
    const balanceBeforeTransaction = ethers.utils.formatEther(
      await donationContract.getBalance()
    );

    expect(balanceBeforeTransaction).to.equal("0.0");

    const donationTransaction = await donater.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1"),
    });
    await donationTransaction.wait();

    const balanceAfterTransaction = ethers.utils.formatEther(
      await donationContract.getBalance()
    );

    expect(balanceAfterTransaction).to.equal("1.0");
  });

  it("Should send balance", async function () {
    const [deployer, donater, donationReceiver] = await ethers.getSigners();
    const DonationContract = await ethers.getContractFactory(
      "Donation",
      deployer
    );
    const donationContract = await DonationContract.deploy();
    await donationContract.deployed();

    const donationTransaction = await donater.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donationTransaction.wait();

    const balanceBeforeTransaction = ethers.utils.formatEther(
      await donationContract.getBalance()
    );

    expect(balanceBeforeTransaction).to.equal("1.0");

    const sendDonationToTransaction = await donationContract
      .connect(deployer)
      .sendDonations(donationReceiver.address, ethers.utils.parseEther("1.0"));

    await sendDonationToTransaction.wait();

    const balanceAfterTransaction = ethers.utils.formatEther(
      await donationContract.getBalance()
    );

    expect(balanceAfterTransaction).to.equal("0.0");
  });

  it("Should get dontaion by donater address", async function () {
    const [deployer, donater] = await ethers.getSigners();
    const DonationContract = await ethers.getContractFactory(
      "Donation",
      deployer
    );
    const donationContract = await DonationContract.deploy();
    await donationContract.deployed();

    const donationTransaction = await donater.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donationTransaction.wait();

    const donationByDonater = await donationContract
      .connect(deployer)
      .getDonationByAddress(donater.address);

    const balanceAfterTransaction = ethers.utils.formatEther(donationByDonater);

    expect(balanceAfterTransaction).to.equal("1.0");
  });

  it("Should get donaters address", async function () {
    const [deployer, donater, donater2, donater3] = await ethers.getSigners();
    const DonationContract = await ethers.getContractFactory(
      "Donation",
      deployer
    );
    const donationContract = await DonationContract.deploy();
    await donationContract.deployed();

    const donation1Transaction = await donater.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donation1Transaction.wait();

    const donation1Transaction2 = await donater.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donation1Transaction2.wait();

    const donation2Transaction = await donater2.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donation2Transaction.wait();

    const donation3Transaction = await donater3.sendTransaction({
      to: donationContract.address,
      value: ethers.utils.parseEther("1.0"),
    });
    await donation3Transaction.wait();

    const allDonaters = await donationContract
      .connect(deployer)
      .getAllDonaters();

    expect(allDonaters.length).to.equal(3);
  });
});
