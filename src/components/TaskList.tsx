import React, { useState, useRef } from 'react';
import { Task } from '../types/types';
import TaskItem from './TaskItem';
import Header from './Header';
import { useLocalStorage } from '../hooks/useLocalStorage';

const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const TaskList: React.FC = () => {
    const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [filter, setFilter] = useState<'all' | 'active' | 'completed' | ''>('all');
    const [sortOrder, setSortOrder] = useState<'local' | 'asc' | 'desc'>('local');
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [dropPosition, setDropPosition] = useState<number | null>(null);
    const tasksRef = useRef<HTMLDivElement>(null);

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: generateId(),
            title: newTaskTitle,
            completed: false,
            createdAt: new Date(),
            orderIndex: tasks.length,
        };
        setTasks((prevTasks) => [...prevTasks, newTask]);
        setNewTaskTitle('');
    };

    const toggleComplete = (id: string) => {
        setTasks((prevTasks) =>
            prevTasks.map((task) =>
                task.id === id ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    };

    const clearCompletedTasks = () => {
        setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
    };

    const sortByCreatedDate = () => {
        setTasks((prevTasks) => {
            const sortedTasks = [...prevTasks].sort((a, b) =>
                sortOrder === 'asc' ? a.createdAt.getTime() - b.createdAt.getTime() : b.createdAt.getTime() - a.createdAt.getTime()
            );
            return sortedTasks.map((task, index) => ({ ...task, orderIndex: index }));
        });
    };

    const onDragStart = (index: number) => setDraggingIndex(index);

    const onDragOver = (e: React.DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggingIndex !== null && draggingIndex !== index) {
            setDropPosition(index);
        }
    };

    const onDragEnd = () => {
        if (draggingIndex !== null && dropPosition !== null && draggingIndex !== dropPosition) {
            setTasks((prevTasks) => {
                const updatedTasks = [...prevTasks];
                const [movedTask] = updatedTasks.splice(draggingIndex, 1);
                updatedTasks.splice(dropPosition, 0, movedTask);

                return updatedTasks.map((task, index) => ({ ...task, orderIndex: index }));
            });
        }
        setSortOrder('local');
        setDraggingIndex(null);
        setDropPosition(null);
    };

    const filteredTasks = tasks.filter((task) => {
        if (filter === 'completed') return task.completed;
        if (filter === 'active') return !task.completed;
        return true;
    });

    const sortedTasks = sortOrder === 'local'
        ? filteredTasks.sort((a, b) => a.orderIndex - b.orderIndex)
        : filteredTasks.sort((a, b) =>
            sortOrder === 'asc'
                ? a.createdAt.getTime() - b.createdAt.getTime()
                : b.createdAt.getTime() - a.createdAt.getTime()
        );

    return (
        <div className="max-w-lg mx-auto mt-10 p-4 border rounded shadow">
            <h1 className="text-3xl text-white font-bold mb-4 text-center">Todo List</h1>
            <Header
                newTaskTitle={newTaskTitle}
                setNewTaskTitle={setNewTaskTitle}
                addTask={addTask}
                filter={filter}
                setFilter={setFilter}
                clearCompletedTasks={clearCompletedTasks}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
                sortByCreatedDate={sortByCreatedDate}
            />
            <div ref={tasksRef} className="space-y-1">
                {sortedTasks.map((task, index) => (
                    <div
                        key={task.id}
                        draggable
                        onDragStart={() => onDragStart(index)}
                        onDragOver={(e) => onDragOver(e, index)}
                        onDragEnd={onDragEnd}
                        className="border-b last:border-none transition duration-300 relative"
                        style={{ opacity: draggingIndex === index ? 0.5 : 1 }}
                    >
                        {dropPosition === index && (
                            <div className="placeholder h-8 border-dashed border-2 border-gray-300 my-4"></div>
                        )}
                        <TaskItem
                            task={task}
                            toggleComplete={toggleComplete}
                            deleteTask={deleteTask}
                        />
                    </div>
                ))}
                {draggingIndex !== null && dropPosition === sortedTasks.length && (
                    <div className="placeholder h-8 border-dashed border-2 border-gray-300 my-4"></div>
                )}
            </div>
        </div>
    );
};

export default TaskList;
