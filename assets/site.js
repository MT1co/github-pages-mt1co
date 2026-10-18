(function(){
  var y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
  var b=document.querySelector('.menu-btn'),m=document.getElementById('menu');
  if(b&&m){
    b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    m.addEventListener('click',function(e){if(e.target.tagName==='A'){m.classList.remove('open');b.setAttribute('aria-expanded','false')}});
  }
  var g=document.getElementById('gallery'),lb=document.getElementById('lightbox');
  if(!g||!lb||!lb.showModal)return;
  var items=[].slice.call(g.querySelectorAll('.g-item')),i=0,img=lb.querySelector('img'),cap=lb.querySelector('.lb-cap');
  function show(n){i=(n+items.length)%items.length;var a=items[i];img.src=a.href;img.alt=a.dataset.alt;cap.textContent=a.dataset.alt}
  items.forEach(function(a,n){a.addEventListener('click',function(e){e.preventDefault();show(n);lb.showModal()})});
  lb.querySelector('.lb-close').onclick=function(){lb.close()};
  lb.querySelector('.lb-prev').onclick=function(){show(i-1)};
  lb.querySelector('.lb-next').onclick=function(){show(i+1)};
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
})();
