import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './TodoList.css';

const TodoItem = ({ todo, index, handleCheckboxChange, toggleTodo, selectedTodos, startEditing, isEditing, handleEditChange, saveEdit }) => (
    <Draggable key={todo.id.toString()} draggableId={todo.id.toString()} index={index}>
        {(provided) => (
            <li 
                ref={provided.innerRef} 
                {...provided.draggableProps} 
                {...provided.dragHandleProps}
                className="todo-item"
            >
                <span className="todo-number">{index + 1}</span>
                <input
                    type="checkbox"
                    checked={selectedTodos.includes(todo.id)}
                    onChange={() => handleCheckboxChange(todo.id)}
                    className="todo-checkbox"
                    disabled={todo.completed}
                />
                {isEditing === todo.id ? (
                    <input
                        type="text"
                        value={todo.text}
                        onChange={(e) => handleEditChange(e, todo.id)}
                        className="todo-edit-input"
                    />
                ) : (
                    <span 
                        className={`todo-text ${todo.completed ? 'completed' : ''}`}
                        onClick={() => toggleTodo(todo.id)}
                    >
                        {todo.text}
                    </span>
                )}
                {isEditing === todo.id ? (
                    <button onClick={() => saveEdit(todo.id)}>저장</button>
                ) : (
                    <button onClick={() => startEditing(todo.id)} disabled={todo.completed}>수정</button>
                )}
            </li>
        )}
    </Draggable>
);

const TodoList = () => {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState('');
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [isEditing, setIsEditing] = useState(null);

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const response = await axios.get('https://localhost:5000/api/todo');
            setTodos(response.data);
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const addTodo = async (e) => {
        e.preventDefault();
        if (!newTodo.trim()) return;
        try {
            await axios.post('https://localhost:5000/api/todo', { text: newTodo });
            setNewTodo('');
            fetchTodos();
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id) => {
        try {
            await axios.put(`https://localhost:5000/api/todo/${id}`);
            fetchTodos();
        } catch (error) {
            console.error('Error toggling todo:', error);
        }
    };

    const deleteTodos = async () => {
        try {
            await Promise.all(selectedTodos.map(id => 
                axios.delete(`https://localhost:5000/api/todo/${id}`)
            ));
            setSelectedTodos([]);
            fetchTodos();
        } catch (error) {
            console.error('Error deleting todos:', error);
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedTodos(prev => 
            prev.includes(id) ? prev.filter(todoId => todoId !== id) : [...prev, id]
        );
    };

    const startEditing = (id) => {
        setIsEditing(id);
    };

    const handleEditChange = (e, id) => {
        const newTodos = todos.map(todo =>
            todo.id === id ? { ...todo, text: e.target.value } : todo
        );
        setTodos(newTodos);
    };

    const saveEdit = async (id) => {
        try {
            const todoToSave = todos.find(todo => todo.id === id);
            await axios.patch(`https://localhost:5000/api/todo/${id}`, { text: todoToSave.text });
            setIsEditing(null);
            fetchTodos();
        } catch (error) {
            console.error('Error saving todo:', error);
        }
    };

    const onDragEnd = async (result) => {
        if (!result.destination) return;
    
        const items = Array.from(todos);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
    
        setTodos(items);
    
        try {
            const response = await axios.put('https://localhost:5000/api/todo/reorder', { todos: items });
            if (response.data && response.data.todos) {
                setTodos(response.data.todos);
            }
        } catch (error) {
            console.error('Error reordering todos:', error);
            fetchTodos();  // 에러 발생 시 원래 상태로 되돌림
        }
    };

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <h2>Today's CheckList</h2>
            <form onSubmit={addTodo} className="todo-form">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="새로운 할 일 추가"
                    className="todo-input"
                />
                <button type="submit" className="add-btn">추가</button>
            </form>
            {todos.length > 0 && (
                <Droppable droppableId="todos">
                    {(provided) => (
                        <ul {...provided.droppableProps} ref={provided.innerRef} className="todo-items">
                            {todos.map((todo, index) => (
                                <TodoItem 
                                    key={todo.id}
                                    todo={todo}
                                    index={index}
                                    handleCheckboxChange={handleCheckboxChange}
                                    toggleTodo={toggleTodo}
                                    selectedTodos={selectedTodos}
                                    startEditing={startEditing}
                                    isEditing={isEditing}
                                    handleEditChange={handleEditChange}
                                    saveEdit={saveEdit}
                                />
                            ))}
                            {provided.placeholder}
                        </ul>
                    )}
                </Droppable>
            )}
            <button onClick={deleteTodos} className="delete-btn" disabled={selectedTodos.length === 0}>
                선택 항목 삭제
            </button>
        </DragDropContext>
    );
};
export default TodoList;
