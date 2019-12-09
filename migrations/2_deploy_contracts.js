var Task = artifacts.require("./Task.sol");
var TaskList = artifacts.require("./TaskList.sol");

module.exports = function(deployer) {
  //deployer.deploy(Task);
  deployer.deploy(TaskList);
};