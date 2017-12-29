App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,

  init: function () {
    return App.initWeb3();
  },

  initWeb3: function () {

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }

    App.displayAccountInfo();
    return App.initContract();
  },

  displayAccountInfo: function () {
    web3.eth.getCoinbase((err, account) => {
      if (err === null) {
        App.account = account;
        $('#account').text(account);
        web3.eth.getBalance(account, (err, balance) => {
          if (err === null) {
            $('#accountBalance').text(web3.fromWei(balance, 'ether') + "ETH");
          }
        })
      } else {
        console.log(err);
      }
    })
  },

  initContract: function () {
    $.getJSON('Chainlist.json', chainListArtifact => {
      App.contracts.Chainlist = TruffleContract(chainListArtifact);

      App.contracts.Chainlist.setProvider(App.web3Provider);

      // YOU MUST REGISTER YOUR CONTRACT EVENTS HERE ! ! !
      App.listenToEvents();

      return App.reloadArticles();
    });
  },

  reloadArticles: function () {
    App.displayAccountInfo();

    App.contracts.Chainlist.deployed()
      .then(instance => {
        return instance.getArticle.call();
      })
      .then(article => {
        if (article[0] == 0x0) {
          console.log("function terminated..");
          return;
        }

        const articlesRow = $('#articlesRow');
        articlesRow.empty();

        const articleTemplate = $('#articlesTemplate');
        articleTemplate.find('.panel-title').text(article[1]);
        articleTemplate.find('.article-description').text(article[2]);
        articleTemplate.find('.article-price').text(web3.fromWei(article[3],
          'ether'));

        let seller = article[0];
        if (seller == App.account) {
          seller = "You";
        }


        articleTemplate.find('.article-seller').text(seller);

        // add the new article
        articlesRow.append(articleTemplate.html());
      })
      .catch(err => {
        console.log(err.message);
      });
  },

  sellArticle: function () {

    let _article_name = $('#article_name').val();
    let _description = $('#article_description').val();
    let _price = web3.toWei(parseInt($('#article_price').val() || 0));

    if ((_article_name.trim() == '') || (_price == 0)) {
      return false;
    }

    App.contracts.Chainlist.deployed()
      .then(instance => {
        return instance.sellArticle(_article_name, _description, _price, {
          from: App.account,
          gas: 500000
        })
      })
      .then(result => {
        
      })
      .catch(err => {
        console.log(err);
      });
  },

  listenToEvents: function () {

    App.contracts.Chainlist.deployed()
      .then(instance => {
        instance.SellArticleEvent({}, {
          fromBlock: 0
        }).watch((err, data) => {

          console.log(data);

          $('#modal1').modal('close');

          Materialize.toast(`${ data.args._name } was added.`, 4000);
          // our code to excute when a new article is added.
          //
          // add a custom toast here that tells
          // us when a new listing is added.

          App.reloadArticles();
        });
      });
  }
};

$(function () {
  $(window).load(function () {
    App.init();
  });
});
