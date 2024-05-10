const Voting = artifacts.require("Voting");

contract("Voting", function(accounts) {
    let instance;

    before(async function() {
        instance = await Voting.deployed();
    });

    it("允许选民投票", async function() {
        const candidate = await instance.candidateList(0); // 使用合约中的候选人列表
        await instance.voteForCandidate(candidate, { from: accounts[0] });

        const votes = await instance.totalVotesFor(candidate);
        assert.equal(votes.toNumber(), 1, "投票数量应为1");
    });

    it("检查某个人是否是有效的候选人", async function() {
        const candidate = await instance.candidateList(0); // 使用合约中的候选人列表
        const isValid = await instance.validCandidate(candidate);
        assert.equal(isValid, true, "候选人应该是有效的");
    });

    it("阻止非候选人获得选票", async function() {
        const nonCandidate = web3.utils.asciiToHex("NonCandidate");
        try {
            await instance.voteForCandidate(nonCandidate, { from: accounts[1] });
            assert.fail("应该阻止非候选人投票");
        } catch(error) {
            assert(error.message.includes("Invalid candidate"), "应该拒绝非候选人投票");
        }
    });

    it("阻止非候选人获得选票", async function() {
        const candidate = await instance.candidateList(0); // 使用合约中的候选人列表
        try {
            await instance.voteForCandidate(candidate, { from: accounts[0] });
            assert.fail("应该阻止对同一候选人的双重投票");
        } catch(error) {
            assert(error.message.includes("Already voted for this candidate"), "应该拒绝双重投票");
        }
    });
});
