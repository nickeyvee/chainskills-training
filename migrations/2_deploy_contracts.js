const Chainlist = artifacts.require('./Chainlist.sol');

module.exports = deployer => {
        deployer.deploy(Chainlist);
}