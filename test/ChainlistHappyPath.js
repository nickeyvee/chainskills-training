const Chainlist = artifacts.require('./Chainlist.sol');
const util = require('util');
const expect = require('chai').expect;

// ==== NOTE ABOUT EXPECT / SHOULD ASSERTIONS ====
//
// When using chai expect / equals it is worth noting
// that equals in this context does not coerce values.
//
// Ex: expect(3).to.equal('3'); will NOT pass.

contract('Chainlist', function (accounts) {

        let chainListInstance;
        let seller = accounts[0];
        let articleName = "article 1";
        let articleDescription = "Description for article 1";
        let articlePrice = 10;

        it('Should be intitialized with empty values', function () {
                return Chainlist.deployed()
                        .then(instance => instance.getArticle.call())
                        .then(data => {
                                assert.equal(data[0], 0x0, "Seller must be empty");
                                assert.equal(data[1], '', "article name must be empty");
                                assert.equal(data[2], '', "description must be empty");
                                assert.equal(data[3].toNumber(), 0, "article price must be set to zero");
                        });
        });

        it("should trigger an event when a new article is sold", function () {
                return Chainlist.deployed()
                .then(instance => {
                        chainListInstance = instance;
                        watcher = chainListInstance.SellArticleEvent();
                        return chainListInstance.sellArticle(
                                articleName,
                                articleDescription,
                                web3.toWei(articlePrice, "ether"), { from: seller }
                        );
                }).then(function () {
                        return watcher.get();
                }).then( events => {
                        assert.equal(events.length, 1, "should have received one event");
                        assert.equal(events[0].args._seller, seller, "seller must be " + seller);
                        assert.equal(events[0].args._name, articleName, "article name must be " + articleName);
                        assert.equal(events[0].args._price.toNumber(), web3.toWei(articlePrice, "ether"), "article price must be " + web3.toWei(articlePrice, "ether"));
                });
        });

        it('Should sell an article', function () {
                return Chainlist.deployed().then(instance => {
                        chainListInstance = instance;
                        return chainListInstance.sellArticle(articleName,
                                articleDescription, web3.toWei(articlePrice, "ether"), { from: seller })
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