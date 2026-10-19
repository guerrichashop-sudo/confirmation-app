// ZR Express -> Codpilot "تعديل القالب" auto-fill (paste in the browser console while the modal is open)
// Set DRY = false to really write the values. With DRY = true it only prints what it would do.
(() => {
  const DRY = true;
  // key = wilaya name without spaces/punctuation, value = [home DA, stop desk (office) DA or null]
  const P = {
    adrar:[1400,980], chlef:[850,530], laghouat:[950,630], oumelbouaghi:[850,530], batna:[900,530],
    bejaia:[800,530], biskra:[950,630], bechar:[1200,980], blida:[600,480], bouira:[700,530],
    tamanrasset:[1600,1130], tebessa:[900,530], tlemcen:[900,580], tiaret:[850,530], tiziouzou:[750,530],
    alger:[500,380], djelfa:[950,580], jijel:[900,530], setif:[800,530], saida:[900,580],
    skikda:[900,530], sidibelabbes:[900,530], annaba:[850,530], guelma:[900,530], constantine:[800,530],
    medea:[800,530], mostaganem:[900,530], msila:[850,580], mascara:[900,530], ouargla:[950,680],
    oran:[800,530], elbayadh:[1100,680], bordjbouarreridj:[800,530], boumerdes:[700,530], eltarf:[850,530],
    tissemsilt:[900,530], eloued:[950,680], khenchela:[900,530], soukahras:[900,530], tipaza:[700,530],
    mila:[900,530], aindefla:[900,530], naama:[1100,680], aintemouchent:[900,530], ghardaia:[950,630],
    relizane:[900,530], timimoun:[1400,980], ouleddjellal:[950,630], beniabbes:[1200,980],
    insalah:[1600,1130], inguezzam:[1600,null], touggourt:[950,680], elmeghaier:[950,null], elmenia:[1000,680],
  };
  const norm = s => s.toLowerCase().replace(/[^a-z]/g, '');
  const setVal = (el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(el, String(v));
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  };
  const fieldOf = input => { // 'office' | 'home' from the label inside the field wrapper
    for (let n = input.parentElement; n && n !== document.body; n = n.parentElement) {
      const t = n.textContent || '';
      if (t.includes('DZD')) return t.includes('المكتب') ? 'office' : t.includes('المنزل') ? 'home' : null;
    }
    return null;
  };
  const textInputs = root => [...root.querySelectorAll('input')].filter(i => !['checkbox', 'radio', 'hidden'].includes(i.type));
  const done = new Set(), unmatched = [], log = [];
  document.querySelectorAll('*').forEach(el => {
    if (el.children.length) return;
    const m = (el.textContent || '').trim().match(/^([A-Za-z' ]+?)\s*-\s*\S/);
    if (!m) return;
    const key = norm(m[1]), price = P[key];
    let row = el;
    while (row && textInputs(row).length < 2) row = row.parentElement;
    if (!row) return;
    if (!price) { unmatched.push(m[1]); return; }
    if (done.has(key)) return;
    done.add(key);
    textInputs(row).forEach(inp => {
      const f = fieldOf(inp);
      const v = f === 'home' ? price[0] : f === 'office' ? price[1] : undefined;
      if (v == null) { if (f === 'office') log.push(`${m[1]}: no stop desk -> left as is (turn the office toggle off by hand)`); return; }
      log.push(`${m[1]} ${f}: ${inp.value} -> ${v}`);
      if (!DRY) setVal(inp, v);
    });
  });
  console.log(log.join('\n'));
  console.log('matched wilayas:', done.size, '| not in ZR list (untouched):', unmatched.join(', ') || '-');
  console.log(DRY ? 'DRY RUN: nothing changed. Set DRY=false and run again, then click حفظ.' : 'Values written. Check them, then click حفظ.');
})();
