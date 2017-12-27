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
        console.log("no error");
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
        console.log(article);
        if (article[0] == 0x0) {
          // console.log("function terminated..");
          return;
        }

        const articlesRow = $('#articlesRow');
        // articlesRow.empty();

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

    const _article_name = $('#article_name').val();
    const _description = $('#article_description').val();
    const _price = web3.toWei(parseInt($('#article_price').val() || 0));

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
        // close our modal-dialog
        $('#modal1').modal('close');
      })
      .catch(err => {
        console.log(err.message);
      });
  },

  listenToEvents: function () {
    console.log('Solidity contract event fired..');

    App.contracts.Chainlist.deployed()
      .then(instance => {
        instance.sellArticleEvent({}, {
          fromBlock: 0,
          toBlock: 'latest'
        }).watch((err, event) => {
          console.log("toast should show");
          Materialize.toast(`${ event.args._name } is for sale`, 4000);
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
    console.log("app init..")
    App.init();
  });
});
