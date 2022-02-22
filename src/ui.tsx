/* eslint-disable @typescript-eslint/no-unused-vars */
//import { isContractAddress } from 'opensea-js/lib/utils/utils';
import React from 'react'
import { A, D, E, I, K, L, S, T, P, U, V, oA, oO, oF, isS, isO } from './utils'

let colors = { purple: '#6d55fe', cyan: '#55fef6', yellow: '#dcdc8f' }

let button = (caption, onClick, className = U) => (
  <button {...{ onClick, className }}>{caption}</button>
)
let checkBox = (
  caption: string,
  checked: boolean,
  onChange: (checked: Boolean) => void,
) => <Toggle caption={caption} checked={checked} onChange={onChange} />
let elWithAttrs = (el, __attrs) => ({ el, __attrs })
let ell = (o) => (o?.el ? o?.el : o),
  att = (o) => (o?.att ? o?.att : {})
let tabl = (rows, style = {}) => (
  <table
    style={A({ width: '100%', height: '100%', overflow: 'scroll' }, style)}
  >
    <tbody>
      {rows.map((row, i) => (
        <tr key={i}>
          {row.map((c, j) => (
            <td key={j} {...att(c)}>
              {ell(c)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
)
let box = (e, onClick = U) => (
  <div
    className={'box'}
    onClick={onClick}
    style={{
      backgroundColor: `hsla(240, 25%, 10%, 0.1)`,
      border: '1px solid hsla(240, 33%, 90%, 0.3333)',
      borderRadius: `0.25em`,
    }}
  >
    {e}
  </div>
)
//style={{backgroundColor: `hsla(240, 80%, 25%, 0.25)`, border: '1px solid #6d55fe', borderRadius: `0.25em`}}>{e}</div>;

let unflat = (a, c) =>
  a.map((x, i) => (i % c === 0 ? a.slice(i, i + c) : U)).filter(D)

class C<P = {}, S = {}> extends React.Component<P, S> {
  constructor(p, s) {
    super(p)
    this.state = oO(s)
  }
  r(p, s): JSX.Element {
    return box('#')
  }
  wrap(p, s, c) {
    return I(c)
  }
  render() {
    let [p, s] = [this.props, this.state || {}]
    return this.wrap(p, s, this.r(p, s))
  }
}

let styleWrap = (style, e) => <div style={style}>{e}</div>
class Choice extends C<{
  options: any[]
  ix: number
  onChange: (i: number, v: any) => void
  className: string
  vertical: boolean
}> {
  public static defaultProps = { ix: 0, className: 'choice', vertical: false }
  sty = (w) => ({ fontWeight: w ? 'bold' : 'normal' })
  r = (p, s) =>
    tabl(
      ((a) => (p.vertical ? a.map((x) => [x]) : [a]))(
        p.options.map((h, j) => (
          <div
            className={[p.className, j === p.ix ? p.className + '_active' : U]
              .filter(D)
              .join(' ')}
            //style={this.sty(j === p.ix)}
            onClick={() => p.onChange(j, p.options[j])}
          >
            {h}
          </div>
        )),
      ),
      { tableLayout: 'fixed', overflow: 'scroll' },
    )
}
/*
class SortOrder extends C<{keys: any[]; order: number[]; onChange: (order: number[]) => void}> { 
  public static defaultProps = {order: [], onChange: I};
  sty = w => ({borderColor: V(colors)[w ? 1 : 0], fontWeight: w ? "bold" : "normal"});
  r = (p, s) => tabl([p.order.map(x => p.keys[x]).concat(p.keys.filter((k, i) => )) p.keys.map((h, j) => <div className={p.className} style={this.sty(j === p.ix)} onClick={() => p.onChange(j)}>{h}</div>)]) 
}
*/

class CompWithViewPort<P = {}, S = {}> extends C<{ vp: ViewPort } & P, S> {
  constructor(p, s) {
    super(p, A({ filter: {} }, s))
  }
  public static defaultProps = { vp: U }
  //  wrap = (p, s) => <div style={L({width: `${p.vp.x}em`, height: `${p.vp.y}em`, overflowX: "scroll", overflowY: "scroll"})}>{this.r(p,s)}</div>
}

let iconizeHeader = (h) =>
  tabl([
    [
      <div style={{ height: '2em', width: '100%' }} className={`h_${h}`}></div>,
      h,
    ],
  ])
let tabHeaderHeight = 3.5
class TabControl extends CompWithViewPort<
  { name: string; tabs: Object; headers: Object },
  { vix: number }
> {
  public static defaultProps = { vp: {}, name: U, headers: U }
  constructor(p, s) {
    super(p, A({ vix: 0 }, s))
  }
  //  r = (p, s) => tabl([[<div style={{height: tabHeaderHeight + 'em'}}><Choice className={"tab"} ix={s.vix} options={D(p.headers) ? E(p.headers) : K(p.tabs).map(iconizeHeader)} onChange={vix => this.setState({vix})}/></div>],
  //    [V(p.tabs).find((X, ix) => (ix === s.vix))]]);
  r = (p, s) =>
    tabl([
      [
        elWithAttrs(
          <Choice
            className={'tab'}
            ix={s.vix}
            options={D(p.headers) ? E(p.headers) : K(p.tabs).map(iconizeHeader)}
            onChange={(vix) => this.setState({ vix })}
          />,
          { style: { height: `${tabHeaderHeight}em` } },
        ),
      ],
      [V(p.tabs).find((X, ix) => ix === s.vix)],
    ])
}

class Input extends C<{
  value: string
  placeholder: string
  onChange: (v: string) => void
}> {
  r = (p, s) => (
    <input
      type="text"
      value={p.value}
      placeholder={p.placeholder}
      onChange={(e) => p.onChange(e.target.value)}
    />
  )
}
class InputList extends C<{
  value: string
  placeholder: string
  onChange: (v: string) => void
}> {
  r = (p, s) => (
    <input
      type="text"
      value={p.value}
      placeholder={p.placeholder}
      onChange={(e) => p.onChange(e.target.value)}
    />
  )
}
class InputRange extends C<{
  min: number
  value: number
  max: number
  placeholder: string
  onChange: (v: string) => void
}> {
  r = (p, s) => (
    <input
      type="range"
      {...P(p, T('min value max placeholder'))}
      onChange={(e) => p.onChange(e.target.value)}
    />
  )
}

class CheckBox extends C<{
  caption: string
  checked: Boolean
  onChange: (checked: Boolean) => void
}> {
  r = (p, s) =>
    tabl([
      [
        <input
          type="checkbox"
          checked={p.checked}
          onChange={(e) => p.onChange(e.target.value)}
        ></input>,
        p.caption,
      ],
    ])
}
let toggleSize = 1
let toggleStyle = (transition, position, width, backgroundColor) => ({
  transition,
  position,
  width,
  backgroundColor,
  borderRadius: `${toggleSize / 2}em`,
  height: `${toggleSize}em`,
})
class Toggle extends C<{
  caption: string
  checked: Boolean
  onChange: (checked: Boolean) => void
}> {
  r = (p, s) =>
    tabl([
      [
        <div
          className={'toggle'}
          style={toggleStyle(
            'background-color 0.05s ease-out',
            'relative',
            `${2 * toggleSize}em`,
            p.checked ? '#6d55fe' : '#2c2044',
          )}
          onClick={() => p.onChange(!p.checked)}
        >
          <div
            className={'toggleKnob'}
            style={A(
              { left: `${p.checked ? toggleSize : 0}em` },
              toggleStyle(
                'left 0.05s ease-out',
                'relative',
                `${toggleSize}em`,
                '#FFF',
              ),
            )}
          ></div>
        </div>,
        p.caption,
      ],
    ])
}
class Slider extends C<{
  caption: string
  checked: Boolean
  onChange: (checked: Boolean) => void
}> {
  r = (p, s) =>
    tabl([
      [
        <div
          className={'toggle'}
          style={toggleStyle(
            'background-color 0.05s ease-out',
            'relative',
            `${2 * toggleSize}em`,
            p.checked ? '#6d55fe' : '#2c2044',
          )}
          onClick={() => p.onChange(!p.checked)}
        >
          <div
            className={'toggleKnob'}
            style={A(
              { left: `${p.checked ? toggleSize : 0}em` },
              toggleStyle(
                'left 0.05s ease-out',
                'relative',
                `${toggleSize}em`,
                '#FFF',
              ),
            )}
          ></div>
        </div>,
        p.caption,
      ],
    ])
}

class ExpandableForm extends C<
  { caption: string; form: JSX.Element },
  { expanded: Boolean }
> {
  r = (p, s) =>
    tabl(
      [
        [button(p.caption, () => this.setState({ expanded: !s.expanded }))],
        s.expanded ? [p.form] : U,
      ].filter(I),
    )
}

class ObjectArray extends C<
  {
    data: Object[]
    keys: string[]
    showHeader: boolean
    formatters: {}
    onSelect: (any) => any
  },
  { selectedIx: number }
> {
  r(p, s) {
    let d = p.data.map((x) =>
      p.keys.map((k: string) =>
        (
          p.formatters[k] ||
          ((m) => (isS(m) ? m : React.isValidElement(m) ? m : S(m)))
        )(x[k]),
      ),
    )
    let ixToStyle = (i) =>
      ((w) => ({
        border: w ? '1px solid #6d55fe' : '0px',
        borderRadius: '0.2em',
        fontWeight: w ? 'bold' : 'normal',
      }))(s.selectedIx === i)
    let h = d.map((x, i) =>
      x.map((y) => (
        <div
          //style={ixToStyle(i)}
          onClick={() =>
            this.setState({ selectedIx: i }, () =>
              oF(p.onSelect)(
                p.data[this.state.selectedIx],
                this.state.selectedIx,
              ),
            )
          }
        >
          {y}
        </div>
      )),
    )
    return tabl(p.showHeader ? [p.keys.map((e) => box(e)), ...h] : h)
  }
}

class ViewPort {
  x: number
  y: number
  constructor(x, y) {
    A(this, { x, y })
  }
  horScale = (f) => new ViewPort(0.95 * f * this.x, this.y)
  verScale = (f) => new ViewPort(this.x, 0.95 * f * this.y)
  horSub = (f) => new ViewPort(this.x - f, this.y)
  verSub = (f) => new ViewPort(this.x, this.y - f)
}

class AutoArray extends C<
  { data: Object[]; keys: string[]; onSelect: (any) => any },
  {}
> {
  public static defaultProps = { keys: U }
  r = (p, s) => (
    <ObjectArray
      {...{
        data: p.data,
        keys: p.keys || K(oO(oA(p.data)[0])),
        showHeader: true,
        formatters: {},
        onSelect: p.onSelect,
      }}
    />
  )
}

class TileSet extends CompWithViewPort<
  {
    items: object[]
    objectToUI: (object) => any
    onSelect: (object) => void
    itemsPerRow: number
  },
  { selIx: number; sortIx: number }
> {
  public static defaultProps = {
    vp: {},
    itemsPerRow: 10,
    onSelect: I,
    objectToUI: I,
  }
  itemsPerRow = () => Math.floor(this.props.vp.x / 5)
  visRows = () =>
    Math.min(
      Math.floor(this.props.vp.y / 7),
      Math.ceil(oA(this.props.items).length / this.itemsPerRow()),
    )
  r = (p, s) =>
    tabl(
      unflat(
        oA(p.items).map((x, i) =>
          ((v) =>
            box(
              p.objectToUI(
                A(
                  {
                    selected: v,
                    vp: p.vp
                      .horScale(1.0 / this.itemsPerRow())
                      .verScale(1.0 / Math.max(1, this.visRows())),
                  },
                  x,
                ),
                v,
              ),
              () => {
                p.onSelect(x)
                this.setState({ selIx: i })
              },
            ))(i === s.selIx),
        ),
        this.itemsPerRow(),
      ).slice(0, this.visRows()),
    )
}

let flavourId = 0
class Flavour extends C<
  { options: string[]; onChange: (v: string) => void },
  {}
> {
  flavourId: string
  constructor(p, s) {
    super(p, s)
    this.flavourId = 'f' + flavourId++
  }
  r = (p, s) => (
    <>
      <input
        list={this.flavourId}
        onChange={(e) => p.onChange(e.target.value)}
      />
      <datalist id={this.flavourId}>
        {oA(p.options).map((x, key) => (
          <option key={key} value={x} />
        ))}
      </datalist>
    </>
  )
}

class Select extends C<
  { options: string[]; onChange: (v: string) => void },
  {}
> {
  r = (p, s) => (
    <select onChange={(e) => p.onChange(e.target.value)}>
      {oA(p.options).map((x, key) => (
        <option key={key} value={x}>
          {x}
        </option>
      ))}
    </select>
  )
  //  <><input list={this.flavourId} onChange={e => p.onChange(e.target.value)}/><datalist id={this.flavourId}>{p.options.map(x => <option value={x}/>)}</datalist></>
}

class ViewStack extends C<{ views: any[] }, {}> {
  r = (p, s) => (p.views.length > 0 ? p.views[p.views.length - 1] : U)
}

export {
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
  Toggle,
  CheckBox,
  C as Comp,
  AutoArray,
  ObjectArray,
  ExpandableForm,
  ViewStack,
}
