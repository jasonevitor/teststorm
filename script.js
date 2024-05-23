// Metamask connection
const connectWalletButton = document.getElementById('connectWalletButton');
const walletAddressDiv = document.getElementById('walletAddress');
const joinIDOButton = document.getElementById('joinIDOButton');
const bnbAmountInput = document.getElementById('bnbAmount');
const participationMessage = document.getElementById('participationMessage');

// Initialize Metamask connection
connectWalletButton.addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        try {
            // 请求用户连接 MetaMask
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const web3 = new Web3(window.ethereum);
            const networkId = await web3.eth.net.getId();
            console.log('Network ID:', networkId);
            if (networkId !== 56n) { // 56 is the BSC mainnet network ID
                alert('Please switch to Binance Smart Chain network.');
                return;
            }

            const accounts = await web3.eth.getAccounts();
            console.log('Accounts:', accounts);
            if (accounts.length === 0) {
                alert('No accounts found. Please connect to MetaMask.');
                return;
            }
            const account = accounts[0];
            const shortenedAccount = `${account.slice(0, 6)}...${account.slice(-6)}`;
            walletAddressDiv.innerHTML = shortenedAccount;
            walletAddressDiv.classList.add('wallet-address-style');
            connectWalletButton.style.display = 'none';
            walletAddressDiv.style.display = 'block'; // 显示钱包地址
        } catch (error) {
            console.error('Failed to connect to MetaMask:', error);
            alert('Failed to connect to MetaMask. Error: ' + error.message);
        }
    } else {
        alert('Please install MetaMask!');
    }
});

// Join IDO
document.addEventListener('DOMContentLoaded', () => {
    const joinIDOButton = document.getElementById('joinIDOButton');
    // const purchaseQuantityInput = document.getElementById('purchaseQuantity');
    const countdownTimer = document.getElementById('countdownTimer');

    joinIDOButton.addEventListener('click', async () => {
        // const purchaseQuantity = parseInt(purchaseQuantityInput.value);
        // console.log('Purchase Quantity:', purchaseQuantity);

        // if (isNaN(purchaseQuantity) || purchaseQuantity <= 0) {
        //    alert('Please enter a valid purchase quantity.');
        //     return;
        // }

        const bnbAmount = 1 * 1; // 每次参与 1 BNB
        console.log('BNB Amount:', bnbAmount);

        if (typeof window.ethereum !== 'undefined') {
            try {
                // 请求用户连接 MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });

                const web3 = new Web3(window.ethereum);
                const accounts = await web3.eth.getAccounts();
                const account = accounts[0];

                // 获取用户的 BNB 余额
                const balanceWei = await web3.eth.getBalance(account);
                const balanceBNB = web3.utils.fromWei(balanceWei, 'ether');
                console.log('Balance BNB:', balanceBNB);

                if (bnbAmount > parseFloat(balanceBNB)) {
                    alert('Insufficient BNB balance.');
                    return;
                }

                // 确保接收地址是校验和格式
                const toAddress = web3.utils.toChecksumAddress('0x7E65E5399e74DAb11fC28398b3A37F0417191B7D'); // 替换为实际的接收地址

                // 将 BNB 数量转换为 wei
                const valueInWei = web3.utils.toWei(bnbAmount.toString(), 'ether');
                console.log('Value in Wei:', valueInWei);

                // 构建交易
                const transactionParameters = {
                    to: toAddress, // 接收 BNB 的地址
                    from: account,
                    value: valueInWei, // 转换为 wei
                    gas: '21000', // 你可能需要根据实际情况调整 gas limit
                };

                // 使用 Web3.js 发送交易
                web3.eth.sendTransaction(transactionParameters)
                    .on('transactionHash', function(hash){
                        console.log('Transaction Hash:', hash);
                        alert('Transaction sent! Hash: ' + hash);
                    })
                    .on('receipt', function(receipt){
                        console.log('Transaction Receipt:', receipt);
                    })
                    .on('error', function(error, receipt) {
                        console.error('Error:', error);
                        alert('An error occurred. Please try again. Error: ' + error.message);
                    });
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred. Please try again. Error: ' + error.message);
            }
        } else {
            alert('MetaMask is not installed. Please install MetaMask and try again.');
        }
    });

    // Countdown timer

    // Set your IDO start date here
    const idoStartDate = new Date('2024-05-23T04:00:00Z').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = idoStartDate - now;

        if (distance < 0) {
            countdownTimer.innerHTML = 'IDO Started';
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        countdownTimer.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    const countdownInterval = setInterval(updateCountdown, 1000);
});

