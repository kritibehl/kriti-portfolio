// Count-up
function countUp(el, target, dur=1500) {
  const s = performance.now();
  const tick = now => {
    const p = Math.min((now-s)/dur, 1), e = 1-Math.pow(1-p,4);
    el.textContent = Math.round(e*target).toLocaleString();
    if(p<1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
const cObs = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ countUp(e.target, +e.target.dataset.target); cObs.unobserve(e.target); } });
}, {threshold:0.4});
document.querySelectorAll('.count-up').forEach(c => cObs.observe(c));

// Scroll reveal
const revObs = new IntersectionObserver(es => {
  es.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, {threshold:0.07});
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// Scroll spy
const spy = new IntersectionObserver(es => {
  es.forEach(e => {
    if(e.isIntersecting){
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      const a = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if(a) a.classList.add('active');
    }
  });
}, {rootMargin:'-30% 0px -60% 0px'});
document.querySelectorAll('section[id]').forEach(s => spy.observe(s));

// Mouse-tracking glow on cards
document.querySelectorAll('.project-card, .featured-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100).toFixed(1)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100).toFixed(1)+'%');
  });
});