App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {

    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function() {
    web3.eth.getCoinbase(( err, account ) => {
      if(err === null) {
        console.log("no error");
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, (err, balance) => {
          if(err === null) {
            $('#accountBalance').text(web3.fromWei(balance, 'ether') + "ETH");
          }
        })
      } else {
        console.log(err);
      }
    })
  },

  initContract: function() {
    $.getJSON('Chainlist.json', chainListArtifact => {
      App.contracts.Chainlist = TruffleContract(chainListArtifact);

      App.contracts.Chainlist.setProvider(App.web3Provider);
      console.log("reloaded articles");
      return App.reloadArticles();
    })
  },

  reloadArticles: function() {
    App.displayAccountInfo();

    App.contracts.Chainlist.deployed()
      .then( instance => {
        return instance.getArticle.call();
      })
      .then( article => {
        if(article[0] == 0x0) {
          return;
        }

        const articlesRow = $('#articlesRow');
        articlesRow.empty();

        const articleTemplate = $('#articlesTemplate');
        articleTemplate.find('.panel-title');
        articleTemplate.find('.article-description').text(article[1]);
        articleTemplate.find('.article-description').text(article[2]);
        articleTemplate.find('.article-price').text(web3.fromWei(article[3],
          'ether'));

        articlesRow.append(articleTemplate);
      })
  }
};

$(function() {
  $(window).load(function() {
    console.log("app init..")
    App.init();
  });
});
