/* Rail City AI: cinematic hero. Pre-rendered film frames (WebP) scrubbed on a canvas by scroll.
   Everything is a pure function of scroll progress, so scrubbing backward works.
   If anything fails before setup completes, html.cine-on is never added and the static hero stays. */
(function(){
  'use strict';
  var root=document.documentElement;
  var mq=function(q){return window.matchMedia&&window.matchMedia(q).matches;};
  if(mq('(prefers-reduced-motion: reduce)'))return;
  var hero=document.querySelector('.hero.cine');if(!hero)return;
  var stage=hero.querySelector('.cine-stage'),cv=hero.querySelector('.cine-canvas');
  var ctx=cv&&cv.getContext&&cv.getContext('2d');
  if(!stage||!ctx||!window.requestAnimationFrame)return;

  var small=mq('(max-width: 700px)')||mq('(orientation: portrait) and (max-width: 1024px)');
  var SET=small?{dir:'m',n:90}:{dir:'d',n:120};
  var base=(hero.getAttribute('data-frames')||'assets/hero-cine/')+SET.dir+'/f';
  function src(i){var s=String(i+1);while(s.length<3)s='0'+s;return base+s+'.webp';}

  // timeline (fractions of scroll through the pinned section)
  var T={filmEnd:.86,flashIn:.70,flashPeak:.775,flashOut:.84,logoIn:.765,logoFull:.865,endIn:.88,endFull:.965,cueOut:.06,done:.97};

  var frames=new Array(SET.n),loaded=0,drawn=-1,target=0,cur=0,W=0,H=0,running=false;

  function clamp(v){return v<0?0:v>1?1:v;}
  function ramp(p,a,b){return clamp((p-a)/(b-a));}
  function ease(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}

  function size(){
    var dpr=Math.min(window.devicePixelRatio||1,2);
    var w=Math.round(stage.clientWidth*dpr),h=Math.round(stage.clientHeight*dpr);
    if(w!==W||h!==H){W=cv.width=w;H=cv.height=h;drawn=-1;}
  }
  function nearest(i){
    if(frames[i]&&frames[i].ok)return i;
    for(var d=1;d<SET.n;d++){
      if(i-d>=0&&frames[i-d]&&frames[i-d].ok)return i-d;
      if(i+d<SET.n&&frames[i+d]&&frames[i+d].ok)return i+d;
    }
    return -1;
  }
  function draw(i){
    var k=nearest(i);if(k<0||k===drawn)return;
    var im=frames[k].img,iw=im.naturalWidth,ih=im.naturalHeight;
    var s=Math.max(W/iw,H/ih),dw=iw*s,dh=ih*s;
    ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
    ctx.drawImage(im,(W-dw)/2,(H-dh)/2,dw,dh);
    drawn=k;
  }
  function progress(){
    var r=hero.getBoundingClientRect(),span=hero.offsetHeight-stage.offsetHeight;
    return span>0?clamp(-r.top/span):0;
  }
  function apply(p){
    var fi=Math.round(clamp(p/T.filmEnd)*(SET.n-1));
    draw(fi);
    var fl=p<T.flashPeak?ramp(p,T.flashIn,T.flashPeak):1-ramp(p,T.flashPeak,T.flashOut);
    var lg=ease(ramp(p,T.logoIn,T.logoFull)),en=ease(ramp(p,T.endIn,T.endFull));
    var st=hero.style;
    st.setProperty('--flash',(fl*.55).toFixed(3));
    st.setProperty('--logo',lg.toFixed(3));
    st.setProperty('--end',en.toFixed(3));
    st.setProperty('--cue',(1-ramp(p,0,T.cueOut)).toFixed(3));
    hero.classList.toggle('cine-end-hidden',en<.02);
    hero.classList.toggle('cine-done',p>=T.done);
  }
  function tick(){
    var d=target-cur;
    cur=Math.abs(d)<.0004?target:cur+d*.2;
    apply(cur);
    if(cur!==target)requestAnimationFrame(tick);else running=false;
  }
  function onScroll(){
    target=progress();
    if(!running){running=true;requestAnimationFrame(tick);}
  }

  function load(i,cb){
    if(frames[i])return cb&&cb();
    var im=new Image(),f={img:im,ok:false};frames[i]=f;
    im.decoding='async';
    im.onload=function(){f.ok=true;loaded++;hero.style.setProperty('--loaded',(loaded/SET.n).toFixed(3));
      var want=Math.round(clamp(cur/T.filmEnd)*(SET.n-1));
      if(drawn<0||Math.abs(i-want)<Math.abs(drawn-want)){drawn=-1;apply(cur);}
      cb&&cb();};
    im.onerror=function(){cb&&cb();};
    im.src=src(i);
  }
  // coarse-to-fine order so the whole scrub is usable early, then fills in
  function order(){
    var o=[],seen={},strides=[24,12,6,3,1];
    strides.forEach(function(s){for(var i=0;i<SET.n;i+=s)if(!seen[i]){seen[i]=1;o.push(i);}});
    if(!seen[SET.n-1])o.splice(1,0,SET.n-1);
    return o;
  }
  function loadRest(){
    var q=order(),active=0,MAX=4;
    function next(){while(active<MAX&&q.length){var i=q.shift();if(frames[i])continue;active++;load(i,function(){active--;next();});}}
    next();
  }

  // Skip intro: jump to the resolved logo + buttons (end of the pinned hero)
  var skip=hero.querySelector('.cine-skip');
  if(skip)skip.addEventListener('click',function(e){
    e.preventDefault();
    var top=hero.getBoundingClientRect().top+window.pageYOffset+hero.offsetHeight-stage.offsetHeight;
    window.scrollTo({top:top,behavior:'instant'});
    var b=hero.querySelector('.hero-end .btn');if(b)setTimeout(function(){b.focus({preventScroll:true});},60);
  });

  try{
    root.classList.add('cine-on');
    size();
    // poster first, then everything else
    load(0,function(){
      onScroll();
      var go=function(){loadRest();};
      if(document.readyState==='complete')setTimeout(go,50);else window.addEventListener('load',go,{once:true});
    });
    window.addEventListener('scroll',onScroll,{passive:true});
    window.addEventListener('resize',function(){size();onScroll();},{passive:true});
    cur=target=progress();apply(cur);
    window.__cine={set:SET,loaded:function(){return loaded;},progress:function(){return cur;},settled:function(){return cur===target;}};
  }catch(err){
    root.classList.remove('cine-on');
    if(window.console)console.warn('hero-cinematic disabled:',err);
  }
})();
