var NezoToken = artifacts.require("./NezoToken.sol");
var MockTether = artifacts.require("./MockTether.sol");
var NezoFarm = artifacts.require("./NezoFarm.sol");

module.exports = async function(deployer, networks, accounts) {

  await deployer.deploy(NezoToken);
  await deployer.deploy(MockTether);

  const nezo = await NezoToken.deployed();
  const tether = await MockTether.deployed();

  await deployer.deploy(NezoFarm, nezo.address, tether.address);

  const farm = await NezoFarm.deployed();
  //transfer to crowd sale
   await nezo.transfer(farm.address, '50000000000000000000000');

  //transfer to investor
  const invesor = accounts[1];
  await tether.transfer(invesor, '5000000000000000000000');
};
