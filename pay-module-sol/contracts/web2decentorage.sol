pragma solidity ^0.4.17;

contract web2decentorage {
    address public decentorage;
    address public webUser;
    address[] public storageNodes;
    uint[] paymentDates;
    uint userValue;  //this value in wei
    uint storageNodeValue;
    uint constant oneWeek = 604800;
    
    function web2decentorage(uint _userValue, uint _storageNodeValue) public {
        userValue = _userValue;
        storageNodeValue = _storageNodeValue;
        decentorage = msg.sender;   //decentorage ID that will manage this contract
    }
    
    function userPay() public payable {
        require(msg.value > userValue);     //require on the amount of money the user should pay
        webUser = msg.sender;               //save the user ID
    }

    //assumming these two function will be called in order and next to each other    
    function addStorageNode(address A) public restricted {
        storageNodes.push(A);
    }
    function addPaymentDate(uint _paymentDate) public restricted {
        paymentDates.push(now + _paymentDate);
    }
    //////////////////////////////////////////////////////////////////////////////

    function deleteStorageNode(address A) public {
        for(uint i=0; i<storageNodes.length; i++){
            if(storageNodes[i] == A){
                storageNodes[i] = storageNodes[storageNodes.length-1];
                delete storageNodes[storageNodes.length - 1];
                storageNodes.length--;
                return;
            }
        }
    }

    function deletePaymentDate(address A) public {
        for(uint i=0; i<storageNodes.length; i++){
            if(storageNodes[i] == A){
                paymentDates[i] = paymentDates[paymentDates.length-1];
                delete paymentDates[paymentDates.length - 1];
                paymentDates.length--;
                return;
            }
        }
    }

    function swapStorageNode(address Old, address New, uint _paymentDate) public restricted {
        deletePaymentDate(Old);
        deleteStorageNode(Old);
        addStorageNode(New);
        addPaymentDate(_paymentDate);
    }
    
    function payStorageNode(address A) public restricted {
        for(uint i=0; i<storageNodes.length; i++){
            if(storageNodes[i] == A){
                require(now >= paymentDates[i]);
                paymentDates[i] += oneWeek;
                storageNodes[i].transfer(storageNodeValue);   //amount of money should be sent to a storage node
            }
        }
    }

    function getStorageNodes() public view returns(address[]) {
        return storageNodes;
    }

    function getPaymentDates() public view returns(uint[]) {
        return paymentDates;
    }

    function getDecentorage() public view returns(address) {
        return decentorage;
    }

    function getwebUser() public view returns(address) {
        return webUser;
    }

    function getBalance() public view returns(uint) {
        return this.balance;
    }

    function inNodes(address A) public returns(bool) {
        for(uint i = 0 ; i < storageNodes.length ; i++){
            if(storageNodes[i] == A){
                return true;
            }
        }
        return false;
    }
    
    modifier restricted() {
        require(msg.sender == decentorage);
        _;
    }

    modifier storageRestricted() {
        require(inNodes(msg.sender));
        _;
    }
}