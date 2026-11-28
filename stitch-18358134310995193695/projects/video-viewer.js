
window.initializeVideoProject = (scope = document) => {
 const playlist=window.PORTFOLIO_VIDEOS||[];
 const current=playlist.findIndex(v=>v.folder===(scope.dataset?.videoId || document.body.dataset.videoId));
 const item=playlist[current],video=scope.querySelector('#project-video');
 if(!item||!video)return;
 const prev=playlist[(current-1+playlist.length)%playlist.length],next=playlist[(current+1)%playlist.length];
 for(const [id,target] of [['video-previous',prev],['video-next',next]]){
  const a=scope.querySelector('#'+id);a.href='../'+target.folder+'/index.html';a.setAttribute('aria-label',(id==='video-previous'?'上一个视频：':'下一个视频：')+target.title);a.title=a.getAttribute('aria-label');if(scope.onVideoNavigate)a.addEventListener('click',event=>{event.preventDefault();scope.onVideoNavigate(target.folder);});
 }
 scope.querySelector('#video-counter').textContent=(current+1)+' / '+playlist.length;
 let source=0,disposed=false;
 const status=scope.querySelector('#playback-status');
 const play=async()=>{try{await video.play();status.textContent=video.muted?'正在静音播放 · 点击开启声音':'正在播放 · 声音已开启';}catch(error){if(disposed)return;if(error.name==='NotAllowedError'&&!video.muted){video.muted=true;try{await video.play();status.textContent='浏览器限制了有声自动播放，点击“开启声音”即可。';}catch{status.textContent='浏览器暂停了自动播放，可点击播放器继续观看。';}}else{status.textContent='正在连接在线视频…';}}};
 video.muted=false;video.src=item.sources[source];play();
 video.addEventListener('error',()=>{if(disposed)return;
  if(++source<item.sources.length){video.src=item.sources[source];play();}
  else status.textContent='暂时无法连接视频源，请使用下方快手链接观看。';
 });
 scope.querySelector('#enable-sound').addEventListener('click',()=>{video.muted=!video.muted;video.play().catch(()=>{});});
 video.addEventListener('volumechange',()=>{scope.querySelector('#enable-sound').textContent=video.muted?'开启声音':'静音';});
 const assets=[...scope.querySelectorAll('.asset')];
 const dialog=scope.querySelector('#asset-viewer'),picture=dialog.querySelector('img'),caption=dialog.querySelector('figcaption'),counter=dialog.querySelector('.asset-counter');
 let active=0,trigger;
 const show=index=>{
  active=(index+assets.length)%assets.length;
  const asset=assets[active];picture.src=asset.querySelector('img').src;picture.alt=asset.querySelector('img').alt;
  caption.textContent=asset.querySelector('h3').textContent;counter.textContent=(active+1)+' / '+assets.length;
 };
 assets.forEach((asset,index)=>asset.querySelector('a').addEventListener('click',event=>{
  event.preventDefault();trigger=event.currentTarget;show(index);dialog.showModal();document.body.classList.add('viewer-open');
 }));
 const close=()=>dialog.close();
 dialog.addEventListener('close',()=>{document.body.classList.remove('viewer-open');trigger?.focus({preventScroll:true});});
 dialog.querySelector('.asset-close').addEventListener('click',close);
 dialog.querySelector('.asset-previous').addEventListener('click',()=>show(active-1));
 dialog.querySelector('.asset-next').addEventListener('click',()=>show(active+1));
 dialog.addEventListener('click',event=>{if(event.target===dialog)close();});
 let touchX;
 picture.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX},{passive:true});
 picture.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>50)show(active+(delta<0?1:-1));},{passive:true});
 const keyHandler=event=>{
  if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
  if(dialog.open){event.preventDefault();show(active+(event.key==='ArrowRight'?1:-1));}
  else if(!event.target.closest('video,input,textarea,select,button,a')){
   event.preventDefault();scope.querySelector(event.key==='ArrowRight'?'#video-next':'#video-previous').click();
  }
 };
 document.addEventListener('keydown',keyHandler);
 return ()=>{disposed=true;video.pause();video.removeAttribute('src');video.load();document.removeEventListener('keydown',keyHandler);};
};
if(document.querySelector('#project-video'))window.initializeVideoProject();
