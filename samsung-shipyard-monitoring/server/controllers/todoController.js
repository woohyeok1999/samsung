const fs = require('fs').promises;
const path = require('path');

const TODO_DATA_PATH = path.join(__dirname, '..', '..', 'data', 'todos.json');

exports.getTodos = async (req, res) => {
    try {
        const data = await fs.readFile(TODO_DATA_PATH, 'utf8');
        const todos = JSON.parse(data);
        res.json(todos);
    } catch (error) {
        console.error('Error reading todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.addTodo = async (req, res) => {
    try {
        const { text } = req.body;
        const data = await fs.readFile(TODO_DATA_PATH, 'utf8');
        const todos = JSON.parse(data);
        const newTodo = { id: Date.now(), text, completed: false };
        todos.push(newTodo);
        await fs.writeFile(TODO_DATA_PATH, JSON.stringify(todos));
        res.status(201).json(newTodo);
    } catch (error) {
        console.error('Error adding todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.deleteTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readFile(TODO_DATA_PATH, 'utf8');
        let todos = JSON.parse(data);
        todos = todos.filter(todo => todo.id !== parseInt(id));
        await fs.writeFile(TODO_DATA_PATH, JSON.stringify(todos));
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.toggleTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await fs.readFile(TODO_DATA_PATH, 'utf8');
        let todos = JSON.parse(data);
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
        if (todoIndex !== -1) {
            todos[todoIndex].completed = !todos[todoIndex].completed;
            await fs.writeFile(TODO_DATA_PATH, JSON.stringify(todos));
            res.json(todos[todoIndex]);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        console.error('Error toggling todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.reorderTodos = async (req, res) => {
    console.log('Reorder route hit');
    try {
        const { todos } = req.body;

        // 받은 todos 배열의 유효성 검사
        if (!Array.isArray(todos) || todos.length === 0) {
            return res.status(400).json({ error: 'Invalid todos data' });
        }

        // todos.json 파일에 새로운 순서로 저장
        await fs.writeFile(TODO_DATA_PATH, JSON.stringify(todos, null, 2));

        res.json({ message: 'Todos reordered and saved successfully', todos });
    } catch (error) {
        console.error('Error reordering todos:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

exports.updateTodo = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const data = await fs.readFile(TODO_DATA_PATH, 'utf8');
        let todos = JSON.parse(data);
        const todoIndex = todos.findIndex(todo => todo.id === parseInt(id));
        if (todoIndex !== -1) {
            todos[todoIndex].text = text;
            await fs.writeFile(TODO_DATA_PATH, JSON.stringify(todos));
            res.json(todos[todoIndex]);
        } else {
            res.status(404).json({ error: 'Todo not found' });
        }
    } catch (error) {
        console.error('Error updating todo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};