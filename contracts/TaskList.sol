pragma solidity ^0.5.11;

import './Task.sol';

contract TaskList{

    uint8 public task_count = 0;

    mapping(uint => Task) public tasks;

    function createTask(string memory _title, string memory _description) public returns (Task) {
        uint8 _id = task_count;
        Task task = new Task({_id: _id, _title: _title, _description: _description});
        task_count++;
        tasks[_id] = task;
        return task;
    }

}