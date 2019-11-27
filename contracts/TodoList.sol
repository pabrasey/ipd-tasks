pragma solidity ^0.5.0;

contract TodoList {
	uint public taskCount = 0;
	enum State { created, started, completed, validated }

	struct Task {
		uint id;
		string content;
		State state;
	}

	mapping(uint => Task) public tasks;

	event TaskCreated(
		uint id,
		string content,
		State state
	);

	event TaskState(
		uint id,
		State state
	);

	constructor() public {
		createTask("Check out brasey.ch");
	}

	function createTask(string memory _content) public {
		taskCount ++;
		tasks[taskCount] = Task(taskCount, _content, State.created);
		emit TaskCreated(taskCount, _content, State.created);
	}

	function toggleStarted(uint _id) public {
		Task memory _task = tasks[_id];
		_task.state = State.started;
		tasks[_id] = _task;
		emit TaskState(_id, _task.state);
	}

}