const MyToken = artifacts.require("MyToken");
const truffleAssert = require("truffle-assertions");

contract("MyToken", accounts => {
  let instance;
  const deployerAccount = accounts[0];
  const recipientAccount = accounts[1];
  const intermediaryAccount = accounts[2]; // Define intermediaryAccount

  beforeEach(async () => {
    instance = await MyToken.new();
  });

  it("should deploy with correct initial balance", async () => {
    const balance = await instance.balanceOf(deployerAccount);
    assert.equal(balance.toString(), "1000000000000000000000000", "Incorrect initial balance");
  });

  it("should transfer tokens correctly", async () => {
    const transferAmount = 100;

    await instance.transfer(recipientAccount, transferAmount, { from: deployerAccount });

    const deployerBalance = await instance.balanceOf(deployerAccount);
    const recipientBalance = await instance.balanceOf(recipientAccount);

    assert.equal(deployerBalance.toString(), "999999999999999999999900", "Deployer balance incorrect after transfer");
    assert.equal(recipientBalance.toString(), "100", "Recipient balance incorrect after transfer");
  });

  it("should approve tokens correctly", async () => {
    const approvalAmount = 100;

    await instance.approve(recipientAccount, approvalAmount, { from: deployerAccount });

    const allowance = await instance.allowance(deployerAccount, recipientAccount);
    assert.equal(allowance.toString(), "100", "Approval amount incorrect");
  });

  it("should transferFrom tokens correctly", async () => {
    const approvalAmount = 50;

    await instance.approve(intermediaryAccount, approvalAmount, { from: deployerAccount });

    await truffleAssert.passes(
      instance.transferFrom(deployerAccount, recipientAccount, approvalAmount, { from: intermediaryAccount })
    );

    const deployerBalance = await instance.balanceOf(deployerAccount);
    const recipientBalance = await instance.balanceOf(recipientAccount);

    assert.equal(deployerBalance.toString(), "999999999999999999999950", "Deployer balance incorrect after transferFrom");
    assert.equal(recipientBalance.toString(), "50", "Recipient balance incorrect after transferFrom");
  });
});
