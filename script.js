
function getUsers(){ return JSON.parse(localStorage.getItem("users"))||[]; }
function saveUsers(v){ localStorage.setItem("users", JSON.stringify(v)); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem("currentUser"))||null; }
function setCurrentUser(u){ localStorage.setItem("currentUser", JSON.stringify(u)); }


const regForm=document.getElementById("registerForm");
if(regForm){
  regForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const username=document.getElementById("reg-username").value.trim();
    const email=document.getElementById("reg-email").value.trim();
    const password=document.getElementById("reg-password").value;
    const users=getUsers();
    if(users.find(u=>u.email===email)){ alert("Email already exists"); return; }
    users.push({username,email,password}); saveUsers(users);
    alert("Registered! Now sign in."); location.href="login.html";
  });
}


const loginForm=document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.getElementById("login-email").value.trim();
    const password=document.getElementById("login-password").value;
    const user=getUsers().find(u=>u.email===email && u.password===password);
    if(!user){ alert("Wrong email or password"); return; }
    setCurrentUser(user); alert(`Welcome, ${user.username}!`); location.href="index.html";
  });
}


const nav=document.getElementById("nav-links");
if(nav){
  const u=getCurrentUser();
  if(u){
    nav.innerHTML=`
      <a href="slots.html">Slots</a>
      <a href="casinos.html">Casinos</a>
      <a href="providers.html">Providers</a>
      <a href="polls.html">Polls</a>
      <a href="ratings.html">Ratings</a>
      <span class="user-label" style="margin-left:12px;color:#ffcc00">👤 ${u.username}</span>
      <button class="btn btn-logout" id="logoutBtn" style="margin-left:10px;">Logout</button>`;
    document.getElementById("logoutBtn").addEventListener("click",()=>{ localStorage.removeItem("currentUser"); location.reload(); });
  }else{
    nav.innerHTML=`
      <a href="index.html">Home</a>
      <a href="slots.html">Slots</a>
      <a href="casinos.html">Casinos</a>
      <a href="providers.html">Providers</a>
      <a href="polls.html">Polls</a>
      <a href="ratings.html">Ratings</a>
      <a href="login.html">Login</a>
      <a href="register.html">Register</a>`;
  }
}


const burger=document.getElementById("burger");
if(burger && nav){ burger.addEventListener("click",()=> nav.classList.toggle("active")); }


const slotsData={
  sweet:{ name:"Sweet Bonanza", provider:"Pragmatic Play", rtp:"96.5%", volatility:"High", maxwin:"21100x",
    image:"https://ltdfoto.ru/images/2025/09/28/image54c787eebadae4a3.png" },
  bigbass:{ name:"Big Bass Halloween", provider:"Pragmatic Play", rtp:"96.7%", volatility:"Medium", maxwin:"4000x",
    image:"https://aws.die-spielbank.de/sachsen/images/de/big-bass-halloween_die-spielbank_600x600.webp" },
  doghouse:{ name:"The Dog House", provider:"Pragmatic Play", rtp:"96.6%", volatility:"High", maxwin:"6750x",
    image:"https://media.betmgm.co.uk/images/games/the-dog-house-megaways/the-dog-house-megaways-icon.jpg" }
};

const casinosData={
  vavada:{ name:"Vavada", reputation:"4.4 / 5",
    image:"https://s3-eu-west-1.amazonaws.com/tpd/logos/60a3900b09cef7000135b385/0x0.png" },
  mostbet:{ name:"Mostbet", reputation:"3.9 / 5",
    image:"https://afsckyiv.com/wp-content/uploads/2022/08/mostbet.jpeg" },
  "1xbet":{ name:"1xBET", reputation:"4.2 / 5",
    image:"https://casinobox24.com/wp-content/uploads/2024/12/1XBet.png" }
};

const providersData={
  pragmatic:{ name:"Pragmatic Play", image:"https://playgrounddiveshop.com/wp-content/uploads/2025/03/unnamed.png" },
  netent:{ name:"NetEnt", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawfQxehl61P0iD8bb9CDklBIbKtEK5fuwRA&s" },
  hacksaw:{ name:"Hacksaw Gaming", image:"https://www.racingpost.com/online-casino/static/providers/hacksaw-gaming/capa-review-hacksaw-gaming/capa-review-hacksaw-gaming.jpg?v=1742485612" },
  playngo:{ name:"Play’n GO", image:"https://www.hardrockdigital.com/wp-content/uploads/2024/11/playngo-512x403.jpg" }
};


function getItemRatings(id){ return JSON.parse(localStorage.getItem(`ratings-${id}`))||[]; }
function saveItemRatings(id, arr){ localStorage.setItem(`ratings-${id}`, JSON.stringify(arr)); }

function renderAvg(id){
  const mount=document.getElementById("avg-rating");
  if(!mount) return;
  const list=getItemRatings(id);
  if(list.length===0){ mount.innerHTML="No reviews yet."; return; }
  const avg=(list.reduce((s,r)=>s+Number(r.stars),0)/list.length).toFixed(1);
  mount.innerHTML=`Average: ${renderStarsInline(avg)} <span style="color:#888">(${avg}/5, ${list.length})</span>`;
}

function renderStarsInline(value){

  const rounded=Math.round(value);
  let s="";
  for(let i=1;i<=5;i++){ s+= i<=rounded ? "★" : "☆"; }
  return `<span style="color:#ffcc00">${s}</span>`;
}

function mountStarsInput(container){
  if(!container) return;
  container.innerHTML = `
    <div class="rate-stars" data-value="0">
      <span class="star" data-star="1">☆</span>
      <span class="star" data-star="2">☆</span>
      <span class="star" data-star="3">☆</span>
      <span class="star" data-star="4">☆</span>
      <span class="star" data-star="5">☆</span>
    </div>`;
  const stars=[...container.querySelectorAll(".star")];
  stars.forEach(st=>{
    st.addEventListener("mouseenter",()=>paint(stars,Number(st.dataset.star)));
    st.addEventListener("mouseleave",()=>paint(stars,Number(container.querySelector(".rate-stars").dataset.value)));
    st.addEventListener("click",()=>{
      const val=Number(st.dataset.star);
      container.querySelector(".rate-stars").dataset.value=val;
      paint(stars,val);
    });
  });
  function paint(stars,val){ stars.forEach((s,i)=>{ s.textContent = (i+1)<=val ? "★" : "☆"; s.classList.toggle("filled",(i+1)<=val); }); }
}

function addReview(id){
  const user=getCurrentUser();
  if(!user){ alert("Login to post a review."); return; }
  const root=document.querySelector(".stars-input .rate-stars");
  const starsValue = root ? Number(root.dataset.value) : 0;
  if(!starsValue){ alert("Choose star rating (1–5)."); return; }
  const text=document.getElementById("comment-input").value.trim();
  const list=getItemRatings(id);
  list.push({ user:user.username, stars:starsValue, text, ts:Date.now() });
  saveItemRatings(id,list);
  document.getElementById("comment-input").value="";
  renderReviews(id);
  renderAvg(id);
}

function renderReviews(id){
  const ul=document.getElementById("comments-list"); if(!ul) return;
  const list=getItemRatings(id);
  ul.innerHTML="";
  list.slice().reverse().forEach(r=>{
    const li=document.createElement("li");
    li.innerHTML = `<div>${renderStarsInline(r.stars)} — <b>${r.user}</b></div>${r.text?`<div style="margin-top:4px;">${r.text}</div>`:""}`;
    ul.appendChild(li);
  });
}


const slotBox=document.getElementById("slot-details");
if(slotBox){
  const id=new URLSearchParams(location.search).get("id");
  const slot=slotsData[id];
  if(slot){
    slotBox.innerHTML=`
      <img src="${slot.image}" alt="${slot.name}" class="detail-img">
      <h1>${slot.name}</h1>
      <p><b>Provider:</b> ${slot.provider}</p>
      <p>🎯 <b>RTP:</b> ${slot.rtp}</p>
      <p>⚡ <b>Volatility:</b> ${slot.volatility}</p>
      <p>💰 <b>Max win:</b> ${slot.maxwin}</p>
    `;
    mountStarsInput(document.querySelector(".stars-input"));
    document.getElementById("comment-btn").addEventListener("click",()=>addReview(id));
    renderAvg(id); renderReviews(id);
  }
}

const casinoBox=document.getElementById("casino-details");
if(casinoBox){
  const id=new URLSearchParams(location.search).get("id");
  const c=casinosData[id];
  if(c){
    casinoBox.innerHTML=`
      <img src="${c.image}" alt="${c.name}" class="detail-img">
      <h1>${c.name}</h1>
      <p>⭐ <b>Reputation:</b> ${c.reputation}</p>
    `;
    mountStarsInput(document.querySelector(".stars-input"));
    document.getElementById("comment-btn").addEventListener("click",()=>addReview(id));
    renderAvg(id); renderReviews(id);
  }
}


const POLL_MONTH = (()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; })();
function _userKey(){ const u=getCurrentUser(); return u? u.email : "anon"; }
function _getUserPolls(){ return JSON.parse(localStorage.getItem("userPolls"))||{}; }
function _setUserPolls(o){ localStorage.setItem("userPolls", JSON.stringify(o)); }
function hasUserVoted(cat){ const up=_getUserPolls(); const k=_userKey(); return up[POLL_MONTH]?.[k]?.[cat]===true; }
function markUserVoted(cat){ const up=_getUserPolls(); const k=_userKey(); if(!up[POLL_MONTH]) up[POLL_MONTH]={}; if(!up[POLL_MONTH][k]) up[POLL_MONTH][k]={}; up[POLL_MONTH][k][cat]=true; _setUserPolls(up); }
function getPollResults(cat){ return JSON.parse(localStorage.getItem(`poll-${cat}-${POLL_MONTH}`))||{}; }
function savePollResults(cat,res){ localStorage.setItem(`poll-${cat}-${POLL_MONTH}`, JSON.stringify(res)); }
function _itemsForCategory(cat){
  if(cat==="slots") return Object.entries(slotsData).map(([id,v])=>({id,name:v.name,image:v.image}));
  if(cat==="casinos") return Object.entries(casinosData).map(([id,v])=>({id,name:v.name,image:v.image}));
  if(cat==="providers") return Object.entries(providersData).map(([id,v])=>({id,name:v.name,image:v.image}));
  return [];
}
function vote(cat,id){
  if(hasUserVoted(cat)){ alert("Already voted this month."); return; }
  const res=getPollResults(cat); res[id]=(res[id]||0)+1; savePollResults(cat,res); markUserVoted(cat); renderPoll(cat);
}
function renderPoll(cat){
  const el=document.getElementById(`poll-${cat}`); if(!el) return;
  const items=_itemsForCategory(cat);
  const res=getPollResults(cat); const total=Object.values(res).reduce((a,b)=>a+b,0);
  const voted=hasUserVoted(cat);
  let options=`<div class="poll-list">`;
  items.forEach(it=>{
    options+=`<label class="poll-option"><input type="radio" name="opt-${cat}" value="${it.id}" ${voted?"disabled":""}>
      <img src="${it.image}" alt="${it.name}"><span>${it.name}</span></label>`;
  });
  options+=`</div>`;
  const action = voted ? `<div class="poll-note">✅ Your vote is counted for ${POLL_MONTH}.</div>`
    : `<div class="poll-actions"><button class="btn" id="btn-${cat}">Vote</button></div>
       <div class="poll-note">One vote in this category for ${POLL_MONTH}.</div>`;
  let resultHTML=`<div class="poll-results">`;
  items.forEach(it=>{
    const c=res[it.id]||0; const pct= total>0 ? Math.round(c*100/total):0;
    resultHTML+=`<div class="progress-row"><div class="name">${it.name}</div>
      <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
      <div class="val">${pct}% (${c})</div></div>`;
  });
  resultHTML+=`</div>`;
  el.innerHTML=options+action+resultHTML;
  if(!voted){ document.getElementById(`btn-${cat}`).addEventListener("click",()=>{ const ch=document.querySelector(`input[name="opt-${cat}"]:checked`); if(!ch){alert("Choose option"); return;} vote(cat,ch.value); }); }
}
window.addEventListener("DOMContentLoaded",()=>["slots","casinos","providers"].forEach(renderPoll));


function renderWinners(){
  const c=document.getElementById("winners"); if(!c) return;
  const cats=["slots","casinos","providers"]; let html="";
  cats.forEach(cat=>{
    const res=getPollResults(cat);
    if(Object.keys(res).length===0) return;
    const winnerId=Object.entries(res).sort((a,b)=>b[1]-a[1])[0][0];
    let w;
    if(cat==="slots") w=slotsData[winnerId];
    if(cat==="casinos") w=casinosData[winnerId];
    if(cat==="providers") w=providersData[winnerId];
    if(!w) return;
    html+=`<div class="card"><h3>${cat==="slots"?"Best slot":cat==="casinos"?"Best casino":"Best provider"}</h3>
      <img src="${w.image}" alt="${w.name}"><h2>${w.name}</h2></div>`;
  });
  c.innerHTML = html || "<p>No votes yet. Go to <b>Polls</b> and vote!</p>";
}
window.addEventListener("DOMContentLoaded",renderWinners);


function userKey(){ const u=getCurrentUser(); return u? u.email : "anon"; }
function setStarVote(slotId, stars){ localStorage.setItem(`rate-slot-${slotId}-${userKey()}`, String(stars)); }
function getStarVote(slotId){ return Number(localStorage.getItem(`rate-slot-${slotId}-${userKey()}`)||0); }


function getSlotStarAverage(slotId){
  const keys=Object.keys(localStorage).filter(k=>k.startsWith(`rate-slot-${slotId}-`));
  if(keys.length===0) return {avg:0,count:0};
  const vals=keys.map(k=>Number(localStorage.getItem(k)||0)).filter(v=>v>0);
  const count=vals.length; const avg = count? (vals.reduce((a,b)=>a+b,0)/count) : 0;
  return {avg, count};
}

function renderRatingsPage(){
  const mount=document.getElementById("rate-slots"); if(!mount) return;
  let html="";
  Object.entries(slotsData).forEach(([id,v])=>{
    const {avg,count}=getSlotStarAverage(id);
    const my=getStarVote(id);
    html+=`<div class="rating-box">
      <img src="${v.image}" alt="${v.name}" class="detail-img">
      <h2>${v.name}</h2>
      <div class="rate-stars" data-id="${id}" data-value="${my}">
        ${[1,2,3,4,5].map(n=>`<span class="star ${my>=n?"filled":""}" data-star="${n}">${my>=n?"★":"☆"}</span>`).join("")}
      </div>
      <div class="avg-rating">Average: ${renderStarsInline(avg)} <span style="color:#888">(${avg.toFixed(1)}/5, ${count})</span></div>
    </div>`;
  });
  mount.innerHTML=html;


  [...document.querySelectorAll(".rating-box .star")].forEach(st=>{
    st.addEventListener("mouseenter",()=>{
      const wrap=st.closest(".rate-stars"); const stars=[...wrap.querySelectorAll(".star")]; const val=Number(st.dataset.star);
      stars.forEach((s,i)=>{ s.textContent=(i+1)<=val?"★":"☆"; s.classList.toggle("filled",(i+1)<=val); });
    });
    st.addEventListener("mouseleave",()=>{
      const wrap=st.closest(".rate-stars"); const stars=[...wrap.querySelectorAll(".star")]; const saved=Number(wrap.dataset.value||0);
      stars.forEach((s,i)=>{ s.textContent=(i+1)<=saved?"★":"☆"; s.classList.toggle("filled",(i+1)<=saved); });
    });
    st.addEventListener("click",()=>{
      const wrap=st.closest(".rate-stars"); const id=wrap.dataset.id; const val=Number(st.dataset.star);
      wrap.dataset.value=val; setStarVote(id,val); renderRatingsPage(); // перерисуем среднее
    });
  });
}
window.addEventListener("DOMContentLoaded",renderRatingsPage);
