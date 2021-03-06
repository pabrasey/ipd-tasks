// @ts-nocheck
const TodoList = artifacts.require('./TodoList.sol')

const truffleAssert = require('truffle-assertions');

contract('TodoList', (accounts) => {

  const validator_0 = accounts[0];
  const validator_1 = accounts[1];
  const worker_1 = accounts[2];
  const worker_2 = accounts[3];

  before(async () => {
    this.todolist = await TodoList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.todolist.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  it('creates tasks', async () => {
    const result = await this.todolist.createTask('A new task', "description")
    const task = await this.todolist.tasks(0)
    const task_count = await this.todolist.task_count()
    assert.equal(task_count.toNumber(), 1)
    // debug  ( assert.equal(this.todolist.getValidators(0)[0], accounts[0]) );

    // check the event
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), 0)
    assert.equal(event.title, 'A new task')
    assert.equal(event.state.toNumber(), 0)
    assert.equal(event.validators[0], accounts[0])
  })

  it('adds validator from the allowed accounts', async () => {
    // validator adds new validator
    let result_1 = await this.todolist.addValidator(0, validator_1, {from: validator_0});
    //truffleAssert.eventEmitted(result, 'validatorAdded', { task_id: 0, validator: validator_1 });
    truffleAssert.eventEmitted(result_1, 'validatorAdded', (ev) => {
      return ev.task_id == 0 && ev.validator == validator_1;
    });

    // worker tries to add a validator, which is not permited
    truffleAssert.reverts(
      this.todolist.addValidator(0, worker_2, {from: worker_1}), 
      "caller is not a validator of this task"
    );
  })

  it('adds worker from the allowed accounts', async () => {
    // validator adds new worker
    let result_1 = await this.todolist.addWorker(0, worker_1, {from: validator_1});
    truffleAssert.eventEmitted(result_1, 'workerAdded', (ev) => {
      return ev.task_id == 0 && ev.worker == worker_1;
    });

    // worker tries to add a validator, which is not permited
    truffleAssert.reverts(
      this.todolist.addWorker(0, worker_2, {from: worker_1}), 
      "caller is not a validator of this task"
    );
  })

  it('funds task', async () => {
    const amount = web3.utils.toWei('10', "ether");
    const balance_before = await web3.eth.getBalance(validator_1);
    let result = await this.todolist.fundTaskEscrow(0, {from: validator_1, value: amount, gasPrice:0});

    // check account balance
    const balance_after = await web3.eth.getBalance(validator_1);
    let value = Number(balance_before) - Number(balance_after);
    assert.equal(value, amount);

    // check deposited amount
    let deposit = await this.todolist.getTaskDeposit(0);
    assert.equal(deposit, amount);
  })

  /*
  it('toggles task started', async () => {
    const task_id = 1
    const result = await this.todolist.toggleStarted(task_id) // starts the task

    // check the task
    const task = await this.todolist.tasks(task_id)
    assert.equal(task.state.toNumber(), 1) // checks task state

    // check the event
    const event = result.logs[0].args
    assert.equal(event.id.toNumber(), task_id) // checks event task id
    assert.equal(event.state.toNumber(), 1) // check event task state
  })
  */
})