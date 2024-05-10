// 替换为你的智能合约 ABI
// 替换为你的智能合约 ABI
const abi = [
    {
        "inputs": [
          {
            "internalType": "bytes32[]",
            "name": "_candidateNames",
            "type": "bytes32[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "candidateList",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
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
          },
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "hasVoted",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "votesReceived",
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
            "internalType": "bytes32",
            "name": "candidate",
            "type": "bytes32"
          }
        ],
        "name": "voteForCandidate",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "bytes32",
            "name": "candidate",
            "type": "bytes32"
          }
        ],
        "name": "totalVotesFor",
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
            "internalType": "bytes32",
            "name": "candidate",
            "type": "bytes32"
          }
        ],
        "name": "validCandidate",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
      }
    // 添加其他函数...
];

// 替换为你的智能合约地址
const contractAddress = "0xce80e13B8549c088EB170Ac17dBFaF72EBfccA0e";

// 使用 Ganache 提供的默认 RPC 地址和端口
const web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
let contractInstance;

// / 页面加载完毕后初始化智能合约实例和账户选择下拉菜单
window.addEventListener('load', async function () {
    try {
        contractInstance = new web3.eth.Contract(abi, contractAddress);
        populateAccountDropdown(); // 填充账户选择下拉菜单
    } catch (error) {
        console.error("Error initializing contract instance:", error);
        alert("初始化智能合约实例失败：" + error.message);
    }
});

// 填充账户选择下拉菜单
async function populateAccountDropdown() {
    const accountDropdown = document.getElementById("accountDropdown");
    try {
        const accounts = await web3.eth.getAccounts();
        accounts.forEach((account, index) => {
            const option = document.createElement("option");
            option.text = `账户${index + 1}`;
            option.value = account;
            accountDropdown.appendChild(option);
        });
    } catch (error) {
        console.error("Error fetching accounts:", error);
        alert("获取账户失败：" + error.message);
    }
}

// 切换账户按钮点击事件
document.getElementById("changeAccountBtn").addEventListener("click", async function() {
    const accountDropdown = document.getElementById("accountDropdown");
    const selectedAccount = accountDropdown.value;
    if (!selectedAccount) {
        alert("请选择要切换的账户");
        return;
    }
    web3.eth.defaultAccount = selectedAccount;
    alert("账户已切换为：" + selectedAccount);
});

// 查询按钮点击事件
document.getElementById("queryBtn").addEventListener("click", async function() {
    const candidateName = document.getElementById("queryCandidate").value;
    if (!candidateName) {
        alert("请输入候选人姓名");
        return;
    }

    try {
        const candidateNameBytes = web3.utils.asciiToHex(candidateName);
        const totalVotes = await contractInstance.methods.totalVotesFor(candidateNameBytes).call();
        document.getElementById("queryResult").innerText = `候选人 ${candidateName} 的票数为：${totalVotes}`;
    } catch (error) {
        document.getElementById("queryResult").innerText = "查询失败：" + error.message;
    }
});

// 点击按钮时触发投票函数
document.getElementById("voteBtn").addEventListener("click", async function() {
    const candidateName = document.getElementById("candidateName").value;
    if (!candidateName) {
        alert("请输入候选人姓名");
        return;
    }

    try {
        const candidateNameBytes = web3.utils.asciiToHex(candidateName);
        await contractInstance.methods.voteForCandidate(candidateNameBytes).send({ from: web3.eth.defaultAccount });
        document.getElementById("result").innerText = "投票成功！";
    } catch (error) {
        // 调试清取消注释
        // document.getElementById("result").innerText = "投票失败：" + error.message;
        document.getElementById("result").innerText = "投票失败：你已经投过一次了！";
    }
});

