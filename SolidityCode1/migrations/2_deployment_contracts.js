const MyToken = artifacts.require("MyToken");

module.exports = function (deployer) {
  // 部署智能合约
  deployer.deploy(MyToken);
};
