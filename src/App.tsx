import React, { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

interface Todo {
  id: number;
  text: string;
  isCompleted: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState<string>('');

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    const newTodo: Todo = {
      id: Date.now(),
      text: inputValue,
      isCompleted: false,
    };
    setTodos([newTodo, ...todos]);
    setInputValue('');
  };

  const toggleTodoCompletion = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEditing = (id: number, text: string) => {
    setEditingTodoId(id);
    setEditingText(text);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditingText(e.target.value);
  };

  const submitEdit = (id: number) => {
    if (editingText.trim() === '') {
        deleteTodo(id);
    } else {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, text: editingText } : todo
            )
        );
    }
    setEditingTodoId(null);
    setEditingText('');
  };
  
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
      submitEdit(id);
    } else if (e.key === 'Escape') {
      setEditingTodoId(null);
      setEditingText('');
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.isCompleted;
    if (filter === 'completed') return todo.isCompleted;
    return true;
  });

  return (
    <div className="App">
      <div className="container">
        <motion.h1 
          className="my-4 text-white"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          To-Do List
        </motion.h1>
        <motion.div 
          className="card shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="card-body">
            <form onSubmit={handleFormSubmit} className="mb-3 d-flex">
              <input
                type="text"
                className="form-control me-2"
                placeholder="Add a new task..."
                value={inputValue}
                onChange={handleInputChange}
              />
              <button type="submit" className="btn btn-primary">Add</button>
            </form>
            <div className="filters btn-group mb-3">
              <button className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('all')}>All</button>
              <button className={`btn ${filter === 'active' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('active')}>Active</button>
              <button className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-secondary'}`} onClick={() => setFilter('completed')}>Completed</button>
            </div>
            <ul className="list-group">
              <AnimatePresence>
                {filteredTodos.map(todo => (
                  <motion.li
                    key={todo.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                    className={`list-group-item d-flex justify-content-between align-items-center`}
                  >
                    {editingTodoId === todo.id ? (
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={editingText}
                        onChange={handleEditChange}
                        onBlur={() => submitEdit(todo.id)}
                        onKeyDown={(e) => handleEditKeyDown(e, todo.id)}
                        autoFocus
                      />
                    ) : (
                      <motion.span
                        onClick={() => toggleTodoCompletion(todo.id)}
                        onDoubleClick={() => startEditing(todo.id, todo.text)}
                        className={`task-text ${todo.isCompleted ? 'completed' : ''}`}
                        whileHover={{ scale: 1.02 }}
                      >
                        {todo.text}
                      </motion.span>
                    )}
                    <motion.button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => deleteTodo(todo.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      Delete
                    </motion.button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;
