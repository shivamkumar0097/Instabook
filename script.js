function showLogin(){
  document.getElementById('loginPage').classList.remove('hidden');
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('feedPage').classList.add('hidden');
  document.getElementById('searchPage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
}
function showSignup(){
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.remove('hidden');
}
function getUsers(){ return JSON.parse(localStorage.getItem('fb_users')||'[]'); }
function login(){
  var email = document.getElementById('email').value.trim().toLowerCase();
  var pass = document.getElementById('pass').value;
  var user = getUsers().find(function(u){ return u.email===email && u.pass===pass; });
  if(user){ localStorage.setItem('fb_current', JSON.stringify(user)); showFeed(); }
  else alert('Wrong email or password');
}
function signup(){
  var name = document.getElementById('sname').value.trim();
  var email = document.getElementById('semail').value.trim().toLowerCase();
  var pass = document.getElementById('spass').value;
  if(!name || !email || !pass){ alert('Fill all fields'); return; }
  var users = getUsers();
  if(users.find(function(u){ return u.email===email; })){ alert('Email already exists'); return; }
  var user = { name: name, email: email, pass: pass, bio: '' };
  users.push(user);
  localStorage.setItem('fb_users', JSON.stringify(users));
  localStorage.setItem('fb_current', JSON.stringify(user));
  showFeed();
}
function showFeed(){
  var user = JSON.parse(localStorage.getItem('fb_current'));
  document.getElementById('loginPage').classList.add('hidden');
  document.getElementById('signupPage').classList.add('hidden');
  document.getElementById('feedPage').classList.remove('hidden');
  document.getElementById('searchPage').classList.add('hidden');
  document.getElementById('profilePage').classList.add('hidden');
  document.getElementById('myAvatar').textContent = user.name.charAt(0).toUpperCase();
  renderPosts();
}
function getPosts(){ return JSON.parse(localStorage.getItem('fb_posts')||'[]'); }
function createPost(){
  var text = document.getElementById('postText').value.trim();
  if(!text) return;
  var user = JSON.parse(localStorage.getItem('fb_current'));
  var posts = getPosts();
  posts.unshift({ name: user.name, text: text, time: 'Just now', likes: 0 });
  localStorage.setItem('fb_posts', JSON.stringify(posts));
  document.getElementById('postText').value = '';
  renderPosts();
}
function like(i){
  var posts = getPosts();
  posts[i].likes++;
  localStorage.setItem('fb_posts', JSON.stringify(posts));
  renderPosts();
}
function renderPosts(){
  var posts = getPosts();
  var html = '';
  for(var i=0; i<posts.length; i++){
    var p = posts[i];
    html += '<div class="post"><div class="post-header"><div class="avatar">' + p.name.charAt(0) + '</div><div><b>' + p.name + '</b><div>' + p.time + '</div></div></div><div style="margin:8px 0;">' + p.text + '</div><button onclick="like(' + i + ')">👍 ' + p.likes + '</button><button>💬</button><button>↗️</button></div>';
  }
  document.getElementById('posts').innerHTML = html;
}
function showSearch(){
  document.getElementById('feedPage').classList.add('hidden');
  document.getElementById('searchPage').classList.remove('hidden');
}
function doSearch(){
  var q = document.getElementById('searchInput').value.toLowerCase();
  var users = getUsers().filter(function(u){ return u.name.toLowerCase().indexOf(q) > -1; });
  var html = '';
  for(var i=0; i<users.length; i++){
    html += '<div class="post" style="cursor:pointer;"><b>' + users[i].name + '</b><div style="font-size:13px;color:#65676b;">' + users[i].email + '</div></div>';
  }
  document.getElementById('searchResults').innerHTML = html || '<p style="padding:12px;color:#65676b;">No results</p>';
}
function showMenu(){
  document.getElementById('menuModal').classList.remove('hidden');
}
function closeMenu(){
  document.getElementById('menuModal').classList.add('hidden');
}
function menuAction(opt){
  closeMenu();
  if(opt === 'profile') showProfile();
  else if(opt === 'logout') logout();
}
function showProfile(){
  var user = JSON.parse(localStorage.getItem('fb_current'));
  document.getElementById('feedPage').classList.add('hidden');
  document.getElementById('profilePage').classList.remove('hidden');
  document.getElementById('profName').textContent = user.name;
  document.getElementById('profEmail').textContent = user.email;
  document.getElementById('profBio').textContent = user.bio || 'Add a bio';
  document.getElementById('profAvatar').textContent = user.name.charAt(0);
}
function editProfile(){
  var bio = prompt('Enter your bio:');
  if(bio === null) return;
  var user = JSON.parse(localStorage.getItem('fb_current'));
  user.bio = bio;
  var users = getUsers();
  for(var i=0; i<users.length; i++){
    if(users[i].email === user.email) users[i] = user;
  }
  localStorage.setItem('fb_users', JSON.stringify(users));
  localStorage.setItem('fb_current', JSON.stringify(user));
  showProfile();
}
function logout(){
  localStorage.removeItem('fb_current');
  showLogin();
}
if(localStorage.getItem('fb_current')) showFeed();