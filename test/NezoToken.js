const NezoFarm = artifacts.require("./NezoFarm.sol");
const NezoToken = artifacts.require("./NezoToken.sol");
const MockTether = artifacts.require("./MockTether.sol");

function tokenToWei(n){
  return web3.utils.toWei(n, 'Ether');
}

function tokenFromWei(n){
  return web3.utils.fromWei(n, 'Ether');
}

contract("NezoFarm", accounts => {
  // console.log(accounts);
  let nezo, tether, farm, farmBalance, investorBalance;
  const owner = accounts[0];
  const investor = accounts[1];


  before(async () =>{
    nezo = await NezoToken.new();
    tether = await MockTether.new();
    farm = await NezoFarm.new(nezo.address, tether.address);   

    await nezo.transfer(farm.address,tokenToWei('50000'), {from: owner} );
    farmBalance = await nezo.balanceOf(farm.address);

    await tether.transfer(investor, tokenToWei('50000'), {from: owner}  );
    investorBalance = await tether.balanceOf(investor);
  })

  describe("Test Initial Deployment:-", async () => {

    it("...Nezo coin should have a name", async () => {
        // console.log(nezo)
        assert.equal((await nezo.name()), "Nezo Token", 'Nezo token has incorrect name!');
    })

    it("...Mock Tether coin should have a name", async () => {
        assert.equal((await tether.name()), "Tether Token", 'Mock Tether has incorrect name');
    })

    it("...Farm should have correct information", async () => {
        assert.equal((await nezo.address ), (await  farm.nezo()), 'Nezo Farm has wrong injected nezo name');
        assert.equal((await tether.address ), (await farm.tether()), 'Nezo Farm has wrong injected tether name');
    })

    it("..Transfered tokens should be valid", async () => {
        assert.equal(farmBalance, tokenToWei('50000'), 'Farm has transfered tokens');
        assert.equal(investorBalance, tokenToWei('50000'), 'Investor has transfered mock tether');
    })

  });


  describe("Investing Tether:-", async () => {

    it("...Checks investor staking was valid", async () => {
        let _amount = tokenToWei('10000');

        await tether.approve(farm.address, _amount, {from: investor});
        await farm.investTether(_amount, {from: investor});
        let _bal = await tether.balanceOf(investor);
        assert.equal(_bal, tokenToWei('40000'), 'Investor succesfully investeded tether');

        assert.equal( ( await farm.isActiveTetherInvestor(investor) ), true, 'Investor was not rewarded yet');
        assert.equal( ( await farm.hasInvestedTetherBefore(investor) ), true, 'Has invested before');

        //issue tokens
        _totalRewardBefore = tokenFromWei( await farm.totalTetherReward(investor) );
        await farm.issueNezoTokenRewardForTether({from: owner});
        _invesetedBal = await farm.tetherBalance(investor);
        _bal = await nezo.balanceOf(investor);
        _totalRewardAfter = tokenFromWei( await farm.totalTetherReward(investor) );

        assert.equal( _bal.toString(), _invesetedBal.toString(), 'Tokens correctly issued.');
        assert.equal( _totalRewardBefore.toString(), '0', 'Rewards before token issue is zero');
        assert.equal( parseInt(_totalRewardAfter) > parseInt(_totalRewardBefore),  true , 'Rewards after token issue is greater than previous value.');

        try{
          await farm.issueNezoTokenRewardForTether({from: investor});
          throw null;
        }catch(err){
          const REVERT = "VM Exception while processing transaction: revert";
          assert(err, "Expected an error but did not get one");
          assert(err.message.includes(REVERT), "Expected '" + REVERT + "' but got '" + err.message + "' instead");
        }

        //withdraw investment
        await farm.withdrawInvestedTether({from: investor});
        _bal = await tether.balanceOf(investor);
        assert.equal(_bal, tokenToWei('50000'), 'Investor withrew invested tether');

        //zero balance in the farm
        _invesetedBal = await farm.tetherBalance(investor);
        assert.equal(_invesetedBal.toString(), '0', 'Invested tether balance is zero');

        //zero balance in the farm
        let _farmTetherBal = await tether.balanceOf(farm.address);
        assert.equal(_farmTetherBal.toString(), '0', 'Farm tether balance is zero');        

        assert.equal((await farm.isActiveTetherInvestor(investor) ), false, 'Investor not registered as active tether investor.');
    });

  });






});
