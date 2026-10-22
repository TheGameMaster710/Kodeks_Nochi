

var PCSTATE_CACHE={};
var pcstateUnsub=null;

function pcOwnerOf(x){return x&&x.owner?String(x.owner).toLowerCase():null;}
function isLivePc(x){return !!x && !!fbDb && (x._liveKind==='pcs' || (PCS.indexOf(x)>-1 && !!pcOwnerOf(x)));}
function canEditLivePc(x){
  if(!SESSION) return false;
  if(x._liveKind==='pcs') return pcOwnerOf(x)===SESSION.username;
  if(SESSION.role==='admin'||SESSION.role==='master') return true;
  return pcOwnerOf(x)===SESSION.username;
}

function stopPcSync(){ if(pcstateUnsub){pcstateUnsub();pcstateUnsub=null;} }

function startPcSyncIfLive(x){
  stopPcSync();
  if(!isLivePc(x)) return;
  var key=trkKey(x),id=x.id;
  pcstateUnsub=fbDb.collection('pcstate').doc(id).onSnapshot(function(doc){
    PCSTATE_CACHE[key]=doc.exists?doc.data():trkDefault(x);
    refreshTrackers(key);
  },function(){
  });
}

function pcSyncWrite(x,st){
  if(!isLivePc(x)||!canEditLivePc(x)) return;
  var data={};for(var k in st) data[k]=st[k];
  data.updatedAt=firebase.firestore.FieldValue.serverTimestamp();
  data.updatedBy=SESSION.username;
  var col=x._liveKind==='pcs'?'pcs':'pcstate';
  fbDb.collection(col).doc(x.id).set(data,{merge:true}).catch(function(){
  });
}
