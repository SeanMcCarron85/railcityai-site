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
