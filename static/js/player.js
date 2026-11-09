(function(){
  var a=new Audio(),S=null,ytp=null,tick=null,apiQ=null,revT=null,raf=0,saveT=0;a.preload="none";
  var RATES=[1,1.25,1.5,2],rate=+ls("nc:rate")||1;
  var dock=document.getElementById("dock"),box=document.createElement("div");box.id="yt";document.body.appendChild(box);
  function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){return null}}
  function saved(src){return +ls("nc:"+src)||0}
  function save(src,t){if(!src)return;var k=t>5;ls("nc:"+src,k?String(Math.floor(t)):null);ls("nc:at:"+src,k?String(Date.now()):null)}
  function q(p,s){return p.querySelector(s)}
  function fmt(s){s=Math.floor(s||0);var h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;return(h?h+":"+(m<10?"0":""):"")+m+":"+(x<10?"0":"")+x}
  function dur(p){var r=p.closest(".r"),i=r&&q(r,"i");return i?i.textContent.trim().split(":").reduce(function(s,x){return s*60+(+x||0)},0):0}
  function playing(){return !!S&&(S.yt?!!(ytp&&ytp.getPlayerState&&ytp.getPlayerState()===1):!a.paused)}
  function now(){if(!S)return[0,0];
    if(S.yt)return ytp&&ytp.getDuration&&ytp.getDuration()?[ytp.getCurrentTime(),ytp.getDuration()]:[S.t0,S.d0];
    return a.readyState?[a.currentTime,a.duration]:[S.t0,S.d0]}
  function render(){var on=playing(),c=now();
    document.querySelectorAll(".pl").forEach(function(p){var me=!!S&&p.dataset.src===S.src,t=me?c[0]:saved(p.dataset.src),d=me?c[1]:dur(p);
      p.classList.toggle("on",me&&on);q(p,".pp").setAttribute("aria-label",me&&on?"Duraklat":"Oynat");
      q(p,".fill").style.width=(d?Math.min(100,t/d*100):0)+"%";q(p,".t").textContent=fmt(t);q(p,".sp").textContent=rate+"x";
      var r=p.closest(".r,#dock"),tx=r&&q(r,".tx");if(tx){var cc=q(tx,".cc"),ct=me&&chap(S.ch,t);
        if(ct){if(!cc){cc=document.createElement("span");cc.className="cc";tx.appendChild(cc)}if(cc.textContent!==ct)cc.textContent=ct}else if(cc)cc.remove()}});
    if(on&&Date.now()-saveT>4000){saveT=Date.now();save(S.src,c[0])}
    var pe=document.querySelector("#page .ep .pl"),cs=pe&&document.querySelector("#page .chs");
    if(cs){var me=!!S&&S.src===pe.dataset.src,t=me?c[0]:saved(pe.dataset.src);
      cs.querySelectorAll(".cb a").forEach(function(x){var s0=+x.dataset.t,e0=+x.dataset.e||s0+1;q(x,"span").style.width=Math.max(0,Math.min(100,(t-s0)/(e0-s0)*100))+"%"});
      cs.querySelectorAll(".ch li").forEach(function(x){x.classList.toggle("on",(me||t>0)&&t>=+x.dataset.t&&t<(+x.dataset.e||1e9))})}}
  function chs(p){try{return JSON.parse(p.dataset.ch||"null")}catch(e){return null}}
  function chap(c,t){if(!c||!c.length)return"";var n="";c.forEach(function(x){if(t>=x.t)n=x.n});return n}
  function thumb(){if(!S)return null;var p=[].find.call(document.querySelectorAll("#page .pl"),function(p){return p.dataset.src===S.src}),r=p&&p.closest(".r");return r&&q(r,".th")}
  function clip(){var th=thumb();if(!th||!S.clip)return null;var v=q(th,"video");if(!v){v=document.createElement("video");v.muted=true;v.loop=true;v.playsInline=true;v.src=S.clip;th.appendChild(v)}return v}
  function place(){raf=0;
    if(!S){dock.classList.remove("show");document.body.classList.remove("docked");box.style.display="none";return}
    var th=thumb(),r=th&&th.getBoundingClientRect(),inview=!!r&&r.width>0&&r.bottom>0&&r.top<innerHeight;
    dock.classList.toggle("show",!inview);document.body.classList.toggle("docked",!inview);
    if(!S.yt){box.style.display="none";return}
    box.style.display="block";var st=box.style;
    if(inview){st.position="absolute";st.left=r.left+scrollX+"px";st.top=r.top+scrollY+"px";st.width=r.width+"px";st.height=r.height+"px"}
    else{var s=q(dock,".slot").getBoundingClientRect();st.position="fixed";st.left=s.left+"px";st.top=s.top+"px";st.width=s.width+"px";st.height=s.height+"px"}}
  function later(){if(!raf)raf=requestAnimationFrame(place)}
  function api(cb){if(window.YT&&YT.Player)return cb();if(!apiQ){apiQ=[];window.onYouTubeIframeAPIReady=function(){apiQ.forEach(function(f){f()})};var s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";document.head.appendChild(s)}apiQ.push(cb)}
  function stop(){if(S&&playing())save(S.src,now()[0]);clearInterval(tick);clearTimeout(revT);if(ytp){ytp.destroy();ytp=null}box.innerHTML="";box.classList.remove("vis");if(S&&!S.yt){a.pause();var v=clip();if(v)v.pause()}S=null}
  function startYT(my){var h=document.createElement("div");box.appendChild(h);
    api(function(){if(S!==my)return;ytp=new YT.Player(h,{videoId:my.yt,width:640,height:480,playerVars:{autoplay:1,playsinline:1,rel:0,controls:0,disablekb:1,fs:0,iv_load_policy:3,start:Math.floor(my.t0)},
      events:{onReady:function(e){if(e.target!==ytp)return;e.target.setPlaybackRate(rate);setTimeout(function(){if(e.target!==ytp)return;var s=e.target.getPlayerState();if(s!==1&&s!==3)e.target.playVideo()},1500)},
        onStateChange:function(e){if(e.target!==ytp)return;clearTimeout(revT);
          if(e.data===1)revT=setTimeout(function(){box.classList.add("vis");my.rv=1},my.rv?1000:3000);else box.classList.remove("vis");
          if(e.data===2)save(my.src,ytp.getCurrentTime());if(e.data===0)save(my.src,0);render()}}});
      tick=setInterval(render,500)})}
  function start(p){stop();var r=p.closest(".r"),tx=r&&q(r,".tx"),img=r&&q(r,".th img"),cs=getComputedStyle(p),d=dur(p),t=saved(p.dataset.src);
    if(d&&t>d-30)t=0;
    S={src:p.dataset.src,yt:p.dataset.yt,clip:p.dataset.clip,t0:t,d0:d,ch:chs(p)};
    dock.style.setProperty("--bg",cs.getPropertyValue("--bg"));dock.style.setProperty("--ink",cs.getPropertyValue("--ink"));
    var sl=q(dock,".slot");sl.innerHTML="";if(img){var i=new Image();i.src=img.src;i.alt="";sl.appendChild(i)}
    var dt=q(dock,".tx");dt.href=tx?tx.href:"/";dt.innerHTML=tx?tx.innerHTML:"";q(dock,".pl").dataset.src=S.src;
    var db=q(dock,".bar");db.querySelectorAll("i").forEach(function(x){x.remove()});q(p,".bar").querySelectorAll("i").forEach(function(x){db.appendChild(x.cloneNode())});
    if(S.yt)startYT(S);else{var my=S;a.src=S.src;a.defaultPlaybackRate=a.playbackRate=rate;if(t)a.addEventListener("loadedmetadata",function(){if(S===my)a.currentTime=t},{once:true});a.play()}
    place();render()}
  function toggle(){if(!S)return;if(S.yt){if(ytp&&ytp.getPlayerState)ytp.getPlayerState()===1?ytp.pauseVideo():ytp.playVideo()}else a.paused?a.play():a.pause()}
  function seek(t){if(!S)return;t=Math.max(0,t);if(S.yt){if(ytp&&ytp.seekTo){ytp.seekTo(t,true);ytp.playVideo()}}else{a.currentTime=t;if(a.paused)a.play()}render()}
  function nav(url,push){fetch(url).then(function(r){return r.text()}).then(function(h){var d=new DOMParser().parseFromString(h,"text/html"),np=d.getElementById("page");if(!np){location.href=url;return}
    document.getElementById("page").replaceWith(np);document.title=d.title;if(push){history.pushState({pj:1},"",url);scrollTo(0,0)}place();render()}).catch(function(){location.href=url})}
  function norm(s){return s.toLocaleLowerCase("tr").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/ı/g,"i")}
  history.replaceState({pj:1},"",location.href);
  addEventListener("popstate",function(e){if(e.state&&e.state.pj)nav(location.href,false)});
  addEventListener("scroll",later,{passive:true});addEventListener("resize",later);
  addEventListener("pagehide",function(){if(S&&playing())save(S.src,now()[0])});
  a.addEventListener("timeupdate",render);
  a.addEventListener("pause",function(){if(S&&!S.yt)save(S.src,a.currentTime);render();var v=S&&clip();if(v)v.pause()});
  a.addEventListener("ended",function(){if(S)save(S.src,0)});
  a.addEventListener("play",function(){render();var v=S&&clip();if(v)v.play()});
  var tq=parseInt(new URLSearchParams(location.search).get("t"),10),ep=document.querySelector("#page .ep .pl");
  if(tq>0&&ep)save(ep.dataset.src,tq);
  render();
  document.addEventListener("input",function(e){if(e.target.id!=="q")return;var v=norm(e.target.value.trim()),n=0;
    document.querySelectorAll("#page .band").forEach(function(b){var any=false;b.querySelectorAll(".r").forEach(function(r){var m=!v||norm(r.textContent).indexOf(v)>=0;r.hidden=!m;if(m){any=true;n++}});b.querySelectorAll(".np").forEach(function(x){x.hidden=!!v});b.hidden=!any});
    var no=document.getElementById("none");if(no)no.hidden=n>0;later()});
  document.addEventListener("keydown",function(e){var t=e.target;
    if(e.metaKey||e.ctrlKey||e.altKey||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName)||t.isContentEditable)return;
    if(e.code==="Space"){if(S)toggle();else{var p=document.querySelector("#page .ep .pl");if(!p)return;start(p)}e.preventDefault()}
    else if(S&&(e.key==="ArrowRight"||e.key==="ArrowLeft")){seek(now()[0]+(e.key==="ArrowRight"?15:-15));e.preventDefault()}});
  document.addEventListener("click",function(e){
    if(e.target.closest("#dock .x")){stop();place();render();return}
    var ch=e.target.closest("a[data-t]");
    if(ch){e.preventDefault();var pe=document.querySelector("#page .ep .pl"),ct=+ch.dataset.t||0;if(!pe)return;
      if(S&&S.src===pe.dataset.src)seek(ct);else{save(pe.dataset.src,ct);start(pe)}return}
    var sh=e.target.closest(".share");
    if(sh){e.preventDefault();var p0=document.querySelector("#page .ep .pl"),t=p0?(S&&S.src===p0.dataset.src?now()[0]:saved(p0.dataset.src)):0,u=location.origin+location.pathname+(t>=1?"?t="+Math.floor(t):""),old=sh.textContent;
      var done=function(){sh.textContent="Link kopyalandı";setTimeout(function(){sh.textContent=old},2000)};
      if(navigator.clipboard)navigator.clipboard.writeText(u).then(done,function(){prompt("Link:",u)});else prompt("Link:",u);return}
    var sp=e.target.closest(".pl .sp");
    if(sp){rate=RATES[(RATES.indexOf(rate)+1)%RATES.length];ls("nc:rate",String(rate));if(S){if(S.yt){if(ytp&&ytp.setPlaybackRate)ytp.setPlaybackRate(rate)}else a.playbackRate=rate}render();return}
    var p=e.target.closest(".pl");
    if(p){var bar=e.target.closest(".bar");
      if(!S||p.dataset.src!==S.src){if(!p.closest("#dock"))start(p);return}
      if(bar){var br=bar.getBoundingClientRect(),d=now()[1];if(d)seek((e.clientX-br.left)/br.width*d)}
      else if(e.target.closest(".pp"))toggle();
      return}
    var l=e.target.closest("a");
    if(!S||!l||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||l.target||l.hasAttribute("download"))return;
    var u2=new URL(l.href,location.href);if(u2.origin!==location.origin||(u2.pathname===location.pathname&&u2.hash))return;
    e.preventDefault();nav(u2.href,true)});
})();
