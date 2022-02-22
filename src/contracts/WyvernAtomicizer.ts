/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface WyvernAtomicizerInterface extends utils.Interface {
  functions: {
    "atomicize(address[],uint256[],uint256[],bytes)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "atomicize",
    values: [string[], BigNumberish[], BigNumberish[], BytesLike]
  ): string;

  decodeFunctionResult(functionFragment: "atomicize", data: BytesLike): Result;

  events: {};
}

export interface WyvernAtomicizer extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: WyvernAtomicizerInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    atomicize(
      addrs: string[],
      values: BigNumberish[],
      calldataLengths: BigNumberish[],
      calldatas: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  atomicize(
    addrs: string[],
    values: BigNumberish[],
    calldataLengths: BigNumberish[],
    calldatas: BytesLike,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    atomicize(
      addrs: string[],
      values: BigNumberish[],
      calldataLengths: BigNumberish[],
      calldatas: BytesLike,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    atomicize(
      addrs: string[],
      values: BigNumberish[],
      calldataLengths: BigNumberish[],
      calldatas: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    atomicize(
      addrs: string[],
      values: BigNumberish[],
      calldataLengths: BigNumberish[],
      calldatas: BytesLike,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
