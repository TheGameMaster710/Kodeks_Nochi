// p2_gm.js → gm-layer.json (для загрузки мастером в Firestore, §1.3.4)
const fs=require('fs');
const src=fs.readFileSync('p2_gm.js','utf8');
const GM_LAYER=new Function(src+';return GM_LAYER;')();
fs.writeFileSync('gm-layer.json',JSON.stringify(GM_LAYER,null,1));
console.log('gm-layer.json:',GM_LAYER.notes.length,'заметок,',GM_LAYER.relations.length,'рёбер');
