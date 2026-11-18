(function(){
  document.documentElement.classList.add('js');
  var els=document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in')});return;}
  var io=new IntersectionObserver(function(entries){
    entries.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});
  },{rootMargin:'0px 0px -8% 0px',threshold:.08});
  els.forEach(function(e,i){
    // small stagger for items in the same grid
    var sib=e.parentElement?Array.prototype.indexOf.call(e.parentElement.children,e):0;
    e.style.transitionDelay=Math.min(sib,5)*80+'ms';
    io.observe(e);
  });
})();

/* Mobile menu */
(function(){
  var header=document.querySelector('header.nav'),btn=header&&header.querySelector('.nav-toggle');
  if(!btn)return;
  function set(open){header.classList.toggle('menu-open',open);btn.setAttribute('aria-expanded',open?'true':'false');}
  btn.addEventListener('click',function(){set(btn.getAttribute('aria-expanded')!=='true');});
  header.querySelectorAll('.nav-links a').forEach(function(a){a.addEventListener('click',function(){set(false);});});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&header.classList.contains('menu-open')){set(false);btn.focus();}});
  document.addEventListener('click',function(e){if(header.classList.contains('menu-open')&&!header.contains(e.target))set(false);});
  window.addEventListener('resize',function(){if(getComputedStyle(btn).display==='none')set(false);},{passive:true});
})();
