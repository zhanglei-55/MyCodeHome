// 2_deploy_contracts.js

const Voting = artifacts.require("Voting");

module.exports = function(deployer) {
  // 候选人列表
  const candidateNames = [
    web3.utils.asciiToHex("贾博鑫"),
    web3.utils.asciiToHex("郭醒龙"),
    web3.utils.asciiToHex("美年达")
  ];

    // 部署合约并传入候选人列表作为参数
    deployer.deploy(Voting, candidateNames);
};
