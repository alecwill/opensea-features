import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react'
//import React from 'react'
//import ReactDOM from 'react-dom'
import Popup from './components/Popup/Popup'
import { UserProvider } from './utils/user'
//"homepage": "https://nonfungiblesolutions.github.io/extension-test/",
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/alt-text */
import React, { ClassType } from 'react'
import ReactDOM from 'react-dom'
import { ethers } from 'ethers'

import { ERC721__factory } from './contracts/factories/ERC721__factory'

//import reportWebVitals from './reportWebVitals';
import { OpenSeaExchange } from './orders'

import {
  colors,
  elWithAttrs,
  button,
  tabl,
  box,
  checkBox,
  unflat,
  styleWrap,
  Select,
  ViewPort,
  CompWithViewPort,
  Flavour,
  TileSet,
  TabControl,
  Input,
  Choice,
  CheckBox,
  Toggle,
  Comp,
  ObjectArray,
  ExpandableForm,
  AutoArray,
} from './ui'
import {
  A,
  D,
  G,
  K,
  L,
  E,
  S,
  T,
  I,
  U,
  V,
  W,
  oA,
  oO,
  oF,
  P,
  isO,
  camelSnake,
} from './utils'
import './index.css'
import { RarityTier, determineRarityTier } from './raritype'
import { formatters, ellips } from './formatters'

let fetchJson = async (url, data, options = {}) =>
  await (
    await fetch(
      url,
      A(options, {
        headers: { 'Content-Type': 'application/json' },
        body: S(data),
      }),
    )
  ).json()
let srv = 'https://spacetimemanifolds.com/api/',
  api = (m, p) => fetchJson(`${srv}${m}`, p, { method: 'POST' })
//const provider = new ethers.providers.JsonRpcProvider('https://eth-mainnet.alchemyapi.io/v2/0uOGCRgiQKThWcxY0Pc14chod0zl79fH');

class Sniper {
  name: string
  maxPrice: BigInteger
  minPrice: BigInteger
  minRank: number
  traits: object
  constructor(filter) {
    A(this, filter)
  }
}
class TraitsFilter extends CompWithViewPort<
  { traits: object; totalSupply: number; onChanged: (any) => void },
  { traitsChecked: object }
> {
  constructor(p, s) {
    super(p, A({ traitsChecked: {} }, s))
  }
  componentDidUpdate(pp) {
    if (pp.traits !== this.props.traits)
      this.setState({
        traitsChecked: G(this.props.traits, (x) => G(x, () => true)),
      })
  }
  //r = (p, s) => box(tabl(E(oO(s.traitsChecked)).map(([t, v]) => [box(tabl([[t], [tabl(unflat(E(v).map(([h, q]) => checkBox(`${h} (${oO(p.traits[t])[h]})`, s.traitsChecked[t][h], c => this.setState({traitsChecked: (x => { x[t][h] = !x[t][h]; oF(p.onChanged)(x); return x })(s.traitsChecked) }))), 3))]]), 4)])), 3);
  r = (p, s) =>
    box(
      <TabControl
        tabs={G(oO(s.traitsChecked), (v, t) =>
          box(
            tabl(
              unflat(
                E(v).map(([h, q]) =>
                  checkBox(
                    `${h} (${
                      Math.round(
                        (10000 * oO(oO(p.traits)[t])[h]) / p.totalSupply,
                      ) / 100
                    }%)`,
                    s.traitsChecked[t][h] === true,
                    (c) =>
                      this.setState({
                        traitsChecked: ((x) => {
                          x[t][h] = !x[t][h]
                          oF(p.onChanged)(x)
                          return x
                        })(s.traitsChecked),
                      }),
                  ),
                ),
                3,
              ),
            ),
          ),
        )}
      />,
    )
}

let autoTable = (x, onSelect = I) =>
  box(
    <ObjectArray
      {...{
        data: oA(x),
        keys: K(oO(oA(x)[0])),
        showHeader: true,
        formatters,
        onSelect,
      }}
    />,
  )

let safeBN = (from) => {
  try {
    return D(from) && from !== null ? ethers.BigNumber.from(from) : U
  } catch (e) {
    return U
  }
}

class Asset extends CompWithViewPort<{}, {}> {
  imgSize = () => 0.9 * Math.min(this.props.vp.x, this.props.vp.y)
  r = (p, s) =>
    tabl([
      [
        ((c) => (
          <div
            style={{
              color: RarityTier[c]?.color?.light,
              backgroundColor: RarityTier[c]?.color?.dark,
              borderRadius: '0.25em',
            }}
          >
            {ellips(`#${p.rarityRank} ${c}`, this.imgSize())}
          </div>
        ))(K(RarityTier)[p.rarityTier]),
      ],
      [
        <img
          src={p.image_thumbnail_url}
          style={{
            width: `${this.imgSize()}em`,
            height: `${this.imgSize()}em`,
            borderRadius: `${this.imgSize() / 10}em`,
          }}
        />,
      ],
      [
        tabl(
          [
            ((x) =>
              x ? (
                button(
                  x,
                  async () => {
                    L({
                      sell_orders: p.sell_orders,
                      current_price: formatters.current_price(
                        safeBN(p?.current_price),
                      ),
                    })
                    const accountAddress = await signer.getAddress()
                    let convertTimes = (o) =>
                      G(o, (v, k) =>
                        T('listingTime expirationTime').includes(k)
                          ? `${v}`
                          : v,
                      )
                    let hash = await ose.fulfillOrder(
                      convertTimes(camelSnake(p.sell_orders[0])),
                      accountAddress,
                    )
                    L({ hash })
                  },
                  'buttonO',
                )
              ) : (
                <div style={{ height: '2.5em' }} />
              ))(formatters.current_price(safeBN(p?.current_price))),
          ]
            .filter(D)
            .map((x) => [x]),
        ),
      ],
    ])
}
class CollectionSummary2 extends CompWithViewPort<{}, {}> {
  imgSize = () => 0.9 * Math.min(this.props.vp.x, this.props.vp.y)
  r = (p, s) => (
    <div
      style={{
        width: `100%`,
        height: `100%`,
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: p.selected ? colors.yellow : colors.purple,
      }}
    >
      {tabl([
        [
          <img
            src={p.image_url}
            style={{
              width: `${this.imgSize()}em`,
              height: `${this.imgSize()}em`,
              borderRadius: `${this.imgSize() / 10}em`,
            }}
          />,
        ],
        [ellips(p.name, this.imgSize())],
      ])}
    </div>
  )
}
class CollectionSummary extends Comp<{}, {}> {
  r = (p, s) =>
    tabl([
      [
        <img src={p.image_url} style={{ height: '3.333em' }} />,
        tabl([
          [
            `${p.name} ${Math.round(
              (100 * p.assetsLoadedOpenSea) / Math.min(10000, p.total_supply),
            )}%`,
          ],
          [`(${p.total_supply})`],
        ]),
      ],
    ])
}

let sortKeysFromObject = (o) =>
  E(o)
    .map(([k, v]) =>
      isO(v) ? sortKeysFromObject(v).map((s) => `${k}.${s}`) : k,
    )
    .flat()

class RemoteArray extends CompWithViewPort<
  {
    method: string
    filters: object
    parms: object
    caption: string
    sortKeyObjectProj: Function
    hasSort: boolean
    filterBelow: boolean
    objectToUI: (object) => any
    onSelect: (any) => any
  },
  {
    offset: number
    sortIx: number
    limit: number
    listMode: boolean
    data: object[]
    sortKey: any
  }
> {
  public static defaultProps = {
    vp: U,
    hasSort: false,
    filterBelow: false,
    method: U,
    parms: {},
    objectToUI: U,
    onSelect: I,
    filters: U,
    caption: U,
    sortKeyObjectProj: I,
  }
  constructor(p, s) {
    super(p, A({ offset: 0, limit: 50, data: [], listMode: false }, s))
  }
  update = async () =>
    await this.setState(
      L({
        data: await api(
          this.props.method,
          A(this.props.parms, P(this.state, T('limit offset sortKey'))),
        ),
      }),
    )
  componentDidMount() {
    this.update()
  }
  componentDidUpdate(prevP) {
    if (prevP.method !== this.props.method || prevP.parms !== this.props.parms)
      this.update()
  }
  componentWillUnmount() {}
  r = (p, s) =>
    tabl([
      [
        tabl(
          (([f, c]) => (p.filterBelow ? [[c], [f]] : [[f, c]]))([
            tabl(
              ((g) =>
                p.filterBelow
                  ? [g.map((x) => box(x))]
                  : g.map((x) => [box(x)]))(
                [
                  !p.hasSort
                    ? U
                    : tabl([
                        ['Sort key'],
                        [
                          <Select
                            options={sortKeysFromObject(
                              p.sortKeyObjectProj(oO(oA(s.data?.page)[0])),
                            )}
                            onChange={(sortKey) => this.setState({ sortKey })}
                          />,
                        ],
                      ]),
                  E(p.filters).length > 0
                    ? tabl([
                        ['Filters'],
                        ...E(p.filters).map((x) => [tabl(x.map((y) => [y]))]),
                      ])
                    : U,
                ].filter(D),
              ),
            ),
            tabl([
              [
                D(p.objectToUI) && !s.listMode ? (
                  <TileSet
                    {...P(p, T('vp objectToUI onSelect'))}
                    items={s.data?.page}
                  />
                ) : (
                  autoTable(s.data?.page, p.onSelect)
                ),
                box(
                  tabl([
                    [
                      button('<', () =>
                        this.setState(
                          { offset: Math.max(0, s.offset - s.limit) },
                          () => this.update(),
                        ),
                      ),
                    ],
                    [`${s.offset}/${s.data?.total} (${s.limit}))`],
                    [
                      button('>', () =>
                        this.setState({ offset: s.offset + s.limit }, () =>
                          this.update(),
                        ),
                      ),
                    ],
                  ]),
                ),
              ],
            ]),
          ]),
        ),
      ],
      //    [tabl([[p.caption || `${p.method}(${S(p.parms)})`, box(<Toggle caption={"List"} checked={s.listMode} onChange={() => this.setState({listMode: !s.listMode})}/>), box(tabl([[button("<", () => this.setState({offset: Math.max(0, s.offset - s.limit)}, () => this.update())), `${s.offset}/${s.data?.total} (${s.limit}))`, button(">", () => this.setState({offset: s.offset + s.limit}, () => this.update()))]]))]])],
    ])
}

class Filterable<P = {}, S = {}> extends CompWithViewPort<
  P,
  { filter: object } & S
> {
  constructor(p, s) {
    super(p, A({ filter: {} }, s))
  }
  genFilter = (name, type, changeTrafo) => ({
    [name]: (
      <Input
        value={this.state.filter[name] || ''}
        placeholder={name}
        onChange={(q) =>
          this.setState({
            filter: A(this.state.filter, { [name]: oF(changeTrafo)(q) }),
          })
        }
      />
    ),
  })
}

let assetUIO = (a) => (
  <Asset
    {...P(
      a,
      T(
        'image_thumbnail_url traits rarity rarityRank rarityTier sell_orders current_price vp selected',
      ),
    )}
  />
)
class Collection extends Filterable<
  { name: string; onAddSniper: (Sniper) => void },
  {}
> {
  constructor(p, s) {
    super(
      p,
      A({ data: {}, filter: { maxRarityTier: K(RarityTier).length - 1 } }, s),
    )
  }
  update() {
    ;(async () =>
      this.setState(
        L({ data: await api('getCollection', L({ name: this.props.name })) }),
      ))()
  }
  componentDidMount() {
    this.update()
  }
  componentDidUpdate(prevP) {
    if (prevP.name !== this.props.name) this.update()
  }
  r = (p, s) =>
    box(
      tabl([
        [
          button('Add sniper', () =>
            p.onAddSniper(new Sniper(A(s.filter, { name: p.name }))),
          ),
        ],
        [
          <RemoteArray
            vp={p.vp.horScale(0.66)}
            caption={`Collection ${p.name} (filtered)`}
            method="getAssets"
            parms={{ filter: A({ name: p.name }, s.filter) }}
            objectToUI={assetUIO}
            onSelect={(x) => this.setState(L({ sel: x.token_id }))}
            filters={{
              ...this.genFilter('maxPrice', U, I),
              ...this.genFilter('minPrice', U, I),
              ...this.genFilter('maxRank', U, (q) => parseInt(q)),
              maxRarityTier: (
                <Choice
                  options={K(RarityTier)}
                  ix={s.filter.maxRarityTier}
                  onChange={(maxRarityTier) =>
                    this.setState({ filter: A(s.filter, { maxRarityTier }) })
                  }
                />
              ),
              traits: (
                <TraitsFilter
                  traits={s.data?.traits}
                  totalSupply={s.data?.total_supply}
                  onChanged={(traits) =>
                    this.setState({ filter: A(s.filter, { traits }) })
                  }
                />
              ),
            }}
          />,
        ],
      ]),
    )
}
let collectionToUI = (c) => (
  <CollectionSummary2
    {...P(c, T('name assetsLoadedOpenSea total_supply image_url vp selected'))}
  />
)
class CollectionPicker extends Filterable<
  { onChange: Function },
  { prefix: string; suggestions: string[] }
> {
  timer: NodeJS.Timer
  constructor(p, s) {
    super(p, A({ prefix: '', suggestions: [], filter: {} }, s))
  }
  r = (p, s) => (
    <RemoteArray
      vp={p.vp.verSub(10).horScale(0.9).verScale(0.9)}
      filterBelow={true}
      hasSort={true}
      caption="Collection picker"
      method="getLibrary"
      parms={{ prefix: s.prefix, filter: s.filter }}
      objectToUI={collectionToUI}
      onSelect={(x) => p.onChange(L(x))}
      sortKeyObjectProj={(o) => P(o, T('name stats total_supply created_date'))}
      filters={{
        prefix: (
          <Flavour
            options={s.suggestions}
            onChange={(prefix) => {
              L({ changedPrefix: prefix })
              if (this.timer) clearInterval(this.timer)
              this.timer = setTimeout(
                () => api('getCollection', { name: prefix }),
                1000,
              )
              this.setState(L({ prefix, suggestions: [] }), async () =>
                this.setState(
                  L({
                    suggestions: await api('getCollectionsWithPrefix', {
                      prefix,
                    }),
                  }),
                ),
              )
            }}
          />
        ),
      }}
    />
  )
}

class Library extends CompWithViewPort<
  { onAddSniper: Function },
  { coll: any }
> {
  r = (p, s) => {
    let name = s.coll?.name,
      vp = p.vp.verScale(1.0 / (name ? 2 : 1))
    return tabl(
      [
        <CollectionPicker
          vp={vp}
          onChange={(coll) => this.setState(L({ coll }))}
        />,
        name && <Collection vp={vp} name={name} onAddSniper={p.onAddSniper} />,
      ]
        .filter(D)
        .map((x) => [x]),
    )
  }
}

let snipers = [
  { name: 'doodles-official', maxRarityTier: 1 },
  { name: 'lazy-lions', maxRarityTier: 1 },
]

let licenses = {
  LicenseA: { address: '0xb3a3783f747ca7ecdb335d3ecb06dca1c9b8860e' },
}
let checkLicense = async (l, accountAddress) => {
  L({ l })
  let nft = ERC721__factory.connect(l.address, provider)
  let bal = await nft.balanceOf(accountAddress)
  L({ bal })
  return {}
}

declare global {
  interface Window {
    ethereum: any
  }
}

const provider = new ethers.providers.Web3Provider(window.ethereum)
const signer = provider.getSigner()
let ethRequestAccounts = async () => {
  let r = await provider.send('eth_requestAccounts', [])
  L({ eth_requestAccounts: r })
}
//(async () => { console.log("Account:", await signer.getAddress()); })();
let ose = new OpenSeaExchange('main', signer)

let getViewPort = () =>
  ((emf) => new ViewPort(window.innerWidth / emf, window.innerHeight / emf))(
    parseFloat(getComputedStyle(document.querySelector('body'))['font-size']),
  )

class Wallet extends CompWithViewPort<{}, { walletTypeIx: number }> {
  constructor(p, s) {
    super(p, { walletTypeIx: 0 })
  }
  r = (p, s) => {
    return tabl([
      [
        <Choice
          options={['Built-in', 'Metamask']}
          ix={s.walletTypeIx}
          onChange={(walletTypeIx) => this.setState({ walletTypeIx })}
        />,
      ],
      [
        s.walletTypeIx === 1 ? (
          'Metamask'
        ) : (
          <Input value={''} placeholder={''} onChange={I} />
        ),
      ],
    ])
  }
}

class App extends Comp<
  {},
  {
    accountAddress: string
    orders: object[]
    snipers: Sniper[]
    status: object
    vp: ViewPort
  }
> {
  timer: NodeJS.Timeout
  constructor(p, s) {
    super(p, { snipers, orders: [], status: {}, vp: getViewPort() })
    window.onresize = (e) =>
      this.setState(L({ vp: getViewPort().verSub(5).horSub(9) }))
  }
  update = async () => {
    let accountAddress
    try {
      accountAddress = await signer.getAddress()
    } catch (err) {
      L({ err })
    }
    let accounts = [accountAddress, '   ']
    this.setState({ accountAddress }) // licenses: await W(G(licenses, l => checkLicense(l, accountAddress)))
  }
  componentDidMount() {
    setInterval(() => this.update(), 5000)
    this.update()
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }
  r(p, s) {
    let cleanName = (n: string) => n.replace(/_/g, ' ')
    let actions = {
      Connect_Ethereum_Wallet: I,
      Detect_Drop: I,
      Gas_Presets: I,
      Autosnipe_Contract: I,
      Tokens_Finder: I,
    }
    let forms = {}
    let menuItems = A(
      G(actions, (f, n: string) => button(cleanName(n), f)),
      G(forms, (H, k) => <ExpandableForm caption={cleanName(k)} form={H} />),
    )
    return !s.accountAddress ? (
      button(
        tabl([
          [<img src={'./images/metamask.webp'} style={{ height: '2.5em' }} />],
          ['Metamask'],
        ]),
        ethRequestAccounts,
        'buttonO',
      )
    ) : (
      <TabControl
        tabs={{
          Library: (
            <Library
              vp={(s.vp || p.vp).verSub(5)}
              onAddSniper={(q) =>
                this.setState((s, p) => ({ snipers: [...s.snipers, q] }))
              }
            />
          ),
          Wallet: <Wallet />,
          Snipers: autoTable(
            s.snipers.map((q, i) =>
              A(
                {
                  action: button('Delete', () =>
                    this.setState({
                      snipers: s.snipers
                        .slice(0, i)
                        .concat(s.snipers.slice(i + 1)),
                    }),
                  ),
                },
                q,
              ),
            ),
          ),
          Orders: <RemoteArray method="getOrders" />,
          Hunting_grounds: (
            <RemoteArray
              vp={s.vp || p.vp}
              method="getSnipableAssets"
              parms={{ filters: s.snipers }}
              objectToUI={assetUIO}
            />
          ),
          // Licenses: autoTable(s.licenses),
          Menu: tabl(V(menuItems).map((f) => [f])),
        }}
      />
    )
  }
}

setInterval(async () => L({ status: await api('getStatus', {}) }), 2500)

class Yard extends Comp<{}, { status: object }> {
  timer: NodeJS.Timeout
  constructor(p, s) {
    super(p, { status: {} })
  }
  update = async () => {
    // this.setState(({status: await api('getStatus', {}), }));
  } // licenses: await W(G(licenses, l => checkLicense(l, accountAddress)))
  //componentDidMount() { this.timer = setInterval(() => this.update(), 15000); this.update(); }
  //componentWillUnmount() { clearInterval(this.timer); }
  r = (p, s) =>
    tabl([
      [
        tabl([
          [
            button('Stop server', () => api('crash', {}), 'buttonO'),
            autoTable([s.status]),
          ],
        ]),
      ],
      [<App />],
    ])
}

ReactDOM.render(
  <React.StrictMode>
    {styleWrap({ width: '100vw', height: '100vh' }, <Yard />)}
  </React.StrictMode>,
  document.getElementById('root'),
)
// reportWebVitals(); // If you want to start measuring performance in your app, pass a function to log results (for example: reportWebVitals(console.log)) or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals,

//--------------------------
// OPENSEA-FEATURES CODE
//--------------------------

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider
      resetCSS
      theme={extendTheme({
        config: {
          initialColorMode: 'dark',
          useSystemColorMode: false,
        },
      })}
    >
      <ColorModeScript initialColorMode="dark" />
      <UserProvider
        allowNullUser
        loadFromBackgroundScript
        mockUser={
          process.env.NODE_ENV === 'development'
            ? { role: 'SUBSCRIBER' }
            : undefined
        }
      >
        <Popup />
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
