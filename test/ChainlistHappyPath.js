const Chainlist = artifacts.require('./Chainlist.sol');

contract('Chainlist', function(accounts) {

        it('Should be intitialized with empty values', function() {
                return Chainlist.deployed()
                .then( instance => instance.getArticle.call())
                .then( data => {
                        assert.equal(data[0], 0x0, "Seller must be empty");
                        assert.equal(data[1], '', "article name must be empty");
                        assert.equal(data[2], '', "description must be empty");
                        assert.equal(data[3].toNumber(), 0, "article price must be set to zero");
                })
        })
})