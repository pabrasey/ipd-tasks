// @ts-nocheck
const TaskList = artifacts.require('./TaskList.sol')

const truffleAssert = require('truffle-assertions');

contract('TaskList', (accounts) => {

  const validator_0 = accounts[0];
  const validator_1 = accounts[1];
  const worker_1 = accounts[2];
  const worker_2 = accounts[3];

  before(async () => {
    this.tasklist = await TaskList.deployed()
  })

  it('deploys successfully', async () => {
    const address = await this.tasklist.address
    assert.notEqual(address, 0x0)
    assert.notEqual(address, '')
    assert.notEqual(address, null)
    assert.notEqual(address, undefined)
  })

  
  it('creates tasks', async () => {
    const result = await this.tasklist.createTask('A new task', "description");
    console.log(this.tasklist.getTask(0));
    assert.equal(this.tasklist.getTask(0).title, 'A new task');
  })

})