const { network, ethers } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
const { storeImages } = require("../utils/uploadToPinata")

const imagesLocation = "./images/randomNft"

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let tokenUris

    if (process.env.UPLOAD_TO_PINATA == "true") {
        tokenUris = await handleTokenUris()
    }
    // get ipfs hashes of our images
    //  1. With our own IPFS node -> Go through IPFS documentation
    //  2. Pinata
    //  3. nft.storage -> Check fcc repository for script for uploading to nft.storage, check file utils/uploadToNftStorage.js
    //  3. best way to keep data up

    let vrfCoordinatorV2Address, subscriptionID, vrfCoordinatorV2Mock, contractAddress

    if (developmentChains.includes(network.name)) {
        contractAddress = (await deployments.get("VRFCoordinatorV2Mock")).address
        vrfCoordinatorV2Mock = await ethers.getContractAt("VRFCoordinatorV2Mock", contractAddress)
        vrfCoordinatorV2Address = contractAddress

        // We created the subscription
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait(1)
        subscriptionID = transactionReceipt.events[0].args.subId
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionID = networkConfig[chainId]["subscriptionId"]
    }

    log("---------------------------------------------")

    // const args = [
    //     vrfCoordinatorV2Address,
    //     subscriptionID,
    //     networkConfig[chainId].gasLane,
    //     networkConfig[chainId].callbackGasLimit,
    //     //  tokenUris,
    //     networkConfig[chainId].mintFee,
    // ]
}

async function handleTokenUris() {
    tokenUris = []

    //  We need to
    //  1. store image in IPFS
    //  2. store meta data in IPFS

    return tokenUris
}

module.exports.tags = ["all", "randomipfs", "main"]
