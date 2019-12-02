pragma solidity ^0.5.11;

contract TodoList {
	uint8 public task_count = 0;
	enum State { created, accepted, completed, reviewed }
	uint8[] ratings = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	// enum Difficulty { standard, advanced , expert }
	// enum Uncertainity { clear, uncertain, unknown }

	struct Task {
		uint8 id;
		string title;
		string description;
		State state;
		uint deadline;
		uint8 rating;
		address[] validators;
		address[] makers;
		//uint predecessor_id;
		//uint successor_id;
	}

	mapping(uint => Task) public tasks;

	event TaskCreated(
		uint id,
		string title,
		State state,
		address[] validators
	);

	event Test(bool is_true);

	modifier validatorsOnly(uint8 _id) {
		// checks that the sender is a validator of task with id _id
		bool is_validator = false;
		address[] memory _validators = tasks[_id].validators;
		for (uint8 _i = 0; _i < _validators.length; _i++) {
			if (msg.sender == _validators[_i]) {
				is_validator = true;
			}
		}
		emit Test(is_validator);
		require(is_validator == true, "caller is not a validator of this task");
		_;
	}

	event TaskState(
		uint id,
		State state
	);

	event validatorAdded(
		uint task_id,
		address validator
	);

	function createTask(string memory _title, string memory _description) public {
		uint8 _id = task_count;
		Task memory task = Task(_id, _title, _description, State.created, 0, 0, new address[](0), new address[](0));
		// https://medium.com/loom-network/ethereum-solidity-memory-vs-storage-how-to-initialize-an-array-inside-a-struct-184baf6aa2eb
		tasks[_id] = task;
		task_count++;
		tasks[_id].validators.push(msg.sender);
		emit TaskCreated(_id, _title, State.created, tasks[_id].validators);
	}

	function getValidators(uint8 _id) public view returns (address[] memory) {
		return tasks[_id].validators;
	}

	function addValidators(uint8 _task_id, address _validator) public validatorsOnly(_task_id) {
		emit Test(true);
		Task storage _task = tasks[_task_id];
		_task.validators.push(_validator);
		emit validatorAdded(_task_id, _validator);
		/*
		for (uint _i = 0; _i < _validators.length; _i++) {
			_task.validators.push(_validators[_i]);
		}
		*/
	}

	function acceptTask(uint _id) public {

	}

	function completeTask(uint _id) public {

	}

	function reviewTask(uint _id) public {

	}

	function toggleStarted(uint _id) public {
		Task storage _task = tasks[_id];
		_task.state = State.accepted;
		// tasks[_id] = _task;
		emit TaskState(_id, _task.state);
	}

}