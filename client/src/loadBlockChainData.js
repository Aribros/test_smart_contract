import NezoTokenContract from "./contracts/NezoToken.json";
import NezoFarmContract from "./contracts/NezoFarm.json";
import MockTetherContract from "./contracts/MockTether.json";
import getWeb3 from "./getWeb3";

const loadBlockChainData = async () => {
    try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();

        let contracts = {};
        let balances = {};
        let isOwner = false;

        let fromWeit = (n) => web3.utils.fromWei(n, 'Ether') ;

        //Nezo Farm contract
        const deployedNezoToken = NezoTokenContract.networks[networkId];
        if(deployedNezoToken){
          const nezoToken = new web3.eth.Contract(
            NezoTokenContract.abi,
            deployedNezoToken && deployedNezoToken.address,
          );  
          contracts.nezoToken = nezoToken;
          const nezoTokenBalance = await nezoToken.methods.balanceOf(accounts[0]).call();
          balances.nezoTokenBalance = fromWeit( nezoTokenBalance.toString() );

        }else{
          alert('Failed to load Nexo Token details');
        }
    

        //Nezo Farm contract
        const deployedNezoFarm = NezoFarmContract.networks[networkId];
        if(deployedNezoFarm){
          const nezoFarm = new web3.eth.Contract(
            NezoFarmContract.abi,
            deployedNezoFarm && deployedNezoFarm.address,
          );

          contracts.nezoFarm = nezoFarm;
          const tetherBalance =  await nezoFarm.methods.tetherBalance(accounts[0]).call(); 
          balances.tetherBalance = fromWeit( tetherBalance.toString() ); 
          isOwner = accounts[0] === (await nezoFarm.methods.owner().call());

        }else{
          alert('Failed to load Nexo farm details');
        }


        //Mock Tether Token Contract  
        const deployedMockTether = MockTetherContract.networks[networkId];
        if(deployedMockTether){
          const mockTether = new web3.eth.Contract(
            MockTetherContract.abi,
            deployedMockTether && deployedMockTether.address,
          );
          contracts.mockTether = mockTether;
          const mockTetherBalance = await mockTether.methods.balanceOf(accounts[0]).call();  
          balances.mockTetherBalance = fromWeit( mockTetherBalance.toString() );  
      
        }else{
          alert('Failed to load Nexo farm details');
        }        

        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        return {balances, web3, accounts, contracts, isOwner };

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }    
}


export default loadBlockChainData;