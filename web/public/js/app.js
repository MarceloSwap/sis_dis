// Configuração da API
const API_BASE_URL = 'http://localhost:3333';

// Estado da aplicação
const AppState = {
    user: null,
    token: localStorage.getItem('token'),
    tasks: []
};

// Elementos DOM
const elements = {
    // Auth elements
    authSection: document.getElementById('authSection'),
    tasksSection: document.getElementById('tasksSection'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    userMenu: document.getElementById('userMenu'),
    userName: document.getElementById('userName'),
    logoutBtn: document.getElementById('logoutBtn'),
    showRegister: document.getElementById('showRegister'),
    showLogin: document.getElementById('showLogin'),
    
    // Task elements
    addTaskBtn: document.getElementById('addTaskBtn'),
    taskFormContainer: document.getElementById('taskFormContainer'),
    taskForm: document.getElementById('taskForm'),
    cancelTaskBtn: document.getElementById('cancelTaskBtn'),
    tasksList: document.getElementById('tasksList'),
    loading: document.getElementById('loading'),
    
    // Toast container
    toastContainer: document.getElementById('toastContainer')
};

// Utilitários
const Utils = {
    // Exibir toast notification
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        elements.toastContainer.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    },

    // Fazer requisições HTTP
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };

        if (AppState.token) {
            config.headers.Authorization = `Bearer ${AppState.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('Request error:', error);
            throw error;
        }
    },

    // Formatar data
    formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('pt-BR');
    }
};

// Gerenciamento de autenticação
const Auth = {
    // Verificar se usuário está logado
    isAuthenticated() {
        return !!AppState.token;
    },

    // Login
    async login(email, password) {
        try {
            const response = await Utils.request('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            AppState.token = response.token;
            AppState.user = response.user;
            localStorage.setItem('token', response.token);

            this.updateUI();
            Utils.showToast('Login realizado com sucesso!', 'success');
            
            return true;
        } catch (error) {
            Utils.showToast(error.message, 'error');
            return false;
        }
    },

    // Registro
    async register(name, email, password) {
        try {
            await Utils.request('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ name, email, password })
            });

            Utils.showToast('Cadastro realizado com sucesso! Faça login.', 'success');
            UI.showLogin();
            
            return true;
        } catch (error) {
            Utils.showToast(error.message, 'error');
            return false;
        }
    },

    // Logout
    logout() {
        AppState.token = null;
        AppState.user = null;
        AppState.tasks = [];
        localStorage.removeItem('token');
        
        this.updateUI();
        Utils.showToast('Logout realizado com sucesso!', 'success');
    },

    // Atualizar interface baseada no estado de autenticação
    updateUI() {
        if (this.isAuthenticated()) {
            elements.authSection.classList.add('hidden');
            elements.tasksSection.classList.remove('hidden');
            elements.loginBtn.classList.add('hidden');
            elements.registerBtn.classList.add('hidden');
            elements.userMenu.classList.remove('hidden');
            elements.userName.textContent = AppState.user?.name || 'Usuário';
            
            Tasks.loadTasks();
        } else {
            elements.authSection.classList.remove('hidden');
            elements.tasksSection.classList.add('hidden');
            elements.loginBtn.classList.remove('hidden');
            elements.registerBtn.classList.remove('hidden');
            elements.userMenu.classList.add('hidden');
        }
    }
};

// Gerenciamento de tarefas
const Tasks = {
    // Carregar tarefas
    async loadTasks() {
        try {
            elements.loading.classList.remove('hidden');
            
            const response = await Utils.request('/tasks');
            AppState.tasks = response.tasks || [];
            
            this.renderTasks();
        } catch (error) {
            Utils.showToast('Erro ao carregar tarefas', 'error');
        } finally {
            elements.loading.classList.add('hidden');
        }
    },

    // Renderizar tarefas
    renderTasks() {
        const tasksHtml = AppState.tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''} priority-${task.priority}">
                <div class="task-header">
                    <h3 class="task-title">${task.title}</h3>
                    <span class="task-priority ${task.priority}">${task.priority}</span>
                </div>
                ${task.description ? `<p class="task-description">${task.description}</p>` : ''}
                <div class="task-actions">
                    ${!task.completed ? 
                        `<button class="btn btn-success" onclick="Tasks.toggleTask('${task._id}')">
                            <i class="fas fa-check"></i> Concluir
                        </button>` : 
                        `<button class="btn btn-outline" onclick="Tasks.toggleTask('${task._id}')">
                            <i class="fas fa-undo"></i> Reabrir
                        </button>`
                    }
                    <button class="btn btn-danger" onclick="Tasks.deleteTask('${task._id}')">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </div>
        `).join('');

        elements.tasksList.innerHTML = tasksHtml || '<p class="loading">Nenhuma tarefa encontrada.</p>';
    },

    // Adicionar tarefa
    async addTask(taskData) {
        try {
            await Utils.request('/tasks', {
                method: 'POST',
                body: JSON.stringify(taskData)
            });

            Utils.showToast('Tarefa criada com sucesso!', 'success');
            this.loadTasks();
            UI.hideTaskForm();
            
            return true;
        } catch (error) {
            Utils.showToast(error.message, 'error');
            return false;
        }
    },

    // Alternar status da tarefa
    async toggleTask(taskId) {
        try {
            await Utils.request(`/tasks/${taskId}/toggle`, {
                method: 'PATCH'
            });

            Utils.showToast('Status da tarefa atualizado!', 'success');
            this.loadTasks();
        } catch (error) {
            Utils.showToast('Erro ao atualizar tarefa', 'error');
        }
    },

    // Excluir tarefa
    async deleteTask(taskId) {
        if (!confirm('Tem certeza que deseja excluir esta tarefa?')) {
            return;
        }

        try {
            await Utils.request(`/tasks/${taskId}`, {
                method: 'DELETE'
            });

            Utils.showToast('Tarefa excluída com sucesso!', 'success');
            this.loadTasks();
        } catch (error) {
            Utils.showToast('Erro ao excluir tarefa', 'error');
        }
    }
};

// Gerenciamento da interface
const UI = {
    // Mostrar formulário de login
    showLogin() {
        elements.loginForm.classList.remove('hidden');
        elements.registerForm.classList.add('hidden');
    },

    // Mostrar formulário de registro
    showRegister() {
        elements.loginForm.classList.add('hidden');
        elements.registerForm.classList.remove('hidden');
    },

    // Mostrar formulário de tarefa
    showTaskForm() {
        elements.taskFormContainer.classList.remove('hidden');
        elements.taskForm.reset();
    },

    // Esconder formulário de tarefa
    hideTaskForm() {
        elements.taskFormContainer.classList.add('hidden');
    }
};

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Auth event listeners
    elements.loginBtn.addEventListener('click', UI.showLogin);
    elements.registerBtn.addEventListener('click', UI.showRegister);
    elements.showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        UI.showRegister();
    });
    elements.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        UI.showLogin();
    });
    elements.logoutBtn.addEventListener('click', Auth.logout);

    // Login form
    document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        await Auth.login(email, password);
    });

    // Register form
    document.getElementById('registerFormElement').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        await Auth.register(name, email, password);
    });

    // Task event listeners
    elements.addTaskBtn.addEventListener('click', UI.showTaskForm);
    elements.cancelTaskBtn.addEventListener('click', UI.hideTaskForm);

    // Task form
    elements.taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            priority: document.getElementById('taskPriority').value
        };
        
        await Tasks.addTask(taskData);
    });

    // Inicializar aplicação
    Auth.updateUI();
});