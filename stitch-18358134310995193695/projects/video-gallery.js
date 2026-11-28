
(() => {
 const content=window.PORTFOLIO_VIDEO_DETAILS;
 if(!content||!window.initializeVideoProject)return;
 const viewer=document.createElement('dialog');viewer.className='video-collection-viewer';viewer.setAttribute('aria-label','视频作品与制作资产');
 viewer.innerHTML='<button type="button" class="video-collection-close" aria-label="关闭视频作品">× 关闭</button><div class="video-collection-content"></div>';
 document.body.append(viewer);const panel=viewer.querySelector('.video-collection-content');let dispose,trigger;
 const open=folder=>{
  if(!content[folder])return;
  dispose?.();panel.innerHTML=content[folder];panel.dataset.videoId=folder;panel.onVideoNavigate=open;
  const back=panel.querySelector('main > a');back.textContent='← 返回作品集';back.addEventListener('click',e=>{e.preventDefault();viewer.close();});
  if(!viewer.open)viewer.showModal();
  document.body.classList.add('video-collection-open');viewer.scrollTop=0;
  dispose=window.initializeVideoProject(panel);
 };
 document.querySelectorAll('[data-work^="video "] > a').forEach(link=>{
  link.addEventListener('click',event=>{
   if(event.ctrlKey||event.metaKey||event.shiftKey||event.altKey)return;
   const match=link.getAttribute('href').match(/projects\/(project-\d+)\//);
   if(!match||!content[match[1]])return;
   event.preventDefault();trigger=link;open(match[1]);
  });
 });
 viewer.querySelector('.video-collection-close').addEventListener('click',()=>viewer.close());
 viewer.addEventListener('close',()=>{dispose?.();dispose=null;panel.innerHTML='';document.body.classList.remove('video-collection-open','viewer-open');trigger?.focus({preventScroll:true});});
})();
