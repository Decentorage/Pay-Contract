pragma solidity ^0.4.17;

contract web2decentorage {
    address public decentorage;
    address public webUser;
    address[] public storageNodes;
    uint userValue;  //this value in wei
    uint percentage;
    
    // backend (done)
    function web2decentorage(uint _userValue) public {
        userValue = _userValue;
        decentorage = msg.sender;   //decentorage ID that will manage this contract
        percentage = 5;
    }
    
    // frontend (done)
    function userPay() public payable {
        require(msg.value > userValue);     //require on the amount of money the user should pay
        webUser = msg.sender;               //save the user ID
        decentorage.transfer(percentage*this.balance/100);
    }

    //backend (done) 
    function addStorageNode(address A) public restricted {
        storageNodes.push(A);
    }

    //backend (done) 
    function deleteStorageNode(address A) public restricted {
        for(uint i=0; i<storageNodes.length; i++){
            if(storageNodes[i] == A){
                storageNodes[i] = storageNodes[storageNodes.length-1];
                delete storageNodes[storageNodes.length - 1];
                storageNodes.length--;
                return;
            }
        }
    }

    //backend (done)
    function swapStorageNode(address A, uint256 index) public restricted {
        storageNodes[index] = A;
    }
    
    //backend (done)
    function payStorageNode(address A, uint payment) public restricted {
        for(uint i=0; i<storageNodes.length; i++){
            if(storageNodes[i] == A){
                storageNodes[i].transfer(payment);   //amount of money should be sent to a storage node
            }
        }
    }

    //backend (done)
    function terminate() public restricted {
        decentorage.transfer(this.balance);
    }

    //backend (done)
    function getStorageNodes() public view returns(address[]) {
        return storageNodes;
    }

    //backend (done)
    function getDecentorage() public view returns(address) {
        return decentorage;
    }

    //backend (done)
    function getwebUser() public view returns(address) {
        return webUser;
    }

    //backend (done)
    function getBalance() public view returns(uint) {
        return this.balance;
    }
    
    modifier restricted() {
        require(msg.sender == decentorage);
        _;
    }
}