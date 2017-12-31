pragma solidity ^0.4.11;

contract Chainlist {
 //state
 address seller;
 address buyer;
 string name;
 string description;
 uint256 price;

  // defined event
  event SellArticleEvent(
    address indexed _seller, 
    string _name, 
    uint256 _price
  );

  event BuyArticleEvent(
    address indexed _seller,
    address indexed _buyer,
    string _name,
    uint256 _price
  );

  function sellArticle(string _name, string _description, uint256 _price) public {
    seller = msg.sender;
    name = _name;
    description = _description;
    price = _price;

    // this is how we call events in solidity,
    // we call it just like a function.
    SellArticleEvent(seller, name, price);
  }

  function getArticle() public constant returns (
    address _seller,
    address _buyer,
    string _name,
    string _description,
    uint256 _price) 
  {
    return(seller, buyer, name, description, price);
  }

  function buyArticle() payable public {
    // we check whether there is an article for sale
    require(seller != 0x0);
    // we check that the article was not already sold
    require(buyer == 0x0);

    require(msg.sender != seller);

    require(msg.value == price);

    // store buyer's info
    buyer = msg.sender;

    seller.transfer(msg.value);

    BuyArticleEvent(seller, buyer, name, price);
  }
}