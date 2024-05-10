// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// 告诉 Solidity 编译器你要开始定义一个合约，并为这个合约命名为“Voting”
contract Voting {
    // 所有得状态变量默认都是永久的存储在区块链网络上

    // 定义一个 公开的变量  votesReceived 这个变量是 KEY VALUE格式的   KEY的类型是bytes32 而值得类型是 uint256(无符号整数)
    // 候选人得票数
    mapping(bytes32 => uint256) public votesReceived;
    // 定义 一个公开得数组变量   类型是  bytes32
    // 候选人列表
    bytes32[] public candidateList;
    //  定义一个key value得变量  key是 address 值是一个 KEY VALUE格式得数据  key 是 bytes32 值是 bool
    // address 这个数据类型专门用来 存储  以太坊得 地址
    // bool 就是 一般编程语言得boolean类型
    // hasVoted 用来记录某个地址是否已经投过票了
    // 写在contract中的变量 如果不特别声明 它会被永久存储到区块链网络中
    mapping(address => mapping(bytes32 => bool)) public hasVoted; // 新增映射

    // 创建一个  构造器     参数是   bytes32得数组    变量名是 _candidateNames
    // memory：用于临时变量，这些变量在外部函数调用结束后不再存在。存储在内存中
    // 实例化候选人列表
    constructor(bytes32[] memory _candidateNames) {
        candidateList = _candidateNames;
    }

    // 候选人投票
    // 定义一个  公开得函数  voteForCandidate 参数是  bytes32 类型 参数名是 candidate
    function voteForCandidate(bytes32 candidate) public {
        // require 函数是一个用于进行条件检查和引发错误的语句。如果 require 里的条件不为真，则执行会中止，所有的状态更改都会回滚到函数调用之前的状态，而且还会返回一个错误消息。
        // require 函数 用来保证合约得原子性
        require(validCandidate(candidate), "Invalid candidate");
        require(
            //（msg.sender，即当前交易的发送者）是否已经对特定的候选人（candidate）投过票
            !hasVoted[msg.sender][candidate],
            "Already voted for this candidate"
        ); // 检查是否已投票

        votesReceived[candidate] += 1;
        hasVoted[msg.sender][candidate] = true; // 标记为已投票
    }

    // 定义一个  公开得函数  totalVotesFor 参数是  bytes32 类型 参数名是 candidate 返回值得类型是uint256
    // 调用 view 函数不消耗任何gas
    // view 修饰符表明这个函数不会修改合约的状态。这意味着，这个函数不会更改任何状态变量，也不会发出任何事件
    // 查询候选人票数
    function totalVotesFor(bytes32 candidate) public view returns (uint256) {
        require(validCandidate(candidate), "Invalid candidate");
        return votesReceived[candidate];
    }

    // 有效候选人
    function validCandidate(bytes32 candidate) public view returns (bool) {
        for (uint i = 0; i < candidateList.length; i++) {
            if (candidateList[i] == candidate) {
                return true;
            }
        }
        return false;
    }
}
