document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const itemsCount = document.getElementById('items-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    
    // Todo array
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Initialize the app
    function init() {
        renderTodos();
        updateItemsCount();
    }
    
    // Render todos based on current filter
    function renderTodos(filter = 'all') {
        todoList.innerHTML = '';
        
        let filteredTodos = [];
        
        switch(filter) {
            case 'active':
                filteredTodos = todos.filter(todo => !todo.completed);
                break;
            case 'completed':
                filteredTodos = todos.filter(todo => todo.completed);
                break;
            default:
                filteredTodos = todos;
        }
        
        if (filteredTodos.length === 0) {
            todoList.innerHTML = '<li class="empty-message">No tasks found</li>';
            return;
        }
        
        filteredTodos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.dataset.id = todo.id;
            
            todoItem.innerHTML = `
                <input type="checkbox" class="todo-checkbox" ${todo.completed ? 'checked' : ''}>
                <span class="todo-text">${todo.text}</span>
                <button class="delete-btn"><i class="fas fa-trash"></i></button>
            `;
            
            todoList.appendChild(todoItem);
        });
    }
    
    // Add new todo
    todoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const todoText = todoInput.value.trim();
        
        if (todoText) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                completed: false
            };
            
            todos.push(newTodo);
            saveTodos();
            renderTodos(getCurrentFilter());
            updateItemsCount();
            
            todoInput.value = '';
            todoInput.focus();
        }
    });
    
    // Handle todo actions (complete/delete)
    todoList.addEventListener('click', function(e) {
        const todoItem = e.target.closest('.todo-item');
        if (!todoItem) return;
        
        const todoId = parseInt(todoItem.dataset.id);
        const todoIndex = todos.findIndex(todo => todo.id === todoId);
        
        // Delete todo
        if (e.target.closest('.delete-btn')) {
            todos.splice(todoIndex, 1);
            saveTodos();
            renderTodos(getCurrentFilter());
            updateItemsCount();
        }
        // Toggle complete status
        else if (e.target.classList.contains('todo-checkbox')) {
            todos[todoIndex].completed = e.target.checked;
            saveTodos();
            todoItem.classList.toggle('completed', e.target.checked);
            updateItemsCount();
        }
    });
    
    // Filter todos
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active filter button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            renderTodos(filter);
        });
    });
    
    // Clear completed todos
    clearCompletedBtn.addEventListener('click', function() {
        todos = todos.filter(todo => !todo.completed);
        saveTodos();
        renderTodos(getCurrentFilter());
        updateItemsCount();
    });
    
    // Get current active filter
    function getCurrentFilter() {
        const activeFilter = document.querySelector('.filter-btn.active');
        return activeFilter ? activeFilter.dataset.filter : 'all';
    }
    
    // Update items count
    function updateItemsCount() {
        const activeCount = todos.filter(todo => !todo.completed).length;
        itemsCount.textContent = `${activeCount} ${activeCount === 1 ? 'item' : 'items'} left`;
    }
    
    // Save todos to localStorage
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    // Initialize the app
    init();
});