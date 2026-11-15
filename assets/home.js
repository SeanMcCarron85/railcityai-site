/* Rail City AI: automation homepage behavior. site.js handles reveal, mobile menu and the form. */

/* Industry explorer: accessible tabs (arrow keys, Home, End) */
(function(){
  var list=document.querySelector('[role="tablist"]');if(!list)return;
  var tabs=Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
  function select(tab,focus){
    tabs.forEach(function(t){
      var on=t===tab,panel=document.getElementById(t.getAttribute('aria-controls'));
      t.setAttribute('aria-selected',on?'true':'false');
      t.tabIndex=on?0:-1;
      if(panel)panel.hidden=!on;
    });
    if(focus){tab.focus();if(tab.scrollIntoView)tab.scrollIntoView({block:'nearest',inline:'nearest'});}
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){select(t,false);});
    t.addEventListener('keydown',function(e){
      var n=null;
      if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];
      else if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
      else if(e.key==='Home')n=tabs[0];
      else if(e.key==='End')n=tabs[tabs.length-1];
      if(n){e.preventDefault();select(n,true);}
    });
  });
  select(tabs[0],false);
})();

/* Hero telemetry: a simulated run, clearly labeled as a demo on the page */
(function(){
  var log=document.querySelector('.log');if(!log)return;
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var LINES=[
    ['ok','invoice_0412.pdf received from inbox'],
    ['ok','extract ok, confidence 0.98'],
    ['ok','posted to ledger, row 1187'],
    ['','receipt_0413.jpg received from portal'],
    ['er','vendor API 503, retry 1 of 3'],
    ['ok','retry ok after 2.1s'],
    ['wn','confidence 0.61 (blurry scan)'],
    ['wn','routed to human review queue'],
    ['ok','approved by staff, posted'],
    ['','bol_7731.pdf received from email'],
    ['wn','flag: quantity short by 2 pallets'],
    ['ok','alert sent to dispatcher']
  ];
  var MAX=6,i=0,clock=9*3600+14*60;
  function stamp(){
    clock+=1+Math.floor(Math.random()*9);
    var h=Math.floor(clock/3600)%24,m=Math.floor(clock/60)%60,s=clock%60;
    function p(n){return (n<10?'0':'')+n;}
    return p(h)+':'+p(m)+':'+p(s);
  }
  function add(){
    var row=LINES[i%LINES.length];i++;
    var li=document.createElement('li'),t=document.createElement('span'),m=document.createElement('span');
    t.className='t';t.textContent=stamp()+'  ';
    if(row[0])m.className=row[0];
    m.textContent=row[1];
    li.appendChild(t);li.appendChild(m);log.appendChild(li);
    while(log.children.length>MAX)log.removeChild(log.firstChild);
  }
  log.textContent='';
  for(var k=0;k<MAX;k++)add();
  if(reduce)return;
  var timer=null;
  function start(){if(!timer)timer=setInterval(add,1700);}
  function stop(){clearInterval(timer);timer=null;}
  var inView=true;
  function sync(){inView&&!document.hidden?start():stop();}
  if('IntersectionObserver' in window){
    new IntersectionObserver(function(en){inView=en[0].isIntersecting;sync();}).observe(log);
  }else start();
  document.addEventListener('visibilitychange',sync);
})();

/* Hero departure board: example workflows shown as station departures. Decorative (aria-hidden). */
(function(){
  var list=document.querySelector('.board-rows');if(!list)return;
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var RUNS=[
    ['INVOICE PDF > LEDGER','ON TIME','ok'],
    ['MISSED CALL > SMS REPLY','ON TIME','ok'],
    ['BLURRY SCAN > HUMAN REVIEW','HELD','wn'],
    ['RFQ PDF > QUOTE SHEET','BOARDING','go'],
    ['BILL OF LADING > MISMATCH CHECK','ON TIME','ok'],
    ['VENDOR API 503 > RETRY 2 OF 3','DELAYED','wn'],
    ['SOP QUESTION > MANUAL VAULT','ON TIME','ok'],
    ['CLIENT UPLOAD > STATUS TRACKER','BOARDING','go'],
    ['AFTER-HOURS CALL > ON-CALL TECH','ON TIME','ok']
  ];
  var now=new Date(),mins=now.getHours()*60+now.getMinutes(),i=0,timer=null,inView=true;
  function hhmm(){var h=Math.floor(mins/60)%24,m=mins%60;return (h<10?'0':'')+h+':'+(m<10?'0':'')+m;}
  function row(flip){
    var r=RUNS[i%RUNS.length];i++;mins+=1+Math.floor(Math.random()*3);
    var li=document.createElement('li');if(flip)li.className='flip';
    [['bt',hhmm()],['br',r[0]],['bs '+r[2],r[1]]].forEach(function(c){var s=document.createElement('span');s.className=c[0];s.textContent=c[1];li.appendChild(s);});
    return li;
  }
  list.textContent='';
  for(var k=0;k<3;k++)list.appendChild(row(false));
  function step(){list.removeChild(list.firstChild);list.appendChild(row(true));}
  function sync(){if(inView&&!document.hidden){if(!timer)timer=setInterval(step,2800);}else{clearInterval(timer);timer=null;}}
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){inView=en[0].isIntersecting;sync();}).observe(list);
  document.addEventListener('visibilitychange',sync);
  sync();
})();
