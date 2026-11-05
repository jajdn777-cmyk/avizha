// background music: primed on the first tap, fades in when the opening video ends
var Music=(function(){
  var a=document.getElementById('bgm'),b=document.getElementById('snd');
  if(!a||!b)return{prime:function(){},begin:function(){}};
  var MAX=.55,fadeT=null,muteT=null,live=false,userMuted=false;
  function ui(){
    var on=!a.paused&&!a.muted;
    b.classList.toggle('off',!on);
    b.setAttribute('aria-pressed',on?'false':'true');
    b.setAttribute('aria-label',on?'قطع موسیقی':'پخش موسیقی');
  }
  function fade(to,ms){
    clearInterval(fadeT);
    var from=a.volume,t0=Date.now();
    fadeT=setInterval(function(){
      var k=Math.min(1,(Date.now()-t0)/ms);
      try{a.volume=from+(to-from)*k;}catch(e){}
      if(k>=1)clearInterval(fadeT);
    },50);
  }
  function play(){var p=a.play();if(p&&p.catch)p.catch(function(){ui();});}
  // called inside the first tap so the browser lets audio run later
  function prime(){a.muted=true;try{a.volume=0;}catch(e){}play();}
  function begin(){
    if(live)return;live=true;
    try{a.currentTime=0;}catch(e){}
    a.muted=false;try{a.volume=0;}catch(e){}
    play();fade(MAX,2500);ui();
  }
  function toggle(){
    if(!live)return;
    clearTimeout(muteT);
    var on=!a.paused&&!a.muted;
    if(on){
      userMuted=true;fade(0,350);
      muteT=setTimeout(function(){a.muted=true;ui();},380);
    }else{
      userMuted=false;a.muted=false;try{a.volume=0;}catch(e){}
      play();fade(MAX,1200);
    }
    ui();
  }
  b.addEventListener('click',toggle);
  ['play','pause','volumechange'].forEach(function(ev){a.addEventListener(ev,ui);});
  document.addEventListener('visibilitychange',function(){
    if(!live)return;
    if(document.hidden)a.pause();
    else if(!userMuted)play();
  });
  ui();
  return{prime:prime,begin:begin};
})();

(function(){
  var st=document.getElementById('stage'),intro=document.getElementById('intro'),v=document.getElementById('v'),
      flash=document.getElementById('flash'),card=document.getElementById('card'),dust=document.getElementById('dust'),
      started=false,opened=false;
  // floating light motes
  for(var i=0;i<14;i++){var m=document.createElement('i');m.style.left=(Math.random()*96)+'%';
    m.style.animationDuration=(9+Math.random()*9)+'s';m.style.animationDelay=(-Math.random()*14)+'s';
    m.style.transform='scale('+(.6+Math.random()*1.4)+')';dust.appendChild(m);}
  var pc=document.getElementById('pc');
  function fit(){
    var W=pc.clientWidth;if(!W)return;
    [].forEach.call(pc.querySelectorAll('[data-fit]'),function(el){
      var tgt=parseFloat(el.dataset.fit)*W/1240,box=el.parentNode;
      box.style.fontSize='100px';var w=el.offsetWidth||1;
      box.style.fontSize=(100*tgt/w/W*100)+'cqw';});
  }
  fit();window.addEventListener('resize',fit);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);
  var io=null,items=[].slice.call(card.querySelectorAll('.rv,.gal'));
  function reveal(){
    st.classList.add('open');
    if('IntersectionObserver' in window){
      io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{root:card,threshold:.2});
      items.forEach(function(el){io.observe(el)});
    }else items.forEach(function(el){el.classList.add('in')});
  }
  function open(){
    if(opened)return;opened=true;
    flash.classList.add('on');
    Music.begin();
    setTimeout(function(){intro.classList.add('done');},500);
    setTimeout(function(){intro.style.display='none';},1700);
    setTimeout(reveal,900);
  }
  function start(){
    if(started)return;started=true;intro.classList.add('go');
    Music.prime();
    var p;try{p=v.play();}catch(e){}
    if(p&&p.catch)p.catch(function(){setTimeout(open,300)});
    v.addEventListener('timeupdate',function(){if(v.duration&&v.currentTime>=v.duration-.55)open();});
    v.addEventListener('ended',open);
    v.addEventListener('error',open);
    setTimeout(open,7000);
  }
  intro.addEventListener('click',start);
  intro.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' ')start();});
  intro.tabIndex=0;
})();

// countdown to the event: Monday 18 Aqrab 1405 = 9 Nov 2026, 1:00 PM Kabul time (UTC+4:30)
(function(){
  var start=new Date('2026-11-09T13:00:00+04:30').getTime(),end=new Date('2026-11-09T16:00:00+04:30').getTime();
  var cd=document.getElementById('cd'),note=document.getElementById('cdn');if(!cd||!note)return;
  var els={};[].forEach.call(cd.querySelectorAll('b'),function(b){els[b.dataset.k]=b;});
  var fa='۰۱۲۳۴۵۶۷۸۹';
  function p(n,len){var s=String(n);while(s.length<len)s='0'+s;return s.replace(/\d/g,function(d){return fa[d];});}
  function set(k,v){var s=p(v,2);if(els[k].textContent!==s){els[k].textContent=s;els[k].classList.remove('tick');void els[k].offsetWidth;els[k].classList.add('tick');}}
  function tick(){
    var now=Date.now(),d=start-now;
    if(d<=0){cd.classList.add('off');note.classList.add('big');
      note.textContent=now<end?'محفل هم‌اکنون در حال برگزاری است':'از حضور شما سپاسگزاریم';return;}
    var s=Math.floor(d/1000);
    set('d',Math.floor(s/86400));set('h',Math.floor(s%86400/3600));set('m',Math.floor(s%3600/60));set('s',s%60);
  }
  tick();setInterval(tick,1000);
})();

// RSVP
(function(){
  // Paste your form endpoint here (e.g. 'https://formspree.io/f/xxxxxxxx').
  // While it is empty, the RSVP opens WhatsApp with a ready-made message instead.
  var ENDPOINT='';
  var WHATSAPP='93703203897';
  var KEY='avizha-rsvp',MAX=5,fa='۰۱۲۳۴۵۶۷۸۹';

  var box=document.getElementById('rsvpBox'),f=document.getElementById('rsvp');if(!box||!f)return;
  var $=function(id){return document.getElementById(id)};
  var nameEl=$('rn'),phoneEl=$('rp'),noteEl=$('rm'),msg=$('rmsg'),btn=$('rsub'),gs=$('gs'),gn=$('gn'),
      title=$('rdt'),sub=$('rds'),again=$('ragain'),steps=f.querySelectorAll('[data-step]'),n=1;

  function faN(x){return String(x).replace(/\d/g,function(d){return fa[d]})}
  function enN(s){return s.replace(/[۰-۹]/g,function(d){return fa.indexOf(d)}).replace(/[٠-٩]/g,function(d){return d.charCodeAt(0)-1632})}
  function yes(){return f.elements.att.value==='yes'}
  function say(t){msg.textContent=t||''}

  function setGuests(v){
    n=Math.max(1,Math.min(MAX,v));
    gn.textContent=faN(n);f.elements.guests.value=n;
    steps[0].disabled=n<=1;steps[1].disabled=n>=MAX;
  }
  [].forEach.call(steps,function(b){b.addEventListener('click',function(){setGuests(n+parseInt(b.dataset.step,10))})});
  [].forEach.call(f.elements.att,function(r){r.addEventListener('change',function(){gs.classList.toggle('hide',!yes())})});
  [nameEl,phoneEl].forEach(function(el){el.addEventListener('input',function(){el.classList.remove('bad');say('')})});
  setGuests(1);

  function show(attending){
    title.textContent=attending?'حضور شما ثبت شد':'پاسخ شما ثبت شد';
    sub.textContent=attending?'منتظر دیدارتان در آویژه هستیم.':'از لطف شما سپاسگزاریم؛ جای شما خالی خواهد بود.';
    box.classList.add('sent');
  }
  function finish(attending){
    try{localStorage.setItem(KEY,JSON.stringify({yes:attending}))}catch(e){}
    show(attending);
  }
  function busy(on){btn.disabled=on;btn.textContent=on?'در حال ارسال…':'ارسال تأیید حضور'}

  f.addEventListener('submit',function(e){
    e.preventDefault();say('');
    var name=nameEl.value.trim(),
        phone=enN(phoneEl.value).replace(/[\s\-().]/g,''),
        note=noteEl.value.trim(),att=yes();
    if(f.elements.website.value){finish(att);return;} // honeypot: silently ignore bots
    if(name.length<2){nameEl.classList.add('bad');say('لطفاً نام خود را وارد کنید.');nameEl.focus();return;}
    if(!/^\+?\d{9,14}$/.test(phone)){phoneEl.classList.add('bad');say('لطفاً شماره تماس معتبر وارد کنید.');phoneEl.focus();return;}
    var data={name:name,phone:phone,attending:att?'yes':'no',guests:att?n:0,note:note,event:'Avizha opening 18 Aqrab 1405'};

    if(ENDPOINT){
      busy(true);
      fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
        .then(function(r){if(!r.ok)throw new Error('bad');finish(att);})
        .catch(function(){say('ارسال ناموفق بود؛ لطفاً دوباره تلاش کنید.');})
        .then(function(){busy(false);});
    }else{
      var t='سلام، تأیید حضور برای محفل افتتاحیه آویژه\n'+
            'نام: '+name+'\nشماره تماس: '+phone+'\n'+
            (att?'حضور: بله، '+faN(n)+' نفر':'حضور: متأسفانه نمی‌توانم')+
            (note?'\nپیام: '+note:'');
      window.open('https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(t),'_blank','noopener');
      finish(att);
    }
  });

  again.addEventListener('click',function(){
    try{localStorage.removeItem(KEY)}catch(e){}
    box.classList.remove('sent');
  });

  try{var s=JSON.parse(localStorage.getItem(KEY));if(s)show(!!s.yes);}catch(e){}
})();
