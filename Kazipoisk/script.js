// === USERS SYSTEM ===
function getUsers(){ return JSON.parse(localStorage.getItem("users"))||[]; }
function saveUsers(users){ localStorage.setItem("users", JSON.stringify(users)); }
function getCurrentUser(){ return JSON.parse(localStorage.getItem("currentUser"))||null; }
function setCurrentUser(user){ localStorage.setItem("currentUser", JSON.stringify(user)); }

// REGISTER
const regForm=document.getElementById("registerForm");
if(regForm){
  regForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const username=document.getElementById("reg-username").value.trim();
    const email=document.getElementById("reg-email").value.trim();
    const password=document.getElementById("reg-password").value;
    let users=getUsers();
    if(users.find(u=>u.email===email)){ alert("Такой email уже зарегистрирован!"); return; }
    users.push({username,email,password}); saveUsers(users);
    alert("Регистрация успешна! Теперь войдите."); window.location.href="login.html";
  });
}

// LOGIN
const loginForm=document.getElementById("loginForm");
if(loginForm){
  loginForm.addEventListener("submit",(e)=>{
    e.preventDefault();
    const email=document.getElementById("login-email").value.trim();
    const password=document.getElementById("login-password").value;
    const user=getUsers().find(u=>u.email===email && u.password===password);
    if(!user){ alert("Неверный email или пароль!"); return; }
    setCurrentUser(user);
    alert(`Добро пожаловать, ${user.username}!`); window.location.href="index.html";
  });
}

// NAVBAR (добавили ссылку на Опросы)
const navLinks=document.getElementById("nav-links");
if(navLinks){
  const currentUser=getCurrentUser();
  if(currentUser){
    navLinks.innerHTML = `
      <a href="slots.html">Слоты</a>
      <a href="casinos.html">Казино</a>
      <a href="providers.html">Провайдеры</a>
      <a href="polls.html">Опросы</a>
      <span class="user-label">👤 ${currentUser.username}</span>
      <button class="btn btn-logout" id="logoutBtn">Выйти</button>
    `;
    document.getElementById("logoutBtn").addEventListener("click",()=>{localStorage.removeItem("currentUser"); location.reload();});
  } else {
    navLinks.innerHTML = `
      <a href="index.html">Главная</a>
      <a href="slots.html">Слоты</a>
      <a href="casinos.html">Казино</a>
      <a href="providers.html">Провайдеры</a>
      <a href="polls.html">Опросы</a>
      <a href="login.html">Вход</a>
      <a href="register.html">Регистрация</a>
    `;
  }
}

// === DATA (с твоими прямыми картинками) ===
const slotsData={
  sweet:{ name:"Sweet Bonanza", provider:"Pragmatic Play", rtp:"96.5%", volatility:"Высокая",
    description:"Красочный фруктовый слот с множителями и фриспинами.",
    image:"https://ltdfoto.ru/images/2025/09/28/image54c787eebadae4a3.png"
  },
  bigbass:{ name:"Big Bass Halloween", provider:"Pragmatic Play", rtp:"96.7%", volatility:"Средняя",
    description:"Хэллоуин-версия рыболовного слота.",
    image:"https://aws.die-spielbank.de/sachsen/images/de/big-bass-halloween_die-spielbank_600x600.webp"
  },
  doghouse:{ name:"The Dog House", provider:"Pragmatic Play", rtp:"96.6%", volatility:"Высокая",
    description:"Слот с липкими вайлдами и милыми пёсиками.",
    image:"https://media.betmgm.co.uk/images/games/the-dog-house-megaways/the-dog-house-megaways-icon.jpg"
  }
};

const casinosData={
  vavada:{ name:"Vavada", rating:"4.4 / 5",
    description:"Популярное казино СНГ. Быстрые выплаты, турниры, широкий выбор провайдеров.",
    image:"https://s3-eu-west-1.amazonaws.com/tpd/logos/60a3900b09cef7000135b385/0x0.png"
  },
  mostbet:{ name:"Mostbet", rating:"3.9 / 5",
    description:"Казино и букмекерская. Частые акции, отзывы спорные.",
    image:"https://afsckyiv.com/wp-content/uploads/2022/08/mostbet.jpeg"
  },
  "1xbet":{ name:"1xBET", rating:"4.2 / 5",
    description:"Известное казино с огромным выбором игр, бонусами и кэшаутами.",
    image:"https://casinobox24.com/wp-content/uploads/2024/12/1XBet.png"
  }
};

const providersData={
  pragmatic:{
    name:"Pragmatic Play",
    image:"https://playgrounddiveshop.com/wp-content/uploads/2025/03/unnamed.png"
  },
  netent:{
    name:"NetEnt",
    image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSawfQxehl61P0iD8bb9CDklBIbKtEK5fuwRA&s"
  },
  hacksaw:{
    name:"Hacksaw Gaming",
    image:"https://www.racingpost.com/online-casino/static/providers/hacksaw-gaming/capa-review-hacksaw-gaming/capa-review-hacksaw-gaming.jpg?v=1742485612"
  },
  playngo:{
    name:"Play’n GO",
    image:"https://www.hardrockdigital.com/wp-content/uploads/2024/11/playngo-512x403.jpg"
  }
};


// === COMMENTS ===
function addComment(id){
  const currentUser=getCurrentUser();
  if(!currentUser){ alert("Только авторизованные пользователи могут оставлять отзывы!"); return; }
  const input=document.querySelector(".comment-form textarea");
  if(!input) return;
  const text=input.value.trim(); if(!text) return;
  let comments=JSON.parse(localStorage.getItem(`comments-${id}`))||[];
  comments.push({user:currentUser.username, text}); localStorage.setItem(`comments-${id}`, JSON.stringify(comments));
  renderComments(id); input.value="";
}
function renderComments(id){
  const list=document.getElementById("comments-list"); if(!list) return;
  list.innerHTML=""; (JSON.parse(localStorage.getItem(`comments-${id}`))||[]).forEach(c=>{
    const li=document.createElement("li"); li.innerHTML=`<b>${c.user}</b>: ${c.text}`; list.appendChild(li);
  });
}

// === DETAILS: SLOT ===
const slotContainer=document.getElementById("slot-details");
if(slotContainer){
  const id=new URLSearchParams(location.search).get("id"); const slot=slotsData[id];
  if(slot){
    slotContainer.innerHTML=`
      <img src="${slot.image}" alt="${slot.name}" class="detail-img">
      <h1>${slot.name}</h1>
      <p><b>Провайдер:</b> ${slot.provider}</p>
      <p>🎯 RTP: ${slot.rtp}</p>
      <p>⚡ Волатильность: ${slot.volatility}</p>
      <p>${slot.description}</p>`;
    document.getElementById("comment-btn")?.addEventListener("click",()=>addComment(id));
    renderComments(id);
  }
}

// === DETAILS: CASINO ===
const casinoContainer=document.getElementById("casino-details");
if(casinoContainer){
  const id=new URLSearchParams(location.search).get("id"); const casino=casinosData[id];
  if(casino){
    casinoContainer.innerHTML=`
      <img src="${casino.image}" alt="${casino.name}" class="detail-img">
      <h1>${casino.name}</h1>
      <p>⭐ Репутация: ${casino.rating}</p>
      <p>${casino.description}</p>`;
    document.getElementById("comment-btn")?.addEventListener("click",()=>addComment(id));
    renderComments(id);
  }
}

/* =========================
   POLLS (ОПРОСЫ)
   - 1 голос в категории в месяц (для гостя — тоже, хранится отдельно)
   - категории: slots / casinos / providers
========================= */
const POLL_MONTH = (()=>{ const d=new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`; })();

function _userKey(){ const u=getCurrentUser(); return u? u.email : "anon"; }

function _getUserPolls(){
  return JSON.parse(localStorage.getItem("userPolls"))||{};
}
function _setUserPolls(obj){
  localStorage.setItem("userPolls", JSON.stringify(obj));
}
function hasUserVoted(category){
  const up=_getUserPolls(); const key=_userKey();
  return up[POLL_MONTH]?.[key]?.[category]===true;
}
function markUserVoted(category){
  const up=_getUserPolls(); const key=_userKey();
  if(!up[POLL_MONTH]) up[POLL_MONTH]={};
  if(!up[POLL_MONTH][key]) up[POLL_MONTH][key]={};
  up[POLL_MONTH][key][category]=true; _setUserPolls(up);
}

function getPollResults(category){
  return JSON.parse(localStorage.getItem(`poll-${category}-${POLL_MONTH}`)) || {};
}
function savePollResults(category, results){
  localStorage.setItem(`poll-${category}-${POLL_MONTH}`, JSON.stringify(results));
}

function vote(category, id){
  if(hasUserVoted(category)){ alert("Ты уже голосовал(а) в этой категории в этом месяце."); return; }
  const res=getPollResults(category); res[id]=(res[id]||0)+1; savePollResults(category, res); markUserVoted(category);
  renderPoll(category);
}

function _itemsForCategory(category){
  if(category==="slots") return Object.entries(slotsData).map(([id,v])=>({id,name:v.name,image:v.image}));
  if(category==="casinos") return Object.entries(casinosData).map(([id,v])=>({id,name:v.name,image:v.image}));
  if(category==="providers") return Object.entries(providersData).map(([id,v])=>({id,name:v.name,image:v.image}));
  return [];
}

function renderPoll(category){
  const mountPoint=document.getElementById(`poll-${category}`); if(!mountPoint) return;
  const items=_itemsForCategory(category);
  const results=getPollResults(category); const total=Object.values(results).reduce((a,b)=>a+b,0);

  const voted = hasUserVoted(category);

  // OPTIONS
  let optionsHTML = `<div class="poll-list">`;
  items.forEach(it=>{
    optionsHTML += `
      <label class="poll-option">
        <input type="radio" name="opt-${category}" value="${it.id}" ${voted?"disabled":""}>
        <img src="${it.image}" alt="${it.name}">
        <span>${it.name}</span>
      </label>`;
  });
  optionsHTML += `</div>`;

  const actionHTML = voted
    ? `<div class="poll-note">✅ Твой голос учтён на этот месяц.</div>`
    : `<div class="poll-actions"><button class="btn" id="btn-${category}">Голосовать</button></div>
       <div class="poll-note">Можно отдать только один голос в этой категории за ${POLL_MONTH}.</div>`;

  // RESULTS
  let resultsHTML = `<div class="poll-results">`;
  items.forEach(it=>{
    const count = results[it.id]||0;
    const pct = total>0 ? Math.round(count*100/total) : 0;
    resultsHTML += `
      <div class="progress-row">
        <div class="name">${it.name}</div>
        <div class="progress"><div class="progress-bar" style="width:${pct}%"></div></div>
        <div class="val">${pct}% (${count})</div>
      </div>`;
  });
  resultsHTML += `</div>`;

  mountPoint.innerHTML = optionsHTML + actionHTML + resultsHTML;

  if(!voted){
    document.getElementById(`btn-${category}`)?.addEventListener("click", ()=>{
      const chosen = document.querySelector(`input[name="opt-${category}"]:checked`);
      if(!chosen){ alert("Выбери вариант."); return; }
      vote(category, chosen.value);
    });
  }
}

// Авто-рендер на странице опросов
window.addEventListener("DOMContentLoaded", ()=>{
  ["slots","casinos","providers"].forEach(renderPoll);
});
// === TOP WINNERS OF MONTH ===
function renderWinners() {
  const container = document.getElementById("winners");
  if (!container) return;

  const categories = ["slots", "casinos", "providers"];
  let html = "";

  categories.forEach(cat => {
    const results = getPollResults(cat);
    if (!results || Object.keys(results).length === 0) return;

    // Определяем победителя
    const winnerId = Object.entries(results).sort((a, b) => b[1] - a[1])[0][0];
    let winner;

    if (cat === "slots") winner = slotsData[winnerId];
    if (cat === "casinos") winner = casinosData[winnerId];
    if (cat === "providers") winner = providersData[winnerId];

    if (!winner) return;

    html += `
      <div class="card">
        <h3>${cat === "slots" ? "Лучший слот" : cat === "casinos" ? "Лучшее казино" : "Лучший провайдер"}</h3>
        <img src="${winner.image}" alt="${winner.name}">
        <h2>${winner.name}</h2>
      </div>
    `;
  });

  container.innerHTML = html || "<p>Пока нет данных. Проголосуй на странице «Опросы»!</p>";
}

window.addEventListener("DOMContentLoaded", renderWinners);
// === BURGER MENU ===
const burger = document.getElementById("burger");
const nav = document.getElementById("nav-links");

if (burger && nav) {
  burger.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}
