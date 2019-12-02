const TodoList = artifacts.require('./TodoList.sol')

const truffleAssert = require('truffle-assertions');

contract('TodoList', (accounts) => {

  const validator_0 = accounts[0];
  const validator_1 = accounts[1];
  const maker_1 = accounts[2];
  const maker_2 = accounts[3];

  before(async () => {
    this.todoList = await TodoList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.todoList.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('creates tasks', async () => {
    const result = await this.todoList.createTask('A new task', "description")
    const task = await this.todoList.tasks(0)
    const task_count = await this.todoList.task_count()
    assert.equal(task_count.toNumber(), 1)
    // assert.equal(this.todoList.getValidators(0)[0], accounts[0]) -> doesn't work !!??

    // check the event
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 0)
    assert.equal(event.title, 'A new task')
    assert.equal(event.state.toNumber(), 0)
    assert.equal(event.validators[0], accounts[0])
  })

  it('adds validators from the allowed accounts', async () => {
    // validator adds new validator
    let result_1 = await this.todoList.addValidators(0, validator_1, {from: validator_0});
    //truffleAssert.eventEmitted(result, 'validatorAdded', { task_id: 0, validator: validator_1 });
    truffleAssert.eventEmitted(result_1, 'validatorAdded', (ev) => {
      return ev.task_id == 0 && ev.validator == validator_1;
    });

    // maker tries to add a validator, which is not permited
    //let result_2 = await this.todoList.addValidators(0, maker_2, {from: maker_1});
    truffleAssert.reverts(
      this.todoList.addValidators(0, maker_2, {from: maker_1}), 
      "caller is not a validator of this task"
    );

    /*
    try {
      let result = await this.todoList.addValidators(0, maker_2, {from: maker_1});
      console.log(result)
      assert(true);
    }
    catch(err) {
      assert(err);
      console.log(err)
    }
    */

  })

  /*
  it('toggles task started', async () => {
    const task_id = 1
    const result = await this.todoList.toggleStarted(task_id) // starts the task

    // check the task
    const task = await this.todoList.tasks(task_id)
    assert.equal(task.state.toNumber(), 1) // checks task state

    // check the event
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), task_id) // checks event task id
    assert.equal(event.state.toNumber(), 1) // check event task state
  })
  */
})