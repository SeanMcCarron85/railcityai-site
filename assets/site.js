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

/* Contact form: sends through Formspree, then shows the thank-you page */
(function(){
  var form=document.querySelector('.contact-form');if(!form)return;
  var status=form.querySelector('.cf-status'),submit=form.querySelector('button[type="submit"]');
  var EMAIL='railcityai@gmail.com';
  function say(msg,err){status.textContent=msg;status.classList.toggle('err',!!err);}
  function check(){
    var bad=null;
    form.querySelectorAll('[required]').forEach(function(f){
      var ok=f.value.trim()!==''&&(f.type!=='email'||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim()));
      f.setAttribute('aria-invalid',ok?'false':'true');
      if(!ok&&!bad)bad=f;
    });
    return bad;
  }
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var bad=check();
    if(bad){say(bad.type==='email'&&bad.value.trim()?'Please enter a valid email address.':'Please fill in your name, email and a short message.',true);bad.focus();return;}
    submit.disabled=true;say('Sending...');
    fetch(form.action,{method:'POST',body:new FormData(form),headers:{'Accept':'application/json'}})
      .then(function(r){
        if(r.ok){window.location.href=form.getAttribute('data-thanks')||'thank-you/';return;}
        return r.json().catch(function(){return {};}).then(function(d){
          // Formspree explains rejected fields in d.errors: [{field, message}]
          var errs=(d&&d.errors)||[],first=null;
          errs.forEach(function(er){var f=er.field&&form.querySelector('[name="'+er.field+'"]');if(f){f.setAttribute('aria-invalid','true');if(!first)first=f;}});
          submit.disabled=false;
          if(errs.length){say(errs.map(function(er){return er.message;}).join(' ')+' You can also email us at '+EMAIL+'.',true);if(first)first.focus();}
          else throw new Error('send failed');
        });
      })
      .catch(function(){
        submit.disabled=false;
        say('Sorry, your message didn\u2019t send. Please try again, or email us at '+EMAIL+'.',true);
      });
  });
  form.addEventListener('input',function(e){if(e.target.getAttribute('aria-invalid')==='true')e.target.setAttribute('aria-invalid','false');});
})();
