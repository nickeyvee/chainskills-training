pragma solidity ^0.4.11;

contract Chainlist {

 //state
 address seller;
 string name;
 string description;
 uint256 price;

// defined event
 event SellArticleEvent(address indexed _seller, string _name, uint256 _price);

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
    string _name,
    string _description,
    uint256 _price) 
  {
    return(seller, name, description, price);
  }
}