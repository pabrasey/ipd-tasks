pragma solidity ^0.5.11;

import './Task.sol';

contract TaskList{

    uint8 public task_count = 0;

    mapping(uint => Task) public tasks;

}