// SPDX-License-Identifier: MIT
// pragma solidity >=0.4.0 <= 0.7.0;
pragma solidity ^0.6.2;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';
import '@openzeppelin/contracts/access/Ownable.sol';

contract NezoToken is ERC20, Ownable {

    constructor() ERC20('Nezo Token', 'NEZ') Ownable()
    public {
         _mint(_msgSender(), 10**23  );
    }
}