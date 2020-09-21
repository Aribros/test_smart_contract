// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.0 <= 0.7.0;
pragma solidity ^0.6.2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import '@openzeppelin/contracts/access/Ownable.sol';

contract NezoFarm is Ownable {
    IERC20 public nezo;
    IERC20 public tether;

    mapping(address => uint256) public tetherBalance; //Keep track of amount staked or invested
    address[] public tetherInvestors; //Keep tracker of Stakers or investors
    
    mapping(address => bool) public isActiveTetherInvestor; //Keep track if investor is active

    mapping(address => bool) public hasInvestedTetherBefore; //Keep Track those have been rewarded

    mapping(address => uint256) public totalTetherReward; //Keep track of total amount of rewards received

    constructor(address _nezo, address _tether) Ownable() public {
        nezo = IERC20(_nezo); // Update total supply
        tether = IERC20(_tether); // Update total supply
    }

    function investTether(uint256 _amount) public {
        require(
            _amount > 0,
            "Value of tether to be staked should be greater than 0"
        );

        tether.transferFrom(msg.sender, address(this), _amount);
        tetherBalance[msg.sender] += _amount;

        if(!hasInvestedTetherBefore[msg.sender]){
            tetherInvestors.push(msg.sender); //
        }

        hasInvestedTetherBefore[msg.sender] = true;
        isActiveTetherInvestor[msg.sender] = true;
    }

    //make sure only owners
    function issueNezoTokenRewardForTether() public onlyOwner {
        for(uint i = 0; i < tetherInvestors.length ; i++){
            address recipient = tetherInvestors[i];
            uint256 _bal = tetherBalance[recipient] - totalTetherReward[recipient];

            if(_bal > 0 && isActiveTetherInvestor[recipient]){
                nezo.transfer(recipient, _bal);
                totalTetherReward[recipient] += _bal;
            }
        }
    }

    //withdraw tether investment
    function withdrawInvestedTether() public {
        uint256 _bal = tetherBalance[msg.sender];
        require( _bal > 0, 'Your balance must be greater than zero.');
        //make transfer to owner
        tether.transfer(msg.sender, _bal );
        tetherBalance[msg.sender] = 0;
        isActiveTetherInvestor[msg.sender] = false;
    }


}
