/* Rail City AI: /video/ page. Maya welcome player, reel script simulator (template based, no AI model), free pilot bar. */
(function(){
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}

  /* ----- Maya welcome player: click to play with sound ----- */
  (function(){
    var frame=document.querySelector('.mp-frame');if(!frame)return;
    var video=frame.querySelector('video'),btn=frame.querySelector('.mp-play');
    if(!video||!btn)return;
    btn.addEventListener('click',function(){
      frame.classList.add('playing');video.controls=true;
      if(video.textTracks&&video.textTracks[0])video.textTracks[0].mode='showing';
      var p=video.play();if(p&&p.catch)p.catch(function(){frame.classList.remove('playing');});
    });
    video.addEventListener('ended',function(){frame.classList.remove('playing');video.controls=false;btn.querySelector('b').textContent='Play it again';});
  })();

  /* ----- Reel script simulator ----- */
  (function(){
    var root=document.getElementById('reel-sim');if(!root)return;
    var picks=root.querySelector('.picks'),out=root.querySelector('.rs-out'),name=root.querySelector('input');
    var TYPES=[
      {id:'coffee',label:'Coffee shop',fallback:'your coffee shop',
        shots:[['Steam rising off a fresh pour in morning light.','Still running on gas-station coffee?','Your morning deserves better than a gas-station cup.'],
               ['Quick cuts: the pastry case, a latte handed over the counter, a regular waving.','Roasted fresh. Ready in two minutes.','At {name}, it is roasted fresh and ready before your light turns green.'],
               ['The storefront with the open sign, phone number on screen.','Order ahead: tap to call','Order ahead at {name} and skip the line tomorrow.']]},
      {id:'auto',label:'Auto repair',fallback:'your shop',
        shots:[['Close-up of a glowing check-engine light on a dashboard.','That light is not going away.','That light on your dash is not going to turn itself off.'],
               ['A tech plugging in a scanner, then pointing at the screen for a customer.','Straight answers. Written quotes.','At {name}, we read the code, show you what it means, and quote it in writing.'],
               ['The bay doors opening, phone number on screen.','Same-week appointments','Call {name} today and drive easy this week.']]},
      {id:'salon',label:'Salon or barber',fallback:'your salon',
        shots:[['A client frowning at a grown-out cut in a phone camera.','Overdue for a refresh?','If your hair has been "fine" for three months, it is time.'],
               ['Chair spin reveal, stylist and client laughing.','Booked in under a minute','At {name}, you pick the service, pick the time, and you are booked.'],
               ['The front desk and the booking screen.','Tap to book this week','Book your spot at {name} before the weekend fills up.']]},
      {id:'trades',label:'Contractor or trades',fallback:'your crew',
        shots:[['Water dripping from a ceiling stain into a bucket.','Small leak. Big bill later.','That small leak is getting more expensive every day you wait.'],
               ['A truck pulling up, a tech in boot covers shaking hands at the door.','On time. Clean work. Upfront price.','{name} shows up on time, protects your floors, and gives you the price before the work.'],
               ['The truck with the logo, phone number on screen.','Call for a free estimate','Call {name} for a free estimate this week.']]},
      {id:'food',label:'Restaurant',fallback:'your kitchen',
        shots:[['A sizzling pan, slow motion.','Dinner plans? Solved.','Stop scrolling. Dinner is handled.'],
               ['Plates landing on a table, friends reaching in.','Made fresh, every night','At {name}, it is made fresh tonight, not reheated from yesterday.'],
               ['The dining room at golden hour, hours and phone on screen.','Reserve or order ahead','Grab a table at {name}, or order ahead and pick it up hot.']]},
      {id:'dental',label:'Dental or clinic',fallback:'your office',
        shots:[['A person wincing at a cold drink.','Putting off that appointment?','If you have been putting off that appointment, this is your sign.'],
               ['A bright, calm front desk, a hygienist smiling.','New patients welcome','At {name}, new patients are seen quickly and treated like neighbors.'],
               ['The office exterior, phone number on screen.','Call to schedule','Call {name} to schedule your visit.']]},
      {id:'retail',label:'Retail shop',fallback:'your shop',
        shots:[['Hands unwrapping a gift and the reaction.','The gift they did not expect','Want to be the person who gives the good gift this year?'],
               ['A slow pan across shelves, an owner wrapping a box.','Picked by people who know you','At {name}, we help you find the one thing a big-box store will not have.'],
               ['The storefront window, hours on screen.','Open this weekend','Stop by {name} this weekend and see what is new.']]},
      {id:'other',label:'Something else',fallback:'your business',
        shots:[['The everyday problem your customer has, shown in one clear shot.','Sound familiar?','If this looks familiar, keep watching.'],
               ['Your team solving it: faces, hands, the finished result.','Here is how we fix it','At {name}, this is exactly what we do, every day.'],
               ['Your storefront, truck or logo with a phone number on screen.','Call or tap to book','Call {name} today and get it handled.']]}
    ];
    var TIMES=[['Shot 1: the hook','0:00 to 0:03'],['Shot 2: the reason','0:03 to 0:12'],['Shot 3: the ask','0:12 to 0:20']];
    var current=TYPES[0];
    function fill(s,n){return s.replace('{name}',n);}
    function render(){
      var n=(name.value||'').trim().slice(0,40)||current.fallback;
      out.textContent='';
      current.shots.forEach(function(s,i){
        var card=el('div','shot'),tc=el('div','tc');
        tc.appendChild(el('span',null,TIMES[i][0]));tc.appendChild(el('span',null,TIMES[i][1]));card.appendChild(tc);
        var dl=el('dl');
        [['Picture',s[0],''],['On screen',s[1],'os'],['Maya says',fill(s[2],n),'']].forEach(function(r){dl.appendChild(el('dt',null,r[0]));dl.appendChild(el('dd',r[2],r[1]));});
        card.appendChild(dl);out.appendChild(card);
      });
      out.appendChild(el('p','rs-meta','> 20 seconds, vertical 9:16, AI label on screen in the first 3 seconds'));
    }
    TYPES.forEach(function(t,i){
      var b=el('button','pick',t.label);b.type='button';b.setAttribute('aria-pressed',i===0?'true':'false');
      b.addEventListener('click',function(){
        current=t;
        Array.prototype.forEach.call(picks.children,function(c){c.setAttribute('aria-pressed',c===b?'true':'false');});
        render();
      });
      picks.appendChild(b);
    });
    name.addEventListener('input',render);
    render();
  })();

  /* ----- Free pilot bar: shows after the hero, hides near the pilot card and the form ----- */
  (function(){
    var bar=document.querySelector('.pilot-bar');if(!bar||!('IntersectionObserver' in window))return;
    var hero=document.querySelector('.v-hero'),closed=false,pastHero=false,near=0;
    try{closed=sessionStorage.getItem('rcai-pilot-bar')==='closed';}catch(e){}
    if(closed)return;
    function update(){
      var on=!closed&&pastHero&&near===0;
      bar.classList.toggle('show',on);bar.setAttribute('aria-hidden',on?'false':'true');
      document.body.classList.toggle('has-pilot-bar',on);
      Array.prototype.forEach.call(bar.querySelectorAll('a,button'),function(n){n.tabIndex=on?0:-1;});
    }
    new IntersectionObserver(function(es){pastHero=!es[0].isIntersecting;update();}).observe(hero);
    var vis={};
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){vis[e.target.id]=e.isIntersecting;});
      near=(vis.pilot?1:0)+(vis.contact?1:0);update();
    });
    ['pilot','contact'].forEach(function(id){var n=document.getElementById(id);if(n)io.observe(n);});
    bar.querySelector('.x').addEventListener('click',function(){closed=true;try{sessionStorage.setItem('rcai-pilot-bar','closed');}catch(e){}update();});
    update();
  })();
})();
