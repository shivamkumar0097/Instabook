function showLogin() { document.getElementById('loginPage').classList.remove('hidden'); document.getElementById('signupPage').classList.add('hidden'); document.getElementById('feedPage').classList.add('hidden'); }
function showSignup() { document.getElementById('loginPage').classList.add('hidden'); document.getElementById('signupPage').classList.remove('hidden'); }
function getUsers() { return JSON.parse(localStorage.getItem('fb_users') || '[]'); }
function login() {
    var email = document.getElementById('email').value.trim().toLowerCase();
    var pass = document.getElementById('pass').value;
    var user = getUsers().find(u => u.email === email && u.pass === pass);
    if (user) { localStorage.setItem('fb_current', JSON.stringify(user)); showFeed(); }
    else alert('Wrong email or password');
}
function signup() {
    var name = document.getElementById('sname').value.trim();
    var email = document.getElementById('semail').value.trim().toLowerCase();
    var pass = document.getElementById('spass').value;
    if (!name || !email || !pass) { alert('Fill all'); return; }
    var users = getUsers();
    if (users.find(u => u.email === email)) { alert('Exists'); return; }
    users.push({ name, email, pass });
    localStorage.setItem('fb_users', JSON.stringify(users));
    localStorage.setItem('fb_current', JSON.stringify({ name, email }));
    showFeed();
}
function showFeed() {
    var user = JSON.parse(localStorage.getItem('fb_current'));
    document.getElementById('loginPage').classList.add('hidden');
    document.getElementById('signupPage').classList.add('hidden');
    document.getElementById('feedPage').classList.remove('hidden');
    document.getElementById('myAvatar').textContent = user.name[0].toUpperCase();
    renderPosts();
}
function getPosts() { return JSON.parse(localStorage.getItem('fb_posts') || '[]'); }
function createPost() {
    var text = document.getElementById('postText').value.trim();
    if (!text) return;
    var posts = getPosts();
    var user = JSON.parse(localStorage.getItem('fb_current'));
    posts.unshift({ name: user.name, text, time: 'Just now', likes: 0 });
    localStorage.setItem('fb_posts', JSON.stringify(posts));
    document.getElementById('postText').value = '';
    renderPosts();
}
function like(i) { var p = getPosts(); p[i].likes++; localStorage.setItem('fb_posts', JSON.stringify(p)); renderPosts(); }
function renderPosts() {
    document.getElementById('posts').innerHTML = getPosts().map((p, i) => `
    <div class="post">
      <div class="post-header"><div class="avatar">\( {p.name[0]}</div><div><div class="name"> \){p.name}</div><div class="time">${p.time}</div></div></div>
      <div>${p.text}</div>
      <div class="post-img">📷</div>
      <div class="post-actions"><button onclick="like(${i})">👍 ${p.likes}</button><button>💬</button><button>↗️</button></div>
    </div>`).join('');
}
if (localStorage.getItem('fb_current')) showFeed();