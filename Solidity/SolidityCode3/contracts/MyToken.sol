// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
// ERC-20代币开发
// USDC  Chainlink BAT ....
contract MyToken {
    string public name = unicode"喜国币";
    string public symbol = "XB";
    uint256 public totalSupply = 1000000000000000000000000;

    // 余额
    mapping(address => uint256) public balanceOf;
    // 实现代币的授权和转账机制的介质变量
    mapping(address => mapping(address => uint256)) public allowance;

    // 定义一个Transfer转账事件,第一个参数这是代币转出方的地址，第二个参数这是代币接收方的地址，第三个参数这是被转移的代币数量
    event Transfer(address indexed from, address indexed to, uint256 value);

    // 定义一个Approval授权事件,第一个参数授权地址,第二个参数被授权的地址,第三个参数是被授权的总代币数量上限
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );

    // 定义一个构造函数  合约被部署到以太坊后会自动执行
    // 合约确保所有的初始代币都被分配给合约的部署者
    constructor() {
        balanceOf[msg.sender] = totalSupply;
    }

    // 调用transfer函数  第一个参数  接收代币的地址  第二个参数 发送的代币数量
    function transfer(
        address _to,
        uint256 _value
    )
        public
        returns (
            // 返回一个布尔值 成功返回true 失败返回 false
            bool success
        )
    {
        // 断言如果账户余额足够 则继续  否则终止该函数的运行
        require(balanceOf[msg.sender] >= _value);
        // 根据发送代币数量扣除发送者地址的代币数量
        balanceOf[msg.sender] -= _value;
        // 接收代币地址的余额增加对应的代币
        balanceOf[_to] += _value;
        // emit 触发事件 事件是区块链上的日志记录工具
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    // 调用approve函数  第一个参数  授权转账的地址  第二个参数 转账代币数量的上限
    function approve(
        address _spender,
        uint256 _value
    ) public returns (bool success) {
        // 设置_spender 可以从 msg.sender 的账户中转移代币的数量上限
        allowance[msg.sender][_spender] = _value;
        // 记录授权操作在区块链日志上
        emit Approval(msg.sender, _spender, _value);
        return true;
    }


    // 代理授权转账
    // 第一个参数    授权钱包的地址
    // 第二个参数    接收转账的地址
    // 三个  转账的额度
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool success) {
        // 授权钱包的地址余额必须要够
        require(_value <= balanceOf[_from], "Insufficient balance");
        // 被授权钱包的地址的授权额度要够
        require(
            _value <= allowance[_from][msg.sender],
            "Insufficient allowance"
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        // 执行者的额度 扣除对应的额度
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}
