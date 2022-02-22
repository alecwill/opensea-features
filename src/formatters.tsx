/* eslint-disable jsx-a11y/alt-text */
import React from 'react'
import { utils, ethers } from 'ethers'
import { A, D, F, T, U } from './utils'

let safeBN = (from) => {
  try {
    return D(from) ? ethers.BigNumber.from(from) : U
  } catch (e) {
    return U
  }
}
let ellips = (e, w) => (
  <div
    style={{
      display: 'block',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      width: `${w}em`,
    }}
  >
    {e}
  </div>
)

let formatDelta = (t) => {
  t = Math.round(t)
  let k = Math.abs(t),
    p = [60, 60, 24, 7, Infinity],
    j = 0,
    m = 'smhdw',
    z = []
  while (k > 0) {
    let y = p[j]
    z.push((k % y) + m[j++])
    k = (k - (k % y)) / y
  }
  return ((x) => (t >= 0 ? `in ${x}` : `${x} ago`))(
    z
      .slice(Math.max(0, z.length - 2))
      .reverse()
      .join(' '),
  )
}
let link = (caption, url) => <a href={url}>{caption}</a>
let formatters = {
  collection: (c) => link(c, `https://opensea.io/collection/${c}`),
  link: (url) => link('Link', url),
  ethereumAddress: (a) =>
    link(`#${a.slice(2, 8)}`, `https://etherscan.io/address/${a}, 8)}`),
  msTimeDelta: (t) => formatDelta((t - Date.now()) / 1000),
  //  timeDelta: t => formatDelta(((new Date(t)).getTime() - Date.now())/1000),
  token_id: (x) => x,
  traits: (x) => 'filter',
  image_thumbnail_url: (src) => <img src={src} style={{ height: '4em' }} />,
  current_price: (x) =>
    !D(x) || x === null
      ? U
      : ((y) => (D(y) ? utils.formatEther(y) + 'Ξ' : U))(
          safeBN(x.split('.')[0]),
        ),
}
A(
  formatters,
  F(
    T(
      'contract_address asset_contract_address exchange payment_token',
    ).map((x) => [x, formatters.ethereumAddress]),
  ),
)
A(
  formatters,
  F(
    T('created_date closing_date lastUpdate launchTime').map((x) => [
      x,
      formatters.msTimeDelta,
    ]),
  ),
)
A(
  formatters,
  F(
    T('expiration_time listing_time').map((x) => [
      x,
      (z) => formatters.msTimeDelta(1000 * z),
    ]),
  ),
)

export { formatters, ellips }
