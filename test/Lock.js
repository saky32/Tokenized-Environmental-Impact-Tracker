const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("Lock Contract", function () {
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
    const ONE_GWEI = ethers.utils.parseUnits("1", "gwei");

    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS;
    const lockedAmount = ONE_GWEI;

    const [owner, otherAccount] = await ethers.getSigners();

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount });

    return { lock, unlockTime, lockedAmount, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the correct unlock time", async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.unlockTime(), "Unlock time mismatch").to.equal(unlockTime);
    });

    it("Should set the correct owner", async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture);
      expect(await lock.owner(), "Owner mismatch").to.equal(owner.address);
    });

    it("Should receive and store the locked amount", async function () {
      const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture);
      const balance = await ethers.provider.getBalance(lock.target);
      expect(balance, "Locked amount mismatch").to.equal(lockedAmount);
    });

    it("Should fail if unlock time is not in the future", async function () {
      const latestTime = await time.latest();
      const Lock = await ethers.getContractFactory("Lock");
      await expect(
        Lock.deploy(latestTime, { value: 1 })
      ).to.be.revertedWith("Unlock time should be in the future");
    });
  });

  describe("Withdrawals", function () {
    describe("Validations", function () {
      it("Should revert if withdrawal is called too early", async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture);
        await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
      });

      it("Should revert if non-owner tries to withdraw", async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith("You aren't the owner");
      });

      it("Should allow withdrawal after unlock time by owner", async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.withdraw()).not.to.be.reverted;
      });
    });

    describe("Events", function () {
      it("Should emit a Withdrawal event", async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.withdraw())
          .to.emit(lock, "Withdrawal")
          .withArgs(lockedAmount, anyValue); // 'anyValue' is the timestamp
      });
    });

    describe("Transfers", function () {
      it("Should transfer funds to the owner", async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(deployOneYearLockFixture);
        await time.increaseTo(unlockTime);
        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount]
        );
      });
    });
  });
});
