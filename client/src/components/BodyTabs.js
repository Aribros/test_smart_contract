import React, {Component} from 'react';
import BalanceView from './BalanceView';


class TabPanel extends Component {  

  constructor(props) {
    super(props);
    this.state = {value: '', err: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleWithdrawal = this.handleWithdrawal.bind(this);
    this.handleRewardIssuing = this.handleRewardIssuing.bind(this);
  }  

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  //Handle investment
  async handleSubmit(event) {
    if(!this.state.value  || isNaN(this.state.value)){
      this.setState({err: 'Token must be an integer!'});
      return;
    }
    this.setState({err: ''});
    await this.props.investTether(this.state.value);
  }  
  //withdraw invested Token
  async handleWithdrawal(event) {
    let result = await this.props.withDrawInvestedTether(this.state.value);
    if(result){
      window.location.reload();
    }
  }  
  
  //withdraw invested Token
  async handleRewardIssuing(event) {
    let result = await this.props.issueNezoTokenReward();
    if(result){
      window.location.reload();
    }
  }  


  tabButtons(){
    return (
    <ul className="nav nav-tabs" id="myTab" role="tablist">
      <li className="nav-item">
        <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">
          Staking/Investing Mock Tether
        </a>
      </li>
      {this.props.isOwner ? 
      (
      <li className="nav-item">
        <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">
          Issue Token
        </a>
      </li>
      ) : (<li></li>)}

    </ul>
    );
  }


  issueTokenContent(){
    if(!this.props.isOwner){
      return;
    }
    return (
      <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
        <h5 className="mt-2">Issue tokens to Investors Nezo</h5>
        <div className="form-group m-4 mt-5">
          <button type="button" className="btn btn-info btn-lg btn-block" onClick = {this.handleRewardIssuing}>
            Issue Tokens
          </button>
        </div>
      </div>      
    );
  }

  render() {

    return (
      <div className = "container mt-4">
        <div className = "row justify-content-md-center">
          <div className="col-lg-9">
            <BalanceView {...this.props.balances}/>
            {this.tabButtons()}

            <div className="card">
              <div className="card-body">

                <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">

                  <div className="form-group mt-2">
                    <h5 className="mt-3 p1">Invest Tether to Earn Nezo Tokens</h5>

                    <div className="input-group">
                      <input type="number" className="form-control form-control-lg" id="investTokens" 
                      aria-describedby="tokensHelp"

                      value={this.state.value} onChange={this.handleChange}
                      
                      />
                      <div className="input-group-append">
                        <div className="input-group-text">Tether</div>
                      </div> 
                    </div>
                    <small id="tokensHelp" className="form-text text-danger">
                      {this.state.err}</small>
                  </div>

                  <button type="button" className="btn btn-primary btn-lg btn-block my-4" onClick = {this.handleSubmit}>
                  Stake/Invest Tokens</button>
                  <button type="button" className="btn btn-outline-dark btn-lg btn-block" onClick = {this.handleWithdrawal}>Withdraw Tokens</button>
                </div>

                {this.issueTokenContent()}
              </div>                

              </div>
            </div>   


          </div>
        </div>
      </div>
    );

  }
}

export default TabPanel;
