let A = Object.assign;
let D = x => typeof x !== "undefined";
let F = Object.fromEntries;
let G = (o, f, h = I) => F(E(o).map(([k, v]) => [h(k), f(v, k)]))
let K = Object.keys;
let L = m => { console.log(m); return m; }
let E = o => Object.entries(oO(o));
let I = x => x;
let U = undefined;
let S = JSON.stringify;
let P = (o, ks) => F(ks.map(k => [k, o[k]]));
let T = (x) => x.split(" ");
let V = Object.values;
let W = async o => F(await Promise.all(E(o).map(async ([k, v]) => [k, await v])))
 
let oA = a => a || [];
let oO = o => o || {};
let oF = f => f || I;

let isA = a => Array.isArray(a);
let isS = x => typeof x === "string";
let isO = x => typeof x === "object";

let camelSnake = o => G(o, I, k => k.split("_").map((s, i) => (i === 0) ? s : (s.charAt(0).toUpperCase() + s.slice(1))).join(""))

export {A,D,F,G,K,L,E,S,T,P,I,U,V,W,oA,oO,oF,isA,isS,isO,camelSnake}