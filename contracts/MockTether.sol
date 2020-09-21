// https://eips.ethereum.org/EIPS/eip-20
// SPDX-License-Identifier: MIT
// pragma solidity >=0.5.0 <0.8.0;
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract MockTether is ERC20, Ownable  {
    constructor() ERC20('Tether Token', 'THT') Ownable() 
    public{
        _mint(msg.sender, 10**23 );
    }    
}