const Chainlist = artifacts.require('./Chainlist.sol');

contract('Chainlist', function(accounts) {

        let chainListInstance;
        let seller = accounts[0];
        let articleName = "article 1";
        let articleDescription = "Description for article 1";
        let articlePrice = 10;

        it('Should be intitialized with empty values', function() {
                return Chainlist.deployed()
                .then( instance => instance.getArticle.call())
                .then( data => {
                        assert.equal(data[0], 0x0, "Seller must be empty");
                        assert.equal(data[1], '', "article name must be empty");
                        assert.equal(data[2], '', "description must be empty");
                        assert.equal(data[3].toNumber(), 0, "article price must be set to zero");
                });
        });

        it('Should sell an article', function() {
                return Chainlist.deployed().then( instance => {
                        chainListInstance = instance;
                        return chainListInstance.sellArticle(articleName,
                        articleDescription, web3.toWei(articlePrice, "ether"), {from: seller})
                }).then(() => {
                        return chainListInstance.getArticle.call();
                }).then(data => {
                        assert.equal(data[0], seller, "seller must be empty");
                        assert.equal(data[1], articleName, "article name must be " + 
                        articleName);
                        assert.equal(data[2], articleDescription, "article description must be " + articleDescription);
                        assert.equal(data[3].toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
                });
        });
});