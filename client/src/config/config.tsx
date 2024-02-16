import { connect, disconnect } from "starknetkit";
import { Contract, RpcProvider } from "starknet";
import contractJson from "../abi/starkpaycontract_StarkPay.contract_class.json";
import tokenJson from "../abi/stark_pay_token_StarkPayToken.contract_class.json"

import pragma_abi from "../assets/pragmaabi.json";
import { Abi } from "starknet";

// const PRIVATE_KEY = "0x819033027885bc1840b6d564b6e8f68c"
const ACCOUNT_ADDRESS =
  "0x77a6390ab3dc3045df373b93bf8b93899c3ad5111da9b66c54b62ddc98e7d4";

// const CONTRACT_ADDRESS = "0x010a09eb11dd5cc68012039a1923209413a96eafdefd635ac406231627464328" // main contract address
const CONTRACT_ADDRESS =
  "0x056b8f4e1fae6635b7aa731ba0ac156c215ed17de41b9735ef4fad0236dac980";
const CONTRACT_ABI: Abi = contractJson.abi;
const TOKEN_ABI = tokenJson.abi;
const ERC20_ABI = "";
// Pragma configs
const PRAGMA_ABI = pragma_abi;
const PRAGMA_CONTRACT_ADDRESS =
  "0x06df335982dddce41008e4c03f2546fa27276567b5274c7d0c1262f3c2b5d167";
const TOKEN_CONTRACT_ADDRESS = "0x01438b148037d3c286559ec248f35912158675a48580b05892c6528cd18d2b7f"
let account: any = null;
async function connectWallet() {
  account = await connect({ webWalletUrl: "https://web.argent.xyz" });
  return account;
}

async function disconnectWallet() {
  await disconnect();
}

async function getServiceeByOwner() {
  const provider = new RpcProvider({
    nodeUrl:
      "https://starknet-goerli.g.alchemy.com/v2/7c94iaPgxj_nswxw0Clc1-mrAn0CJ1Yd",
  });

  try {
    const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, provider);
    const getService = await contract.get_services_by_owner();
    console.log(getService);
  } catch (error) {
    console.log(error);
  }
}

async function addService(
  serviceName: string,
  charge: number,
  serviceCode: string,
  serviceNumber: string
) {
  if (account) {
    const contract = new Contract(CONTRACT_ABI, CONTRACT_ADDRESS, account);
    const result = await contract.add_service("test", 10, "003", "004");
    console.log(result);
  }
}

// console.log(getServiceeByOwner());

// export {contract, provider, account}
export {
  ACCOUNT_ADDRESS,
  CONTRACT_ADDRESS,
  disconnectWallet,
  CONTRACT_ABI,
  ERC20_ABI,
  PRAGMA_ABI,
  PRAGMA_CONTRACT_ADDRESS,
  addService,
  TOKEN_CONTRACT_ADDRESS,
  TOKEN_ABI,
};
export default connectWallet;
