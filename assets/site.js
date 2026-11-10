(function(){
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return [].slice.call((r||document).querySelectorAll(s))};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var y=$('#yr');if(y)y.textContent=new Date().getFullYear();

  // header state
  var header=$('.site-header');
  function onScroll(){header.classList.toggle('scrolled',scrollY>40)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // scroll reveal
  var rv=$$('.rv');
  if('IntersectionObserver' in window&&!reduce){
    var io=new IntersectionObserver(function(es){
      var n=0;
      es.forEach(function(e){if(e.isIntersecting){e.target.style.setProperty('--d',(n++*.07)+'s');e.target.classList.add('in');io.unobserve(e.target)}});
    },{rootMargin:'0px 0px -8% 0px'});
    rv.forEach(function(el){io.observe(el)});
  }else rv.forEach(function(el){el.classList.add('in')});

  // active nav link
  var links=$$('.nav a');
  if('IntersectionObserver' in window){
    var so=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting)links.forEach(function(a){a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id)})});
    },{rootMargin:'-45% 0px -50% 0px'});
    $$('main section[id]').forEach(function(s){so.observe(s)});
  }

  // hero slideshow
  var slides=$$('.slides img'),cur=$('#cur'),bar=$('#bar'),si=0;
  if(slides.length>1&&!reduce){
    var runBar=function(){bar.classList.remove('run');void bar.offsetWidth;bar.classList.add('run')};
    var next=function(){
      var n=(si+1)%slides.length,img=slides[n];
      var go=function(){
        slides[si].classList.remove('on');img.classList.add('on');si=n;
        cur.textContent=('0'+(si+1)).slice(-2);runBar();
        var after=slides[(si+1)%slides.length];if(after.dataset.src){after.src=after.dataset.src;delete after.dataset.src}
      };
      if(img.dataset.src){img.src=img.dataset.src;delete img.dataset.src}
      if(img.complete&&img.naturalWidth)go();else img.onload=go;
    };
    addEventListener('load',function(){
      slides[1].src=slides[1].dataset.src;delete slides[1].dataset.src;
      runBar();setInterval(function(){if(!document.hidden)next()},6000);
    });
  }
  // timecode embellishment
  var tc=$('#tc');
  if(tc&&!reduce){
    var t0=Date.now(),p=function(n){return ('0'+n).slice(-2)};
    setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);tc.textContent=p(Math.floor(s/3600))+':'+p(Math.floor(s/60)%60)+':'+p(s%60)},1000);
  }

  // gallery layout + filters
  var g=$('#gallery'),items=g?$$('.g-item',g):[];
  function layout(){
    var vis=items.filter(function(a){return !a.hidden}),c=vis.length,cells=0;
    vis.forEach(function(a,n){
      var big=n%6===0&&c-n>=3;
      a.className=a.className.replace(/ (big|r|half|full|odd)\b/g,'');
      if(big)a.className+=n%12===6?' big r':' big';
      cells+=big?3:1;
    });
    if(cells%3===1)vis[c-1].className+=' full';
    if(cells%3===2){vis[c-1].className+=' half';vis[c-2].className+=' half'}
    if(c%2)vis[c-1].className+=' odd';
    vis.forEach(function(a){
      var w=/ full/.test(a.className)?'100vw':/ big/.test(a.className)?'66vw':/ half/.test(a.className)?'50vw':'33vw';
      a.firstChild.sizes='(max-width:480px) 100vw, (max-width:820px) '+(/ odd/.test(a.className)?'100vw':'50vw')+', '+w;
    });
  }
  layout();
  $$('.filters button').forEach(function(b){
    b.addEventListener('click',function(){
      var f=b.dataset.filter;
      var apply=function(){
        $$('.filters button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
        items.forEach(function(a){a.hidden=f!=='all'&&a.dataset.tags.split(' ').indexOf(f)<0;a.classList.add('in')});
        layout();
      };
      if(document.startViewTransition&&!reduce)document.startViewTransition(apply);else apply();
    });
  });

  // about image parallax
  var ai=$('#about-img');
  if(ai&&!reduce){
    var tick=false;
    addEventListener('scroll',function(){
      if(tick)return;tick=true;
      requestAnimationFrame(function(){
        var r=ai.parentNode.getBoundingClientRect(),h=innerHeight;
        if(r.bottom>0&&r.top<h){var k=(r.top+r.height/2-h/2)/h;ai.style.transform='translateY('+(-6.5+k*-6.5)+'%)'}
        tick=false;
      });
    },{passive:true});
  }

  // lightbox
  var lb=$('#lightbox');
  if(!g||!lb||!lb.showModal)return;
  var img=$('img',lb),cap=$('.lb-cap',lb),cnt=$('.lb-count',lb),vis=[],i=0;
  function show(n){
    i=(n+vis.length)%vis.length;var a=vis[i];
    img.classList.add('swap');
    var pre=new Image();
    pre.onload=pre.onerror=function(){img.src=a.href;img.alt=$('img',a).alt;img.classList.remove('swap')};
    pre.src=a.href;
    cap.textContent=a.dataset.cap;
    cnt.textContent=('0'+(i+1)).slice(-2)+' / '+('0'+vis.length).slice(-2);
    new Image().src=vis[(i+1)%vis.length].href;
  }
  items.forEach(function(a){a.addEventListener('click',function(e){
    e.preventDefault();vis=items.filter(function(x){return !x.hidden});show(vis.indexOf(a));lb.showModal();
  })});
  $('.lb-close',lb).onclick=function(){lb.close()};
  $('.lb-prev',lb).onclick=function(){show(i-1)};
  $('.lb-next',lb).onclick=function(){show(i+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
  var x0=null;
  lb.addEventListener('touchstart',function(e){x0=e.touches[0].clientX},{passive:true});
  lb.addEventListener('touchend',function(e){if(x0===null)return;var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>50)show(i+(d<0?1:-1));x0=null});
})();
