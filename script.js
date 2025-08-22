let currentUser = null;
let currentSection = 'auth';

supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth state:', event, session);
    currentUser = session?.user || null;
    updateUI();
});

function updateUI() {
    if (currentUser) {
        document.getElementById('auth').classList.add('hidden');
        document.getElementById('auth').classList.remove('visible');
        document.getElementById('navbar').classList.remove('hidden');
        ['home', 'posts', 'profile'].forEach(id => {
            document.getElementById(id).classList.add('hidden');
            document.getElementById(id).classList.remove('visible');
        });
        loadProfile();
    } else {
        document.getElementById('auth').classList.remove('hidden');
        document.getElementById('auth').classList.add('visible');
        document.getElementById('navbar').classList.add('hidden');
    }
}

function showSection(sectionId) {
    if (!currentUser && sectionId !== 'auth') {
        alert('请登录！');
        return;
    }
    document.querySelectorAll('.container > div').forEach(el => {
        el.classList.add('hidden');
        el.classList.remove('visible');
    });
    document.getElementById(sectionId).classList.remove('hidden');
    document.getElementById(sectionId).classList.add('visible');
    currentSection = sectionId;
}

function toggleRegister() {
    const div = document.getElementById('confirmPasswordDiv');
    const btn = document.querySelector('button[onclick="toggleRegister()"]');
    if (div.style.display === 'none') {
        div.style.display = 'block';
        btn.textContent = '返回登录';
    } else {
        div.style.display = 'none';
        btn.textContent = '注册';
    }
    document.getElementById('errorMessage').textContent = '';
    document.getElementById('usernameEmail').value = '';
    document.getElementById('password').value = '';
    document.getElementById('confirmPassword').value = '';
}

async function signUp() {
    const usernameEmail = document.getElementById('usernameEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    if (!usernameEmail || !password || !confirmPassword) {
        errorDiv.textContent = '所有字段不能为空！';
        return;
    }
    if (password !== confirmPassword) {
        errorDiv.textContent = '两次密码不一致！';
        return;
    }
    if (password.length < 6) {
        errorDiv.textContent = '密码至少6位！';
        return;
    }

    console.log('Signing up:', { usernameEmail, password });
    const { data, error } = await supabase.auth.signUp({
        email: usernameEmail.includes('@') ? usernameEmail : undefined,
        password,
        options: { data: { username: usernameEmail.includes('@') ? undefined : usernameEmail } }
    });
    console.log('Sign up response:', { data, error });
    if (error) {
        errorDiv.textContent = error.message;
        return;
    }
    await supabase.from('users').insert({
        id: data.user.id, username: usernameEmail, user_class: '未设置班级', created_at: new Date().toLocaleString()
    });
    errorDiv.textContent = '注册成功，请登录！';
    toggleRegister();
}

async function signIn() {
    const usernameEmail = document.getElementById('usernameEmail').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorDiv = document.getElementById('errorMessage');

    if (!usernameEmail || !password) {
        errorDiv.textContent = '用户名/邮箱和密码不能为空！';
        return;
    }

    console.log('Signing in:', { usernameEmail, password });
    const { error } = await supabase.auth.signInWithPassword({
        email: usernameEmail.includes('@') ? usernameEmail : undefined,
        password
    });
    console.log('Sign in response:', { error });
    if (error) errorDiv.textContent = error.message;
}

async function logout() {
    if (confirm('确定退出？')) await supabase.auth.signOut();
}

async function submitPost() {
    if (!currentUser) { alert('请登录！'); return; }
    const title = document.getElementById('postTitle').value.trim();
    const content = document.getElementById('postContent').value.trim();
    const category = document.getElementById('postCategory').value;

    if (!title || !content || !category) {
        alert('请填写完整！');
        return;
    }

    const { error } = await supabase.from('posts').insert({
        title, content, category, author: currentUser.email, author_id: currentUser.id, time: new Date().toLocaleString()
    });
    if (error) alert(error.message);
    else {
        alert('发布成功！');
        showSection('posts');
        loadPosts();
    }
    document.getElementById('postTitle').value = '';
    document.getElementById('postContent').value = '';
    document.getElementById('postCategory').value = '';
}

async function loadPosts() {
    const { data, error } = await supabase.from('pos