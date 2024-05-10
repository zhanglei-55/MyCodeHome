// Ganache CLI 的本地网络地址
const provider = "http://localhost:7545";

// 部署的智能合约地址
const contractAddress = "0x9b1dedb02F7F8EA9E5Ae2b5271894e6CB56644C8";

// 合约 ABI
const contractABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "name",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "symbol",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_value",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "success",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

// 部署的智能合约实例
let contractInstance;
let accounts;

// 等待页面加载完成
window.onload = async function() {
    // 创建 Web3 实例
    const web3 = new Web3(provider);
  
    // 获取当前账户信息
    accounts = await web3.eth.getAccounts();
  
    // 使用合约 ABI 和地址创建合约实例
    contractInstance = new web3.eth.Contract(contractABI, contractAddress);
  
    // 显示合约地址
    document.getElementById("contractAddress").innerText = contractAddress;
  
    // 显示部署者账户和余额
    displayAccountDetails(0);

    // 显示下拉菜单中的账户选项
    displayAccountOptions();
}

// 显示指定账户的余额和地址
async function displayAccountDetails(index) {
    const balance = await contractInstance.methods.balanceOf(accounts[index]).call();
    document.getElementById("deployerAccount").innerText = accounts[index];
    document.getElementById("deployerTokenBalance").innerText = balance;
}

// 显示下拉菜单中的账户选项
async function displayAccountOptions() {
    const accountSelectors = document.getElementsByClassName("account-selector");

    for (let selector of accountSelectors) {
        for (let i = 0; i < accounts.length; i++) {
            const option = document.createElement("option");
            option.value = accounts[i];
            option.text = "账户 " + (i + 1);
            selector.appendChild(option.cloneNode(true));
        }
    }
}

// 授权函数
async function approve() {
    const selectedApprovedAccount = document.getElementById("approvedAccountSelector").value;
    const approvalAmount = parseInt(document.getElementById("approvalAmount").value);

    if (!selectedApprovedAccount) {
        alert("请选择一个授权钱包账户");
        return;
    }

    try {
        // 获取发送者账户
        const senderAccount = document.getElementById("senderAccountSelector").value;
        if (!senderAccount) {
            alert("请选择一个发送者账户");
            return;
        }

        // 调用合约的 approve 函数
        await contractInstance.methods.approve(selectedApprovedAccount, approvalAmount).send({ from: senderAccount });
        alert("代币已成功批准！");
    } catch (error) {
        console.error("授权过程中出现错误：", error);
    }
}


// 转账函数
async function transfer() {
    const transferAmount = document.getElementById("transferAmount").value;
    const recipientAccount = document.getElementById("recipientAccountSelector").value;
    const senderAccount = document.getElementById("approvedAccountSelector").value;

    if (!recipientAccount || !senderAccount) {
        alert("请选择发送者和接收者账户");
        return;
    }

    try {
        await contractInstance.methods.transfer(recipientAccount, transferAmount).send({ from: senderAccount });
        alert("代币已成功转账！");
        displayAccountDetails(0); // 更新账户余额显示
    } catch (error) {
        console.error("转账过程中出现错误：", error);
    }
}

// 代理转账函数
async function transferFrom() {
    const transferAmount = parseInt(document.getElementById("transferAmount").value);
    const approvedAccount = document.getElementById("approvedAccountSelector").value;
    const recipientAccount = document.getElementById("recipientAccountSelector").value;
    const executorAccount = document.getElementById("executorAccountSelector").value;
    const allowance = parseInt(document.getElementById("approvalAmount").value);
    console.log(allowance);
    console.log("授权钱包","接收钱包","转账金额","执行账户");
    console.log(approvedAccount,recipientAccount,transferAmount,executorAccount);

    if (!approvedAccount || !recipientAccount || !executorAccount) {
        alert("请选择授权账户、接收账户和执行账户");
        return;
    }
  
    try {
        // 检查授权额度
        if (allowance < transferAmount) {
            alert("执行账户的授权额度不足以进行此转账！");
            return;
        }
  
        // 执行转账
        await contractInstance.methods.transferFrom(approvedAccount, recipientAccount, transferAmount).send({ from: executorAccount });
        alert("代币已成功代理转账！");
        displayAccountDetails(0); // 更新账户余额显示
    } catch (error) {
        console.error("代理转账过程中出现错误：", error);
    }
}


// 查看余额函数
async function checkTokenBalance() {
    const selectedAccount = document.getElementById("balanceAccountSelector").value;
    if (!selectedAccount) {
        alert("请选择一个账户");
        return;
    }
    try {
        const balance = await contractInstance.methods.balanceOf(selectedAccount).call();
        alert("账户 " + selectedAccount + " 的代币余额为：" + balance);
    } catch (error) {
        console.error("查询余额过程中出现错误：", error);
    }
}