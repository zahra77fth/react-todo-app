import React from 'react';
import { Task } from '../types/types';
import { FiCheck } from 'react-icons/fi';

const getHumanizedCreatedDate = (createdAt: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
};

interface TaskItemProps {
    task: Task;
    toggleComplete: (id: string) => void;
    deleteTask: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, toggleComplete, deleteTask }) => (
    <div className="flex items-center justify-between p-4 border border-gray-300 bg-gray-800 hover:bg-purple-900 transition duration-300 rounded">
        <div className="flex items-center space-x-4">
            <button
                onClick={() => toggleComplete(task.id)}
                className={`w-6 h-6 flex items-center justify-center border-2 rounded-full transition ${
                    task.completed ? 'bg-purple-500 border-purple-500' : 'border-gray-300'
                }`}
            >
                {task.completed && <FiCheck className="text-white" />}
            </button>
            <div className="flex flex-col">
                <span className={`text-lg ${task.completed ? 'line-through text-gray-300' : 'text-gray-100'}`}>
                    {task.title}
                </span>
                <span className="text-gray-500 text-sm">{getHumanizedCreatedDate(task.createdAt)}</span>
            </div>
        </div>
        <button
            onClick={() => deleteTask(task.id)}
            className="text-red-500 hover:text-red-700 transition duration-300"
        >
            Delete
        </button>
    </div>
);

export default TaskItem;
