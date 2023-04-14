require("dotenv").config({path:"../.env"});//empty dotenv wasn't working so add the path
const API_URL = process.env.API_URL;

const PUBLIC_KEY = process.env.PUBLIC_KEY;
// console.log(`public key`,PUBLIC_KEY)
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// console.log(`private key`,PRIVATE_KEY)
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(API_URL);

const contract = require("../artifacts/contracts/MyNFT.sol/MyNFT.json");

// console.log(JSON.stringify(contract.abi));

const contractAddress = process.env.DEPLOYED_CONTRACT_ADDRESS;
// console.log(`contract address`,contractAddress)
const nftContract = new web3.eth.Contract(contract.abi, contractAddress);
// console.log(`nftContract`,nftContract)

async function mintNFT(tokenURI) {
  try {
    const nonce = await web3.eth.getTransactionCount(PUBLIC_KEY, "latest");
    console.log(`nonce is `,nonce);

    const tx = {
      from: PUBLIC_KEY,
      to: contractAddress,
      nonce: nonce,
      gas: 500000,
      data: nftContract.methods.mintNFT(PUBLIC_KEY, tokenURI).encodeABI(),
    };

    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
    console.log(`signedTx is `,signedTx)
    const { rawTransaction } = signedTx;
    console.log(`rawTransaction is `,rawTransaction)
    const receipt = await web3.eth.sendSignedTransaction(rawTransaction);
    console.log(`reciept is `,receipt)
    console.log(
      "The hash of your transaction is: ",
      receipt.transactionHash,
      "\nCheck Alchemy's Mempool to view the status of your transaction!"
    );
  } catch (error) {
    console.log("Something went wrong when submitting your transaction:", error);
  }
}

mintNFT(process.env.URL_METADATA_PINATA)//this is the URL of nft-metadata.json