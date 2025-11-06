/* Simple time utilities */
function pad(n){ return n.toString().padStart(2, "0"); }
function formatTime(date){
  let h = date.getHours();
  const m = pad(date.getMinutes());
  // 12-hour style (like iOS)
  const twelve = ((h + 11) % 12) + 1;
  return `${twelve}:${m}`;
}
function formatLockDate(date){
  const opts = { weekday: "long", month: "short", day: "numeric" };
  return date.toLocaleDateString(undefined, opts);
}

/* DOM refs */
const screenEl = document.querySelector(".screen");
const statusTimeEl = document.getElementById("statusTime");
const lockTimeEl   = document.getElementById("lockTime");
const lockDateEl   = document.getElementById("lockDate");
const homeIndicator = document.querySelector(".home-indicator");
const powerBtn = document.querySelector(".btn-power");

/* Update clock now and every minute at :00 */
function updateClock(){
  const now = new Date();
  const t = formatTime(now);
  statusTimeEl.textContent = t;
  lockTimeEl.textContent = t;
  lockDateEl.textContent = formatLockDate(now);
}
updateClock();

/* Align next tick to the top of the minute */
(function tickAlign(){
  const now = new Date();
  const msToNextMinute = (60 - now.getSeconds()) * 1000 - now.getMilliseconds();
  setTimeout(()=>{
    updateClock();
    setInterval(updateClock, 60*1000);
  }, msToNextMinute);
})();

/* Lock/unlock helpers */
function isLocked(){
  return screenEl.getAttribute("data-state") === "locked";
}
function lock(){
  screenEl.setAttribute("data-state", "locked");
  powerBtn.setAttribute("aria-pressed", "true");
}
function unlock(){
  screenEl.setAttribute("data-state", "unlocked");
  powerBtn.setAttribute("aria-pressed", "false");
}

/* Interactions */
powerBtn.addEventListener("click", () => {
  if (isLocked()) { unlock(); } else { lock(); }
});

/* Home indicator: tap to unlock (or lock if already unlocked) */
homeIndicator.addEventListener("click", () => {
  if (isLocked()) unlock(); else lock();
});

/* Demo: open an app (scale) */
document.querySelectorAll(".app").forEach(app=>{
  app.addEventListener("click", ()=>{
    if (isLocked()) return; // ignore when locked
    app.animate(
      [
        { transform: "scale(1)", filter:"brightness(1)" },
        { transform: "scale(0.96)", filter:"brightness(0.95)" },
        { transform: "scale(1.04)", filter:"brightness(1.1)" },
        { transform: "scale(1)", filter:"brightness(1)" }
      ],
      { duration: 320, easing: "cubic-bezier(.2,.7,.2,1)" }
    );
  });
});

/* Keyboard shortcut: press L to lock/unlock */
document.addEventListener("keydown", (e)=>{
  if(e.key.toLowerCase()==="l"){
    if (isLocked()) unlock(); else lock();
  }
});
