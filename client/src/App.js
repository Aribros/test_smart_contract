import React, { Component } from "react";
import loadBlockChainData  from './loadBlockChainData';
import NavBar from './components/NavBar'
import BodyTabs from './components/BodyTabs'
// import {Paper} from '@material-ui/core';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";


class App extends Component {
  state = { balances: null, web3: null, accounts: null, contracts: null, loading: true, isOwner: false };

  componentDidMount = async () => {
    this.initUiData();
  };


  initUiData = async () => {
    let data = await loadBlockChainData();
    this.setState({...data, loading:false});
  };

  //invest ether to earn
  investTether = async (token) => {
    this.setState({loading:true});
    let amountInWei = await this.state.web3.utils.toWei(token, 'Ether') 
    let tetherToken = this.state.contracts.mockTether;
    let farm = this.state.contracts.nezoFarm;
    try{
      await tetherToken.methods.approve(await farm._address, amountInWei)
      .send({from: this.state.accounts[0]})
      .on('transactionHash', async (hash) => {
        //invest token
         await farm.methods.investTether(amountInWei)
        .send({from: this.state.accounts[0]})
        .on('transactionHash', async (hash) => {
          this.setState({loading:false});
         
        });
  
      });

    }catch (e){}
    //approve spending
 
    window.location.reload();
  }

  //with draw invested token
  withDrawInvestedTether = async () => {
    this.setState({loading:true});

    let farm = this.state.contracts.nezoFarm;
    try{
      await farm.methods.withdrawInvestedTether()
      .send({from: this.state.accounts[0]})
      .on('transactionHash', async (hash) => {
        // this.setState({loading:false});
      });      

    }catch(e){
      console.log(e);
    }
    
    return true;
    // console.log(amountInWei)
  }


  issueNezoTokenReward = async () => {
    this.setState({loading:true});

    let farm = this.state.contracts.nezoFarm;
    try{
      await farm.methods.issueNezoTokenRewardForTether()
      .send({from: this.state.accounts[0]})
      .on('transactionHash', async (hash) => {
        // this.setState({loading:false});
      });      

    }catch(e){
      console.log(e);
    }
    
    return true;    

  }


  render() {
    if (!this.state.web3 || this.state.loading ) {
      return <div className=" mx-auto text-center">Loading....<br />Please, wait...</div>;
    }
    return (
      <div className="App">
        <NavBar address = {this.state.accounts[0]} />


        <BodyTabs 
          balances = {this.state.balances}
          isOwner = {this.state.isOwner}
          investTether = {this.investTether}
          withDrawInvestedTether = {this.withDrawInvestedTether}
          issueNezoTokenReward = {this.issueNezoTokenReward}
        />

      </div>
    );
  }
}

export default App;
