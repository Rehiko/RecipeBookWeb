(() => {
 const intro = document.getElementById('intro');
 if (!intro) return;
 const skip = document.createElement('button');
 skip.className = 'intro-skip'; skip.type = 'button'; skip.textContent = 'Skip intro';
 intro.append(skip);
 function enter() {
   intro.style.display = 'none';
   intro.style.pointerEvents = 'none';
   document.getElementById('pageContent').style.opacity = '1';
   document.querySelector('.hero-text').style.opacity = '1';
   if (window.ScrollTrigger) ScrollTrigger.refresh();
 }
 skip.addEventListener('click', enter);
 // Intro must never prevent access on slow devices or failed animation loads.
 setTimeout(enter, 6500);
 if (matchMedia('(prefers-reduced-motion: reduce)').matches) enter();
})();
