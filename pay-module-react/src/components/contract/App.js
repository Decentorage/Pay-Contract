import './App.css';
import web3 from './web3';
import web2decentorage from './web2decentorage';
import { Component } from 'react';

class App extends Component {
  
  //this code is running inside the constructor
  state = {
    manager: '',
    storageNodes:[],
    balance:'',
    value:''
  };

  async componentDidMount() {
    const accounts = await web3.eth.getAccounts();

    const manager = await web2decentorage.methods.getDecentorage().call({
      from: accounts[0]
    });
    const storageNodes = await web2decentorage.methods.getStorageNodes().call();
    console.log(storageNodes);
    const balance = await web3.eth.getBalance(web2decentorage.options.address);
    //console.log(manager);

    this.setState({ manager:manager, storageNodes:storageNodes, balance:balance });
  }

  onSubmit = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await web2decentorage.methods.addStorageNode(this.state.value).send({
      from: accounts[0]
    });
  }

  sendMoney = async (event) => {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();

    await web2decentorage.methods.userPay().send({
      from: accounts[0],
      value: 500
    });
  }

  render() {
    //console.log(web2decentorage.methods.getDecentorage());
    web3.eth.getAccounts().then(console.log); //can't use await here we use then instead
    //console.log(web3.version);
    return (
      <div>
        <h2>web2decentorage Contract</h2>
        <p>
          This contract is managed by {this.state.manager} <br></br>
          the number of storage nodes inside the contract {this.state.storageNodes.length} <br></br>
          the balance of the contract {web3.utils.fromWei(this.state.balance, 'ether')} ether!
        </p>

        <hr />

        <form onSubmit={this.onSubmit}>
          <h4>add another storage node</h4>
          <div>
            <label>enter the address of the storage node</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value:event.target.value })}
            />
          </div>
          <button>enter</button>
        </form>

        <hr />

        <form onSubmit={this.sendMoney}>
          <h4>send money to the contruct</h4>
          <button>pay</button>
        </form>
      </div>
    )
  };
};

export default App;
