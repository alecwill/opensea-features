/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type {
  WyvernAtomicizer,
  WyvernAtomicizerInterface,
} from "../WyvernAtomicizer";

const _abi = [
  {
    constant: false,
    inputs: [
      {
        name: "addrs",
        type: "address[]",
      },
      {
        name: "values",
        type: "uint256[]",
      },
      {
        name: "calldataLengths",
        type: "uint256[]",
      },
      {
        name: "calldatas",
        type: "bytes",
      },
    ],
    name: "atomicize",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6060604052341561000f57600080fd5b6103948061001e6000396000f3006060604052600436106100405763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166368f0bcaa8114610045575b600080fd5b61014b6004602481358181019083013580602081810201604051908101604052809392919081815260200183836020028082843782019150505050505091908035906020019082018035906020019080806020026020016040519081016040528093929190818152602001838360200280828437820191505050505050919080359060200190820180359060200190808060200260200160405190810160405280939291908181526020018383602002808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061014d95505050505050565b005b600080610158610356565b60008651885114801561016c575085518851145b151561017757600080fd5b60009350600092505b875183101561034c5785838151811061019557fe5b906020019060200201516040518059106101ac5750595b818152601f19601f830116810160200160405290509150600090505b8583815181106101d457fe5b90602001906020020151811015610283578484815181106101f157fe5b01602001517f010000000000000000000000000000000000000000000000000000000000000090047f01000000000000000000000000000000000000000000000000000000000000000282828151811061024757fe5b9060200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600193840193016101c8565b87838151811061028f57fe5b9060200190602002015173ffffffffffffffffffffffffffffffffffffffff168784815181106102bb57fe5b906020019060200201518360405180828051906020019080838360005b838110156102f05780820151838201526020016102d8565b50505050905090810190601f16801561031d5780820380516001836020036101000a031916815260200191505b5091505060006040518083038185876187965a03f192505050151561034157600080fd5b600190920191610180565b5050505050505050565b602060405190810160405260008152905600a165627a7a72305820d1feddb359c944b3292f36374527aa15b47a5cb52c5ece7bf7df42d9840e33fb0029";

type WyvernAtomicizerConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: WyvernAtomicizerConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class WyvernAtomicizer__factory extends ContractFactory {
  constructor(...args: WyvernAtomicizerConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<WyvernAtomicizer> {
    return super.deploy(overrides || {}) as Promise<WyvernAtomicizer>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): WyvernAtomicizer {
    return super.attach(address) as WyvernAtomicizer;
  }
  connect(signer: Signer): WyvernAtomicizer__factory {
    return super.connect(signer) as WyvernAtomicizer__factory;
  }
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): WyvernAtomicizerInterface {
    return new utils.Interface(_abi) as WyvernAtomicizerInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): WyvernAtomicizer {
    return new Contract(address, _abi, signerOrProvider) as WyvernAtomicizer;
  }
}
