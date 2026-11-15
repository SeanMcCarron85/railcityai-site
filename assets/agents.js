/* Rail City AI: /agents/ simulators. Everything here is scripted. No AI model, phone line or network call is involved. */
(function(){
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function el(tag,cls,text){var n=document.createElement(tag);if(cls)n.className=cls;if(text!=null)n.textContent=text;return n;}
  function bottom(n){n.scrollTop=n.scrollHeight;}
  function has(text,words){return words.some(function(w){return text.indexOf(w)!==-1;});}

  /* ----- Mode tabs: website chat / phone call ----- */
  (function(){
    var list=document.querySelector('[data-sim-tabs]');if(!list)return;
    var tabs=Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
    function select(tab,focus){
      tabs.forEach(function(t){
        var on=t===tab,pane=document.getElementById(t.getAttribute('aria-controls'));
        t.setAttribute('aria-selected',on?'true':'false');t.tabIndex=on?0:-1;
        if(pane)pane.hidden=!on;
      });
      if(focus)tab.focus();
    }
    tabs.forEach(function(t,i){
      t.addEventListener('click',function(){select(t,false);});
      t.addEventListener('keydown',function(e){
        var n=null;
        if(e.key==='ArrowRight')n=tabs[(i+1)%tabs.length];
        else if(e.key==='ArrowLeft')n=tabs[(i-1+tabs.length)%tabs.length];
        if(n){e.preventDefault();select(n,true);}
      });
    });
    select(tabs[0],false);
  })();

  /* ----- Chat agent simulator ----- */
  (function(){
    var root=document.getElementById('chat-sim');if(!root)return;
    var thread=root.querySelector('.thread'),trace=root.querySelector('.trace'),picks=root.querySelector('.picks'),form=root.querySelector('form'),input=form.querySelector('input');
    var busy=false;
    var INTENTS=[
      {id:'emergency',words:['leak','burst','flood','emergency','urgent','no water','overflow'],
        say:'That sounds urgent. If you can reach it safely, shut off the main water valve. I am paging the on-call tech now. What is the best number to reach you?',
        log:[['wn','intent: emergency (confidence 0.96)'],['wn','urgency: high, skip the booking flow'],['go','action: page on-call tech (simulated)'],['ok','safety step sent to customer']]},
      {id:'book',words:['book','appointment','schedule','come out','visit','available'],
        say:'Happy to. I have two openings this week. Which works better?',
        choices:['Tomorrow, 9:00 AM','Thursday, 1:30 PM'],
        log:[['ok','intent: book appointment (confidence 0.93)'],['go','action: check shop calendar (simulated)'],['ok','2 open slots found']]},
      {id:'price',words:['price','cost','how much','quote','charge','rate'],
        say:'A standard service call is $89, which covers the first 30 minutes. For anything larger, send a photo and the shop will quote it in writing before any work starts.',
        log:[['ok','intent: pricing (confidence 0.91)'],['go','lookup: price sheet, row "service call"'],['ok','answered from approved price sheet']]},
      {id:'hours',words:['hour','open','close','today','weekend','saturday','sunday'],
        say:'The shop is open Monday to Friday, 7 AM to 6 PM. The emergency line is answered around the clock.',
        log:[['ok','intent: hours (confidence 0.97)'],['go','lookup: business profile'],['ok','answered from business profile']]},
      {id:'area',words:['area','town','where','serve','come to','owosso','durand','perry','vernon','corunna'],
        say:'We serve Corunna, Owosso, Durand, Perry and Vernon, with no trip charge inside that area.',
        log:[['ok','intent: service area (confidence 0.9)'],['go','lookup: business profile'],['ok','answered from business profile']]},
      {id:'human',words:['human','person','someone','real','owner','manager','call me'],
        say:'Of course. I am passing this conversation to a person at the shop, and they will reply by text during business hours.',
        log:[['ok','intent: talk to a person'],['wn','action: hand off to staff with the full transcript (simulated)']]}
    ];
    var UNKNOWN={say:'I am not sure about that one, and I would rather not guess. I am passing your question to a person at the shop, who will reply by text. Is there anything else I can help with?',
      log:[['wn','intent: unknown (confidence 0.38)'],['wn','below the 0.70 threshold, no answer invented'],['wn','action: hand off to staff with the full transcript (simulated)']]};
    var STARTERS=['My basement pipe is leaking','Can I book an appointment?','How much is a service call?','What are your hours?','Do you fix furnaces?'];

    function msg(cls,who,text){var li=el('li',cls);li.appendChild(el('span','who',who));li.appendChild(document.createTextNode(text));thread.appendChild(li);bottom(thread);return li;}
    function log(rows){rows.forEach(function(r){trace.appendChild(el('li',r[0],'> '+r[1]));});bottom(trace);}
    function setPicks(labels,handler){
      picks.textContent='';
      labels.forEach(function(label){var b=el('button','pick',label);b.type='button';b.addEventListener('click',function(){handler(label);});picks.appendChild(b);});
    }
    function starters(){setPicks(STARTERS,ask);}
    function reply(fn){busy=true;if(reduce){fn();busy=false;return;}setTimeout(function(){fn();busy=false;},650);}
    function ask(text){
      text=(text||'').trim();if(!text||busy)return;
      msg('u','Customer',text);
      var t=text.toLowerCase(),hit=null;
      INTENTS.some(function(it){if(has(t,it.words)){hit=it;return true;}return false;});
      var r=hit||UNKNOWN;
      reply(function(){
        log(r.log);msg('a','Agent',r.say);
        if(r.choices){setPicks(r.choices,function(slot){
          if(busy)return;
          msg('u','Customer',slot);
          reply(function(){
            log([['go','action: create booking, '+slot+' (simulated)'],['ok','confirmation text queued']]);
            msg('a','Agent','Booked for '+slot+'. You will get a text reminder the day before. Anything else?');
            starters();
          });
        });}else starters();
      });
    }
    form.addEventListener('submit',function(e){e.preventDefault();ask(input.value);input.value='';});
    msg('a','Agent','Hi, this is the assistant for Corunna Creek Plumbing. I can answer questions, book a visit, or get a person for you. How can I help?');
    log([['ok','agent ready'],['','knowledge: business profile, price sheet, shop calendar']]);
    starters();
  })();

  /* ----- Phone call simulator ----- */
  (function(){
    var root=document.getElementById('call-sim');if(!root)return;
    var thread=root.querySelector('.thread'),trace=root.querySelector('.trace'),picks=root.querySelector('.picks'),outcome=root.querySelector('.outcome');
    var timer=null;
    var CALLS=[
      {label:'After-hours emergency',lines:[
        ['sys','Saturday, 11:42 PM. The shop is closed. The agent answers on the second ring.'],
        ['a','Thanks for calling Corunna Creek Plumbing. This is the after-hours assistant. What is going on?',['ok','call answered in 4 seconds']],
        ['u','My water heater is leaking all over the basement floor.'],
        ['a','I am sorry, that is stressful. First, is the water near any outlets or the breaker panel?',['wn','intent: emergency (confidence 0.97)'],['wn','safety check first']],
        ['u','No, it is just pooling by the drain.'],
        ['a','Good. Turn the cold water valve on top of the heater clockwise to stop the flow. I am sending this to the on-call tech right now. Can I confirm the address on file, 214 Maple Street?',['go','action: page on-call tech (simulated)'],['go','lookup: caller ID matched a customer record']],
        ['u','Yes, that is right.'],
        ['a','The tech will call you back within 15 minutes. I have texted you the shutoff steps as well.',['ok','summary and address sent to tech'],['ok','text sent to caller']]
      ],out:['ok','Outcome:',' emergency captured at 11:42 PM, tech paged with the address and a summary. No voicemail, no lost job.']},
      {label:'Book an appointment',lines:[
        ['sys','Tuesday, 2:10 PM. The crew is on a job site and the office line is busy.'],
        ['a','Thanks for calling Corunna Creek Plumbing. How can I help?',['ok','call answered in 3 seconds']],
        ['u','I need someone to look at a slow kitchen drain. It is not an emergency.'],
        ['a','No problem. I have Thursday at 1:30 PM or Friday at 9:00 AM. Which is better?',['ok','intent: book appointment (confidence 0.94)'],['go','action: check shop calendar (simulated)']],
        ['u','Thursday works.'],
        ['a','You are booked for Thursday at 1:30 PM. A standard service call is $89 for the first 30 minutes. You will get a text reminder the day before.',['go','action: create booking (simulated)'],['ok','price quoted from approved price sheet'],['ok','confirmation text queued']]
      ],out:['ok','Outcome:',' appointment booked while the crew kept working. The job is on the calendar with notes.']},
      {label:'A question it cannot answer',lines:[
        ['sys','Monday, 10:05 AM.'],
        ['a','Thanks for calling Corunna Creek Plumbing. How can I help?',['ok','call answered in 3 seconds']],
        ['u','Will my home warranty cover a sewer line replacement?'],
        ['a','I do not have your warranty details, and I do not want to give you a wrong answer. Let me have the office manager call you back today. Is this the best number?',['wn','intent: warranty coverage (confidence 0.41)'],['wn','below the 0.70 threshold, no answer invented']],
        ['u','Yes, this number is fine.'],
        ['a','Done. You will hear back before 5 PM today.',['wn','action: hand off to staff with the transcript (simulated)'],['ok','callback task created']]
      ],out:['wn','Outcome:',' the agent did not guess. A person gets the question with the full transcript and a callback deadline.']}
    ];
    function line(row){
      var li;
      if(row[0]==='sys')li=el('li','sys',row[1]);
      else{li=el('li',row[0]);li.appendChild(el('span','who',row[0]==='a'?'Agent':'Caller'));li.appendChild(document.createTextNode(row[1]));}
      thread.appendChild(li);bottom(thread);
      for(var k=2;k<row.length;k++)trace.appendChild(el('li',row[k][0],'> '+row[k][1]));
      bottom(trace);
    }
    function finish(call){
      outcome.textContent='';outcome.className='outcome'+(call.out[0]==='wn'?' wn':'');
      outcome.appendChild(el('b',null,call.out[1]));outcome.appendChild(document.createTextNode(call.out[2]));
    }
    function play(call,btn){
      clearInterval(timer);thread.textContent='';trace.textContent='';outcome.className='outcome';outcome.textContent='Playing the simulated call...';
      Array.prototype.forEach.call(picks.children,function(b){b.setAttribute('aria-pressed',b===btn?'true':'false');});
      var i=0;
      if(reduce){call.lines.forEach(line);finish(call);return;}
      line(call.lines[i++]);
      timer=setInterval(function(){
        if(i>=call.lines.length){clearInterval(timer);finish(call);return;}
        line(call.lines[i++]);
      },1500);
    }
    CALLS.forEach(function(call){
      var b=el('button','pick',call.label);b.type='button';b.setAttribute('aria-pressed','false');
      b.addEventListener('click',function(){play(call,b);});picks.appendChild(b);
    });
    outcome.textContent='Pick a call above to play it.';
  })();

  /* ----- Knowledge assistant simulator ----- */
  (function(){
    var root=document.getElementById('vault-sim');if(!root)return;
    var thread=root.querySelector('.thread'),picks=root.querySelector('.picks'),form=root.querySelector('form'),input=form.querySelector('input');
    var busy=false;
    var QA=[
      {q:'How often do we change the mill coolant?',words:['coolant','fluid','concentration','refractometer'],
        a:'Change the coolant every 6 months or 1,000 run hours, whichever comes first. Check the concentration weekly. It should read 7% to 9% on the refractometer.',
        src:'Sources: Coolant and Fluids Spec Sheet, page 2. CNC Mill Maintenance Manual, section 4.2, page 17.'},
      {q:'What is the lockout procedure before clearing a jam?',words:['lockout','lock out','jam','tagout','clear'],
        a:'Before reaching into the enclosure:',steps:['Press the emergency stop and wait for the spindle to stop fully.','Switch the main disconnect to OFF and attach your personal lock and tag.','Try the cycle start button to confirm the machine is dead.','Only then open the door and clear the jam.'],
        src:'Source: Shop Safety Handbook, section 3.1, page 9.'},
      {q:'What torque do the vise bolts need?',words:['torque','vise','bolt','tighten'],
        a:'Torque the vise hold-down bolts to 80 ft-lb in a cross pattern, then recheck after the first hour of cutting.',
        src:'Source: CNC Mill Maintenance Manual, section 6.4, page 31.'},
      {q:'What is the warranty on the new lathe?',words:['warranty','lathe','guarantee'],none:true,
        a:'That is not in the documents I have been given, so I will not guess. I searched all three documents and found no warranty terms for a lathe. Ask the office manager, or add the purchase paperwork to the vault and ask again.',
        src:'Sources: none found.'}
    ];
    var MISS={none:true,a:'I could not find that in the three documents in this vault, so I will not guess. Try one of the suggested questions, or ask about coolant, lockout steps or vise torque.',src:'Sources: none found.'};
    function show(text,item){
      if(busy)return;
      var u=el('li','u');u.appendChild(el('span','who','Technician'));u.appendChild(document.createTextNode(text));thread.appendChild(u);bottom(thread);
      busy=true;
      setTimeout(function(){
        var li=el('li','a'+(item.none?' none':''));li.appendChild(el('span','who','Assistant'));li.appendChild(document.createTextNode(item.a));
        if(item.steps){var ol=el('ol');item.steps.forEach(function(s){ol.appendChild(el('li',null,s));});li.appendChild(ol);}
        li.appendChild(el('span','src',item.src));
        thread.appendChild(li);bottom(thread);busy=false;
      },reduce?0:600);
    }
    QA.forEach(function(item){
      var b=el('button','pick',item.q);b.type='button';b.addEventListener('click',function(){show(item.q,item);});picks.appendChild(b);
    });
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var text=input.value.trim();if(!text)return;input.value='';
      var t=text.toLowerCase(),hit=null;
      QA.some(function(item){if(has(t,item.words)){hit=item;return true;}return false;});
      show(text,hit||MISS);
    });
    var hi=el('li','a');hi.appendChild(el('span','who','Assistant'));hi.appendChild(document.createTextNode('Ask me anything in the three shop documents listed here. I answer only from those pages and I show where each answer came from.'));thread.appendChild(hi);
  })();
})();
