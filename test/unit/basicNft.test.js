const { assert } = require("chai")
const { ethers } = require("hardhat")

describe("BasicNft", function () {
    let basicNft
    let owner
    let addr1

    beforeEach(async function () {
        const BasicNft = await ethers.getContractFactory("BasicNft")
        basicNft = await BasicNft.deploy()
        await basicNft.deployed()

        ;[owner, addr1] = await ethers.getSigners()
    })

    it("should have the correct name and symbol", async function () {
        assert.equal(await basicNft.name(), "Dogie")
        assert.equal(await basicNft.symbol(), "DOG")
    })

    it("should have the correct token URI", async function () {
        const expectedTokenURI =
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"
        assert.equal(await basicNft.TOKEN_URI(), expectedTokenURI)
    })

    it("should mint a new token and increment the token counter", async function () {
        await basicNft.mintNft()
        assert.equal(await basicNft.balanceOf(owner.address), 1)
        assert.equal(await basicNft.getTokenCounter(), 1)

        await basicNft.connect(addr1).mintNft()
        assert.equal(await basicNft.balanceOf(addr1.address), 1)
        assert.equal(await basicNft.getTokenCounter(), 2)
    })

    it("should return the correct token URI for minted tokens", async function () {
        const expectedTokenURI =
            "ipfs://bafybeig37ioir76s7mg5oobetncojcm3c3hxasyd4rvid4jqhy4gkaheg4/?filename=0-PUG.json"

        await basicNft.mintNft()
        assert.equal(await basicNft.tokenURI(0), expectedTokenURI)

        await basicNft.mintNft()
        assert.equal(await basicNft.tokenURI(1), expectedTokenURI)
    })

    it("should return the correct token counter", async function () {
        assert.equal(await basicNft.getTokenCounter(), 0)

        await basicNft.mintNft()
        assert.equal(await basicNft.getTokenCounter(), 1)

        await basicNft.mintNft()
        assert.equal(await basicNft.getTokenCounter(), 2)
    })
})
