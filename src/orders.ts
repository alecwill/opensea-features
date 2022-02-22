/* Copyright 2019 Ozone Networks, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE. */

//import BigNumber from "bignumber.js";
import { BigNumber } from '@0xproject/utils'
//import Web3 from 'web3';

import * as ethABI from 'ethereumjs-abi'
import { isValidAddress } from 'ethereumjs-util'

import { WyvernProtocol } from 'wyvern-js'
import * as WyvernSchemas from 'wyvern-schemas'
import {
  HowToCall,
  ReplacementEncoder,
  Network,
  ECSignature,
  Order as WyvernOrder,
} from 'wyvern-js/lib/types'
import {
  AnnotatedFunctionABI,
  FunctionInputKind,
  Schema,
} from 'wyvern-schemas/dist/types'
import type { Token } from 'wyvern-schemas/dist/types'
////
//import { HowToCall, ReplacementEncoder, Network, ECSignature, Order as WyvernOrder, } from "../wyvern-js/lib/types";

//import { WyvernAtomicizerContract } from "wyvern-js/lib/abi_gen/wyvern_atomicizer";

import { WyvernAtomicizer__factory } from './contracts/factories/WyvernAtomicizer__factory'
import { WyvernExchange__factory } from './contracts/factories/WyvernExchange__factory'

import { A, G, I, K, L, P, S, T, U, V, isS } from './utils'

// Constants
const NULL_BLOCK_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
const DEFAULT_GAS_INCREASE_FACTOR = 1.01
const INVERSE_BASIS_POINT = 10000

// Types
interface WyvernNFTAsset {
  id: string
  address: string
}
interface WyvernFTAsset {
  id?: string
  address: string
  quantity: string
}
type WyvernAsset = WyvernNFTAsset | WyvernFTAsset
enum WyvernSchemaName {
  ERC20 = 'ERC20',
  ERC721 = 'ERC721',
  ERC721v3 = 'ERC721v3',
  ERC1155 = 'ERC1155',
  LegacyEnjin = 'Enjin',
  ENSShortNameAuction = 'ENSShortNameAuction',
} // CryptoPunks = 'CryptoPunks'
interface WyvernBundle {
  assets: WyvernAsset[]
  schemas: WyvernSchemaName[]
  name?: string
  description?: string
  external_link?: string
}
enum OrderSide {
  Buy = 0,
  Sell = 1,
}
enum FeeMethod {
  ProtocolFee = 0,
  SplitFee = 1,
}
enum SaleKind {
  FixedPrice = 0,
  DutchAuction = 1,
}
//export enum SaleKind { FixedPrice = 0, EnglishAuction = 1, DutchAuction = 2, }

//export enum Network { Main = 'main',  Rinkeby = 'rinkeby',}
//export enum HowToCall {  Call = 0,  DelegateCall = 1,  StaticCall = 2,  Create = 3,}

export enum AbiType {
  Function = 'function',
  Constructor = 'constructor',
  Event = 'event',
  Fallback = 'fallback',
}

export enum WyvernProtocolError {
  InvalidSignature = 'INVALID_SIGNATURE',
  TransactionMiningTimeout = 'TRANSACTION_MINING_TIMEOUT',
  InvalidJump = 'INVALID_JUMP',
  OutOfGas = 'OUT_OF_GAS',
}

//export interface ECSignature { v: number;  r: string;  s: string;}

export interface Order extends UnsignedOrder, Partial<ECSignature> {
  // Read-only server-side appends
  createdTime?: BigNumber
  currentPrice?: BigNumber
  currentBounty?: BigNumber
  makerAccount?: OpenSeaAccount
  takerAccount?: OpenSeaAccount
  paymentTokenContract?: OpenSeaFungibleToken
  feeRecipientAccount?: OpenSeaAccount
  cancelledOrFinalized?: boolean
  markedInvalid?: boolean
  asset?: OpenSeaAsset
  assetBundle?: OpenSeaAssetBundle
}

export interface OpenSeaFungibleToken extends Token {
  imageUrl?: string
  ethPrice?: string
  usdPrice?: string
}

export type WyvernAtomicMatchParameters = [
  string[],
  BigNumber[],
  Array<number | BigNumber>,
  string,
  string,
  string,
  string,
  string,
  string,
  Array<number | BigNumber>,
  string[],
]
/**
 * Bundles of assets, grouped together into one OpenSea order
 * URLs for bundles are auto-generated from the name
 */
export interface OpenSeaAssetBundle {
  maker: OpenSeaAccount
  assets: OpenSeaAsset[]
  name: string
  slug: string
  permalink: string

  // Sell orders (auctions) on the bundle. Null if bundle in a list and didn't prefetch sell orders
  sellOrders: Order[] | null

  assetContract?: OpenSeaAssetContract
  description?: string
  externalLink?: string
}

interface OpenSeaAsset extends Asset {
  assetContract: OpenSeaAssetContract
  collection: OpenSeaCollection
  // The asset's given name
  name: string
  // Description of the asset
  description: string
  // Owner of the asset
  owner: OpenSeaAccount
  // Orders on the asset. Null if asset was fetched in a list
  orders: Order[] | null
  // Buy orders (offers) on the asset. Null if asset in a list and didn't prefetch buy orders
  buyOrders: Order[] | null
  // Sell orders (auctions) on the asset. Null if asset in a list and didn't prefetch sell orders
  sellOrders: Order[] | null

  // Whether the asset is on a pre-sale (so token ids aren't real)
  isPresale: boolean
  // The cached and size-optimized image url for this token
  imageUrl: string
  // The image preview url for this token.
  // Note: Loses gif animation and may have issues with SVGs
  imagePreviewUrl: string
  // The original image url for this token
  imageUrlOriginal: string
  // Thumbnail url for this token
  imageUrlThumbnail: string
  // Link to token on OpenSea
  openseaLink: string
  // Link to token on dapp's site
  externalLink: string
  // Array of traits on this token
  traits: object[]
  // Number of times this token has been traded (sold)
  numSales: number
  // Data about the last time this token was sold
  lastSale: AssetEvent | null
  // The suggested background color for the image url
  backgroundColor: string | null
  // The per-transfer fee, in base units, for this asset in its transfer method
  transferFee: BigNumber | string | null
  // The transfer fee token for this asset in its transfer method
  transferFeePaymentToken: OpenSeaFungibleToken | null
}

interface NumericalTraitStats {
  min: number
  max: number
}

interface StringTraitStats {
  [key: string]: number
}

export interface Asset {
  // The asset's token ID, or null if ERC-20
  tokenId: string | null
  // The asset's contract address
  tokenAddress: string
  // The Wyvern schema name (e.g. "ERC721") for this asset
  schemaName?: WyvernSchemaName
  // The token standard version of this asset
  version?: TokenStandardVersion
  // Optional for ENS names
  name?: string
  // Optional for fungible items
  decimals?: number
}

export enum TokenStandardVersion {
  Unsupported = 'unsupported',
  Locked = 'locked',
  Enjin = '1155-1.0',
  ERC721v1 = '1.0',
  ERC721v2 = '2.0',
  ERC721v3 = '3.0',
}

/**
 * Annotated collection with OpenSea metadata
 */
export interface OpenSeaCollection extends OpenSeaFees {
  // Name of the collection
  name: string
  // Slug, used in URL
  slug: string
  // Accounts allowed to edit this collection
  editors: string[]
  // Whether this collection is hidden from the homepage
  hidden: boolean
  // Whether this collection is featured
  featured: boolean
  // Date collection was created
  createdDate: Date

  // Description of the collection
  description: string
  // Image for the collection
  imageUrl: string
  // Image for the collection, large
  largeImageUrl: string
  // Image for the collection when featured
  featuredImageUrl: string
  // Object with stats about the collection
  stats: object
  // Data about displaying cards
  displayData: object
  // Tokens allowed for this collection
  paymentTokens: OpenSeaFungibleToken[]
  // Address for dev fee payouts
  payoutAddress?: string
  // Array of trait types for the collection
  traitStats: OpenSeaTraitStats
  // Link to the collection's main website
  externalLink?: string
  // Link to the collection's wiki, if available
  wikiLink?: string
}

export interface OpenSeaTraitStats {
  [traitName: string]: NumericalTraitStats | StringTraitStats
}

export interface AssetEvent {
  // The type of event
  eventType: AssetEventType

  // The timestamp of the transaction (if on-chain) or when the off-chain occurred
  eventTimestamp: Date

  // The auction type
  auctionType: AuctionType

  // The total price of the sale in the payment
  totalPrice: string

  // The transaction associated with the token sale
  transaction: Transaction | null

  // Details about the token used in the payment for this asset
  paymentToken: OpenSeaFungibleToken | null
}

/**
 * Defines set of possible auctions types
 */
enum AuctionType {
  Dutch = 'dutch',
  English = 'english',
  MinPrice = 'min_price',
}

/**
 * Defines the possible types of asset events that can take place
 */
enum AssetEventType {
  AuctionCreated = 'created',
  AuctionSuccessful = 'successful',
  AuctionCancelled = 'cancelled',
  OfferEntered = 'offer_entered',
  BidEntered = 'bid_entered',
  BidWithdraw = 'bid_withdraw',
  AssetTransfer = 'transfer',
  AssetApprove = 'approve',
  CompositionCreated = 'composition_created',
  Custom = 'custom',
  Payout = 'payout',
}

/**
 * Defines a Transaction type.
 */
export interface Transaction {
  // The details about the account that sent the transaction
  fromAccount: OpenSeaAccount

  // The details about the account that received the transaction
  toAccount: OpenSeaAccount

  // Date when the transaction was created
  createdDate: Date

  // Date when the transaction was modified
  modifiedDate: Date

  // The transaction hash
  transactionHash: string

  // The index of the transaction within the block
  transactionIndex: string

  // The number of the block in which this transaction resides
  blockNumber: string

  // The hash of the block in which this transaction resides
  blockHash: string

  // The timestamp of the transaction
  timestamp: Date
}

export interface OpenSeaAssetContract extends OpenSeaFees {
  // Name of the asset's contract
  name: string
  // Address of this contract
  address: string
  // Type of token (fungible/NFT)
  type: AssetContractType
  // Wyvern Schema Name for this contract
  schemaName: WyvernSchemaName

  // Total fee levied on sellers by this contract, in basis points
  sellerFeeBasisPoints: number
  // Total fee levied on buyers by this contract, in basis points
  buyerFeeBasisPoints: number

  // Description of the contract
  description: string
  // Contract's Etherscan / OpenSea symbol
  tokenSymbol: string
  // Image for the contract
  imageUrl: string
  // Object with stats about the contract
  stats?: object
  // Array of trait types for the contract
  traits?: object[]
  // Link to the contract's main website
  externalLink?: string
  // Link to the contract's wiki, if available
  wikiLink?: string
}

interface OpenSeaFees {
  // Fee for OpenSea levied on sellers
  openseaSellerFeeBasisPoints: number
  // Fee for OpenSea levied on buyers
  openseaBuyerFeeBasisPoints: number
  // Fee for the collection owner levied on sellers
  devSellerFeeBasisPoints: number
  // Fee for the collection owner levied on buyers
  devBuyerFeeBasisPoints: number
}

enum AssetContractType {
  Fungible = 'fungible',
  SemiFungible = 'semi-fungible',
  NonFungible = 'non-fungible',
  Unknown = 'unknown',
}

// Seaport
interface ExchangeMetadataForAsset {
  asset: WyvernAsset
  schema: WyvernSchemaName
  referrerAddress?: string
}
interface ExchangeMetadataForBundle {
  bundle: WyvernBundle
  referrerAddress?: string
}

type ExchangeMetadata = ExchangeMetadataForAsset | ExchangeMetadataForBundle
/*
export interface WyvernOrder {
  exchange: string;
  maker: string;
  taker: string;
  makerRelayerFee: BigNumber;
  takerRelayerFee: BigNumber;
  makerProtocolFee: BigNumber;
  takerProtocolFee: BigNumber;
  feeRecipient: string;
  feeMethod: number;
  side: number;
  saleKind: number;
  target: string;
  howToCall: number;
  calldata: string;
  replacementPattern: string;
  staticTarget: string;
  staticExtradata: string;
  paymentToken: string;
  basePrice: BigNumber;
  extra: BigNumber;
  listingTime: BigNumber;
  expirationTime: BigNumber;
  salt: BigNumber;
}
*/
interface UnhashedOrder extends WyvernOrder {
  feeMethod: FeeMethod
  side: OrderSide
  saleKind: SaleKind
  howToCall: HowToCall
  quantity: BigNumber

  // OpenSea-specific
  makerReferrerFee: BigNumber
  waitingForBestCounterOrder: boolean
  englishAuctionReservePrice?: BigNumber

  metadata: ExchangeMetadata
}

interface UnsignedOrder extends UnhashedOrder {
  hash: string
}

interface OpenSeaAccount {
  // Wallet address for this account
  address: string
  // Public configuration info, including "affiliate" for users who are in the OpenSea affiliate program
  config: string

  // This account's profile image - by default, randomly generated by the server
  profileImgUrl: string

  // More information explicitly set by this account's owner on OpenSea
  user: OpenSeaUser | null
}

interface OpenSeaUser {
  // Username for this user
  username: string
}

function validateAndFormatWalletAddress(address: string): string {
  return address
}

// utils/utils
function getOrderHash(order: UnhashedOrder) {
  const orderWithStringTypes = {
    ...order,
    maker: order.maker.toLowerCase(),
    taker: order.taker.toLowerCase(),
    feeRecipient: order.feeRecipient.toLowerCase(),
    side: order.side.toString(),
    saleKind: order.saleKind.toString(),
    howToCall: order.howToCall.toString(),
    feeMethod: order.feeMethod.toString(),
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return WyvernProtocol.getOrderHashHex(orderWithStringTypes as any)
}

// utils/schema
const encodeCall = (
  abi: AnnotatedFunctionABI,
  parameters: unknown[],
): string => {
  const inputTypes = abi.inputs.map((i) => i.type)
  return (
    '0x' +
    Buffer.concat([
      ethABI.methodID(abi.name, inputTypes),
      ethABI.rawEncode(inputTypes, parameters),
    ]).toString('hex')
  )
}

const encodeAtomicizedOrder = async (
  provider,
  schemas,
  assets,
  address,
  networkName,
  side,
) => {
  const {
    atomicizedCalldata,
    atomicizedReplacementPattern,
  } = await encodeAtomicizedCalldata(provider, schemas, assets, address, side)
  return {
    calldata: atomicizedCalldata,
    replacementPattern: atomicizedReplacementPattern,
    target: WyvernProtocol.getAtomicizerContractAddress(networkName),
  }
}

//const encodeReplacementPattern: ReplacementEncoder = WyvernProtocol.encodeReplacementPattern;

async function encodeAtomicizedCalldata(
  provider,
  schemas: Array<Schema<WyvernAsset>>,
  assets: WyvernAsset[],
  address: string,
  side: OrderSide,
) {
  const encoder = side === OrderSide.Sell ? undefined : encodeBuy

  let a = WyvernAtomicizer__factory.connect(NULL_ADDRESS, provider)
  try {
    const txs = assets.map((asset, i) => {
      const schema = schemas[i]
      const { target, calldata } = encoder(schema, asset, address)
      return {
        calldata,
        abi: schema.functions.transfer(asset),
        address: target,
        value: new BigNumber(0),
      }
    })

    let atomicizedCalldata = await a.atomicize(
      txs.map((t) => t.address),
      txs.map((t) => t.value.toString(10)),
      txs.map((t) => (t.calldata.length - 2) / 2),
      txs.map((t) => t.calldata).reduce((x, y) => x + y.slice(2)),
    )
    const kind = side === OrderSide.Buy ? FunctionInputKind.Owner : undefined
    const atomicizedReplacementPattern = WyvernProtocol.encodeAtomicizedReplacementPattern(
      txs.map((t) => t.abi),
      kind,
    )
    if (!atomicizedCalldata || !atomicizedReplacementPattern) {
      throw new Error(
        `Invalid calldata: ${atomicizedCalldata}, ${atomicizedReplacementPattern}`,
      )
    }
    return { atomicizedCalldata, atomicizedReplacementPattern }
  } catch (error) {
    L({ schemas, assets, address, side })
    throw new Error(
      `Failed to construct your order: likely something strange about this type of item. OpenSea has been notified. Please contact us in Discord! Original error: ${error}`,
    )
  }
}

type Encoder = (
  schema: Schema<WyvernAsset>,
  asset: WyvernAsset,
  address: string,
) => CallSpec
interface CallSpec {
  target: string
  calldata: string
  replacementPattern: string
}

const encodeBuy: Encoder = (schema, asset, address) => {
  const transfer = schema.functions.transfer(asset)
  const replaceables = transfer.inputs.filter(
    (i) => i.kind === FunctionInputKind.Replaceable,
  )
  const ownerInputs = transfer.inputs.filter(
    (i) => i.kind === FunctionInputKind.Owner,
  )

  // Validate
  if (replaceables.length !== 1) {
    throw new Error(
      'Only 1 input can match transfer destination, but instead ' +
        replaceables.length +
        ' did',
    )
  }

  // Compute calldata
  const parameters = transfer.inputs.map((input) => {
    switch (input.kind) {
      case FunctionInputKind.Replaceable:
        return address
      case FunctionInputKind.Owner:
        return WyvernProtocol.generateDefaultValue(input.type)
      default:
        try {
          return input.value.toString()
        } catch (e) {
          L({ schema, asset })
          throw e
        }
    }
  })
  return {
    target: transfer.target,
    calldata: encodeCall(transfer, parameters),
    replacementPattern:
      ownerInputs.length === 0
        ? '0x'
        : encodeReplacementPattern(transfer, FunctionInputKind.Owner),
  }
}

//
const ORDER_MATCHING_LATENCY_SECONDS = 60 * 60 * 24 * 7
const NULL_ADDRESS = WyvernProtocol.NULL_ADDRESS
const OPENSEA_FEE_RECIPIENT = '0x5b3256965e7c3cf26e11fcaf296dfc8807c01073'

let encodeReplacementPattern: ReplacementEncoder =
  WyvernProtocol.encodeReplacementPattern
function makeBigNumber(arg: number | string | BigNumber): BigNumber {
  return new BigNumber(arg === '0x' ? '0' : arg.toString())
} // fix "new BigNumber() number type has more than 15 significant digits" // Zero sometimes returned as 0x from contracts

let condErr = (c, err) => {
  if (!c) throw new Error(err)
  return c
}

function estimateCurrentPrice(
  order: Order,
  secondsToBacktrack = 30,
  shouldRoundUp = true,
) {
  let { basePrice, listingTime, expirationTime, extra } = order
  const { side, takerRelayerFee, saleKind } = order

  const now = new BigNumber(Math.round(Date.now() / 1000)).minus(
    secondsToBacktrack,
  )
  basePrice = new BigNumber(basePrice)
  listingTime = new BigNumber(listingTime)
  expirationTime = new BigNumber(expirationTime)
  extra = new BigNumber(extra)

  let exactPrice = basePrice

  if (saleKind === SaleKind.FixedPrice) {
  } // Do nothing, price is correct
  else if (saleKind === SaleKind.DutchAuction) {
    const diff = extra
      .times(now.minus(listingTime))
      .dividedBy(expirationTime.minus(listingTime))
    exactPrice =
      side == OrderSide.Sell ? basePrice.minus(diff) : basePrice.plus(diff)
  }

  // Add taker fee only for buyers
  if (side === OrderSide.Sell && !order.waitingForBestCounterOrder) {
    // Buyer fee increases sale price
    exactPrice = exactPrice.times(+takerRelayerFee / INVERSE_BASIS_POINT + 1)
  }

  return shouldRoundUp ? exactPrice.ceil() : exactPrice
}

const MIN_EXPIRATION_SECONDS = 10
class OpenSeaExchange {
  gasIncreaseFactor = DEFAULT_GAS_INCREASE_FACTOR
  networkName: string
  wyvex: any

  constructor(networkName: string, provider) {
    A(this, {
      networkName,
      wyvex: WyvernExchange__factory.connect(
        L(WyvernProtocol.getExchangeContractAddress(Network.Main)),
        provider,
      ),
    })
  }

  _getSchema(schemaName?: WyvernSchemaName): Schema<WyvernAsset> {
    const schemaName_ = schemaName || WyvernSchemaName.ERC721
    const schema = L(L(WyvernSchemas.schemas)[this.networkName]).filter(
      (s) => s.name == schemaName_,
    )[0]
    L({ schema })
    return condErr(
      schema,
      `Trading for this asset (${schemaName_}) is not yet supported. Please contact us or check back later!`,
    )
  }

  /**
   * Get the listing and expiration time parameters for a new order
   * @param expirationTimestamp Timestamp to expire the order (in seconds), or 0 for non-expiring
   * @param listingTimestamp Timestamp to start the order (in seconds), or undefined to start it now
   * @param waitingForBestCounterOrder Whether this order should be hidden until the best match is found
   */
  /*   private _getTimeParameters( expirationTimestamp: number, listingTimestamp?: number, waitingForBestCounterOrder = false ) {
    // Validation
    const minExpirationTimestamp = Math.round( Date.now() / 1000 + MIN_EXPIRATION_SECONDS );
    const minListingTimestamp = Math.round(Date.now() / 1000);
    if ( expirationTimestamp != 0 && expirationTimestamp < minExpirationTimestamp ) { throw new Error( `Expiration time must be at least ${MIN_EXPIRATION_SECONDS} seconds from now, or zero (non-expiring).` ); }
    if (listingTimestamp && listingTimestamp < minListingTimestamp) { throw new Error("Listing time cannot be in the past."); }
    if ( listingTimestamp && expirationTimestamp != 0 && listingTimestamp >= expirationTimestamp ) { throw new Error("Listing time must be before the expiration time."); }
    if (waitingForBestCounterOrder && expirationTimestamp == 0) { throw new Error("English auctions must have an expiration time."); }
    if (waitingForBestCounterOrder && listingTimestamp) { throw new Error(`Cannot schedule an English auction for the future.`); }
    if (parseInt(expirationTimestamp.toString()) != expirationTimestamp) { throw new Error(`Expiration timestamp must be a whole number of seconds`); }

    if (waitingForBestCounterOrder) { expirationTimestamp = (listingTimestamp = expirationTimestamp) + ORDER_MATCHING_LATENCY_SECONDS; // Expire one week from now, to ensure server can match it // Later, this will expire closer to the listingTime
    } else { listingTimestamp = listingTimestamp || Math.round(Date.now() / 1000 - 100); }// Small offset to account for latency

    return { listingTime: makeBigNumber(listingTimestamp), expirationTime: makeBigNumber(expirationTimestamp), };
  }
*/

  private async _atomicMatch({
    buy,
    sell,
    accountAddress,
    metadata = NULL_BLOCK_HASH,
  }: {
    buy: Order
    sell: Order
    accountAddress: string
    metadata?: string
  }) {
    let value,
      shouldValidateBuy = true,
      shouldValidateSell = true
    if (sell.maker.toLowerCase() == accountAddress.toLowerCase()) {
      // USER IS THE SELLER, only validate the buy order
      //    await this._sellOrderValidationAndApprovals({      order: sell,      accountAddress,    });
      throw 'Not implemented'
      shouldValidateSell = false
    } else if (buy.maker.toLowerCase() == accountAddress.toLowerCase()) {
      // USER IS THE BUYER, only validate the sell order
      await this._buyOrderValidationAndApprovals(
        L({ order: buy, counterOrder: sell, accountAddress }),
      )
      shouldValidateBuy = false

      // If using ETH to pay, set the value of the transaction to the current price
      if (buy.paymentToken == NULL_ADDRESS) {
        value = await this._getRequiredAmountForTakingSellOrder(sell)
      }
    } else {
    } // User is neither - matching service

    //  await this._validateMatch({    buy,    sell,    accountAddress,    shouldValidateBuy,    shouldValidateSell,  });

    //this._dispatch(EventType.MatchOrders, {    buy,    sell,    accountAddress,    matchMetadata: metadata,  });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    L({ buy, sell })
    const txnData: any = L({ from: accountAddress, value: value.toString() })
    let keysA =
      'exchange maker taker feeRecipient target staticTarget paymentToken'
    let keysB =
      'makerRelayerFee takerRelayerFee makerProtocolFee takerProtocolFee basePrice extra listingTime expirationTime salt'
    let keysC = 'feeMethod side saleKind howToCall'
    let h = (x, s) => V(G(P(x, T(s)), (a) => (isS(a) ? a : a.toString())))
    let w = (s) => [...h(buy, s), ...h(sell, s)]
    const args: WyvernAtomicMatchParameters = L([
      w(keysA),
      w(keysB),
      w(keysC),
      buy.calldata,
      sell.calldata,
      buy.replacementPattern,
      sell.replacementPattern,
      buy.staticExtradata,
      sell.staticExtradata,
      [buy.v || 0, sell.v || 0],
      [
        buy.r || NULL_BLOCK_HASH,
        buy.s || NULL_BLOCK_HASH,
        sell.r || NULL_BLOCK_HASH,
        sell.s || NULL_BLOCK_HASH,
        metadata,
      ],
    ])
    //try {
    //try {
    return L(await this.wyvex.atomicMatch_(...args, txnData))
    //} catch (error) { throw new Error(S({msg: `AtomicMatch send transaction error`, args, error})); }
  }

  public _correctGasAmount(estimation: number): number {
    return Math.ceil(estimation * this.gasIncreaseFactor)
  }

  async fulfillOrder(
    order: Order,
    accountAddress: string,
    recipientAddress?: string,
    referrerAddress?: string,
  ): Promise<string> {
    L({
      fulfillOrder: [order, accountAddress, recipientAddress, referrerAddress],
    })
    const matchingOrder = await this._makeMatchingOrder(
      order,
      accountAddress,
      recipientAddress || accountAddress,
    )
    let assignOrdersToSides = (
      o: Order,
      h: UnsignedOrder,
    ): { buy: Order; sell: Order } =>
      ((g) => ({
        buy: g(o.side == OrderSide.Buy),
        sell: g(o.side == OrderSide.Sell),
      }))((z) => (z ? o : { ...h, ...P(o, T('v r s')) }))
    let _getMetadata = (order: Order, referrerAddress?: string) =>
      ((referrer) => (referrer && isValidAddress(referrer) ? referrer : U))(
        referrerAddress || order.metadata.referrerAddress,
      )
    const transactionHash = await this._atomicMatch(
      A(assignOrdersToSides(order, matchingOrder), {
        accountAddress,
        metadata: _getMetadata(order, referrerAddress),
      }),
    )
    L({ transactionHash })
    //  await this._confirmTransaction( transactionHash, EventType.MatchOrders, "Fulfilling order", async () => { const isOpen = await this._validateOrder(order); return !isOpen; } );
    return transactionHash
  }

  async _makeMatchingOrder(
    order: UnsignedOrder,
    accountAddress: string,
    recipientAddress: string,
  ): Promise<UnsignedOrder> {
    accountAddress = validateAndFormatWalletAddress(accountAddress)
    recipientAddress = validateAndFormatWalletAddress(recipientAddress)
    const { target, calldata, replacementPattern } = await (async () => {
      if ('bundle' in order.metadata) {
        // We're matching a bundle order
        throw { err: 'Feature not yet available' }
        /*       const bundle = order.metadata.bundle;
        const orderedSchemas = bundle.schemas ? bundle.schemas.map((schemaName) => this._getSchema(schemaName)): bundle.assets.map(() => this._getSchema( order.metadata?.schema ) );          
        const atomicized = await encodeAtomicizedOrder(provider, orderedSchemas, order.metadata.bundle.assets, recipientAddress, Network[this.networkName], order.side);
        return { target: WyvernProtocol.getAtomicizerContractAddress(Network[this.networkName]), calldata: atomicized.calldata, replacementPattern: atomicized.replacementPattern, };*/
      } else if ('asset' in order.metadata) {
        return (order.side == OrderSide.Buy ? undefined : encodeBuy)(
          this._getSchema(order.metadata.schema),
          order.metadata.asset,
          recipientAddress,
        )
      } else {
        throw new Error('Invalid order metadata')
      }
    })()
    //    const times = this._getTimeParameters(0);
    const feeRecipient =
      order.feeRecipient == NULL_ADDRESS ? OPENSEA_FEE_RECIPIENT : NULL_ADDRESS // Compat for matching buy orders that have fee recipient still on them
    const matchingOrder = A(
      P(
        order,
        T(
          'exchange howToCall listingTime metadata expirationTime quantity feeMethod paymentToken basePrice makerRelayerFee takerRelayerFee makerProtocolFee takerProtocolFee makerReferrerFee',
        ),
      ),
      {
        maker: accountAddress,
        taker: order.maker,
        waitingForBestCounterOrder: false,
        feeRecipient,
        side: (order.side + 1) % 2,
        saleKind: SaleKind.FixedPrice,
        target,
        calldata,
        replacementPattern,
        staticTarget: NULL_ADDRESS,
        staticExtradata: '0x',
        extra: makeBigNumber(0),
        salt: WyvernProtocol.generatePseudoRandomSalt(),
      },
    ) as any
    return { ...matchingOrder, hash: getOrderHash(matchingOrder) }
  }

  /*     public async _validateMatch(      {        buy,        sell,        accountAddress,        shouldValidateBuy = false,        shouldValidateSell = false,      }: {
        buy: Order;        sell: Order;        accountAddress: string;        shouldValidateBuy?: boolean;        shouldValidateSell?: boolean;      },      retries = 1    ): Promise<boolean> {
      try {
        condErr(shouldValidateBuy && !await this._validateOrder(buy),  "Invalid buy order. It may have recently been removed. Please refresh the page and try again!"            );            
        condErr(shouldValidateSell && !await this._validateOrder(sell),  "Invalid sell order. It may have recently been removed. Please refresh the page and try again!"            );           
        const canMatch = await requireOrdersCanMatch(          this._getClientsForRead(retries).wyvernProtocol,          { buy, sell, accountAddress }        );
        const calldataCanMatch = await requireOrderCalldataCanMatch(          this._getClientsForRead(retries).wyvernProtocol,          { buy, sell }        );
        L({canMatch, calldataCanMatch})
        return true;
      } catch (error) {
        if (retries <= 0) {          throw new Error(            `Error matching this listing: ${              error instanceof Error ? error.message : ""            }. Please contact the maker or try again later!`          );        }
        await delay(500);
        return await this._validateMatch(          { buy, sell, accountAddress, shouldValidateBuy, shouldValidateSell },          retries - 1        );
      }
    }
  */

  private async _getRequiredAmountForTakingSellOrder(sell: Order) {
    const currentPrice = await this.getCurrentPrice(sell)
    const estimatedPrice = estimateCurrentPrice(sell)

    const maxPrice = BigNumber.max(currentPrice, estimatedPrice)

    // TODO Why is this not always a big number? --> takerRelayerFee is not a field of this type
    sell.takerRelayerFee = makeBigNumber(sell.takerRelayerFee)
    const feePercentage = sell.takerRelayerFee.div(INVERSE_BASIS_POINT)
    const fee = feePercentage.times(maxPrice)
    return fee.plus(maxPrice).ceil()
  }
  public async getCurrentPrice(order: Order) {
    return await this.wyvex.calculateCurrentPrice_(
      V(
        L(
          P(
            order,
            T(
              'exchange maker taker feeRecipient target staticTarget paymentToken',
            ),
          ),
        ),
      ),
      V(
        L(
          P(
            order,
            T(
              'makerRelayerFee takerRelayerFee makerProtocolFee takerProtocolFee basePrice extra listingTime expirationTime salt',
            ),
          ),
        ),
      ),
      ...V(
        L(
          P(
            order,
            T(
              'feeMethod side saleKind howToCall calldata replacementPattern staticExtradata',
            ),
          ),
        ),
      ),
    )
  }

  /*
   public async getTokenBalance(    {      accountAddress,      tokenAddress,      schemaName = WyvernSchemaName.ERC20,    }: {      accountAddress: string;      tokenAddress: string;      schemaName?: WyvernSchemaName;    },    retries = 1
  ) {
    const asset: Asset = {      tokenId: null,      tokenAddress,      schemaName,    };
    return this.getAssetBalance({ accountAddress, asset }, retries);
  }

   public async getAssetBalance(    { accountAddress, asset }: { accountAddress: string; asset: Asset },    retries = 1  ): Promise<BigNumber> {
    const schema = this._getSchema(asset.schemaName);
    const wyAsset = getWyvernAsset(schema, asset);
    if (schema.functions.countOf) {
      // ERC20 or ERC1155 (non-Enjin)
      const abi = schema.functions.countOf(wyAsset);
      const contract = this._getClientsForRead(retries)        .web3.eth.contract([abi as Web3.FunctionAbi])        .at(abi.target);
      const inputValues = abi.inputs        .filter((x) => x.value !== undefined)        .map((x) => x.value);
      const count = await promisifyCall<BigNumber>((c) =>        contract[abi.name].call(accountAddress, ...inputValues, c)      );

      if (count !== undefined) {        return count;      }
    } else if (schema.functions.ownerOf) {
      // ERC721 asset
      const abi = schema.functions.ownerOf(wyAsset);
      const contract = this._getClientsForRead(retries)        .web3.eth.contract([abi as Web3.FunctionAbi])        .at(abi.target);
      if (abi.inputs.filter((x) => x.value === undefined)[0]) {        throw new Error(          "Missing an argument for finding the owner of this asset"        );      }
      const inputValues = abi.inputs.map((i) => i.value.toString());
      const owner = await promisifyCall<string>((c) =>        contract[abi.name].call(...inputValues, c)
      );
      if (owner) {        return owner.toLowerCase() == accountAddress.toLowerCase()          ? new BigNumber(1)          : new BigNumber(0);      }
    } else {
      // Missing ownership call - skip check to allow listings
      // by default
      throw new Error("Missing ownership schema for this asset type");
    }

    condErr(retries <= 0, "Unable to get current owner from smart contract");
    setTimeout(() => await this.getAssetBalance({ accountAddress, asset }, retries - 1), 500);    
  }*/

  async _buyOrderValidationAndApprovals({
    order,
    counterOrder,
    accountAddress,
  }: {
    order: UnhashedOrder
    counterOrder?: Order
    accountAddress: string
  }) {
    const tokenAddress = order.paymentToken
    /*    if (tokenAddress != NULL_ADDRESS) {
      const balance = await this.getTokenBalance({accountAddress,        tokenAddress});

      let minimumAmount = makeBigNumber(order.basePrice);
      if (counterOrder) {        minimumAmount = await this._getRequiredAmountForTakingSellOrder(          counterOrder        );      }

      // Check WETH balance
      condErr((balance.toNumber() < minimumAmount.toNumber()), (tokenAddress == WyvernSchemas.tokens[this._networkName].canonicalWrappedEther.address) ? "Insufficient balance. You may need to wrap Ether.":"Insufficient balance.");     

      // Check token approval
      // This can be done at a higher level to show UI
      await this.approveFungibleToken({accountAddress,        tokenAddress,        minimumAmount});
    }*/

    // Check order formation
    L({ order })
    condErr(
      L(
        await this.wyvex.validateOrderParameters_(
          V(
            L(
              P(
                order,
                T(
                  'exchange maker taker feeRecipient target staticTarget paymentToken',
                ),
              ),
            ),
          ),
          //V(L(P(order, T("makerRelayerFee takerRelayerFee makerProtocolFee takerProtocolFee basePrice extra listingTime expirationTime salt")))),
          V(
            L(
              G(
                P(
                  order,
                  T(
                    'makerRelayerFee takerRelayerFee makerProtocolFee takerProtocolFee basePrice extra listingTime expirationTime salt',
                  ),
                ),
                (s) => s + '',
              ),
            ),
          ),
          order.feeMethod,
          order.side,
          order.saleKind,
          order.howToCall,
          order.calldata,
          order.replacementPattern,
          order.staticExtradata,
          { from: accountAddress },
        ),
      ),
      `Failed to validate buy order parameters. Make sure you're on the right network!`,
    )
    L('_buyOrderValidationAndApprovals done')
  }
}

export { OpenSeaExchange }
