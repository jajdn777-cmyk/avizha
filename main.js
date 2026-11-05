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
    setTimeout(function(){intro.classList.add('done');},500);
    setTimeout(function(){intro.style.display='none';},1700);
    setTimeout(reveal,900);
  }
  function start(){
    if(started)return;started=true;intro.classList.add('go');
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

// countdown to the event: Saturday 16 Aqrab 1405 = 7 Nov 2026, 1:00 PM Kabul time (UTC+4:30)
(function(){
  var start=new Date('2026-11-07T13:00:00+04:30').getTime(),end=new Date('2026-11-07T16:00:00+04:30').getTime();
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
