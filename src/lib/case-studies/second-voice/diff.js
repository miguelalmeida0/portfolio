const tok = s => s.match(/[A-Za-z0-9’']+|[^\sA-Za-z0-9]/g) ?? [];
const isPunct = t => /^[^A-Za-z0-9]+$/.test(t);
function diff(aStr, bStr){
  const a = tok(aStr), b = tok(bStr), n = a.length, m = b.length;
  const dp = Array.from({length:n + 1}, () => new Int16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = a[i] === b[j] ? dp[i+1][j+1] + 1 : Math.max(dp[i+1][j], dp[i][j+1]);
  const ops = []; let i = 0, j = 0;
  while (i < n && j < m){
    if (a[i] === b[j]){ ops.push({t:'=', w:b[j], ai:i, bi:j}); i++; j++; }
    else if (dp[i+1][j] >= dp[i][j+1]){ ops.push({t:'-', w:a[i], ai:i}); i++; }
    else { ops.push({t:'+', w:b[j], bi:j}); j++; }
  }
  while (i < n){ ops.push({t:'-', w:a[i], ai:i}); i++; }
  while (j < m){ ops.push({t:'+', w:b[j], bi:j}); j++; }
  return ops;
}
function stats(ops){
  let kept = 0, words = 0, rep = 0, add = 0, rem = 0, k = 0;
  ops.forEach(o => { if (o.t !== '+' && !isPunct(o.w)) words++; if (o.t === '=' && !isPunct(o.w)) kept++; });
  while (k < ops.length){
    if (ops[k].t === '='){ k++; continue; }
    let d = 0, a = 0;
    while (k < ops.length && ops[k].t !== '='){ if (!isPunct(ops[k].w)){ ops[k].t === '-' ? d++ : a++; } k++; }
    if (d && a) rep++; else if (a) add++; else if (d) rem++;
  }
  return {kept, words, rep, add, rem};
}

function renderOps(ops){return ops.map((o,k)=>({word:o.w,space:k!==0&&!isPunct(o.w),classes:(o.t==='='?'k':o.t==='+'?'i':'d')+(ops[k-1]?.t===o.t&&o.t!=='='?' j':'')+(o.t!=='+'&&o.ai===0?' o0':'')+(o.t!=='-'&&o.bi===0?' r0':''),index:k}));}
export {tok,isPunct,diff,stats,renderOps};
