import React from 'react';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, loading, onToggle, onDelete }) => {
  if (loading) {
    return (
      <div className="loading">
        <i className="fas fa-spinner fa-spin"></i>
        Carregando tarefas...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <i className="fas fa-clipboard-list"></i>
        <p>Nenhuma tarefa encontrada.</p>
        <p>Crie sua primeira tarefa clicando no botão "Nova Tarefa".</p>
      </div>
    );
  }

  return (
    <div className="tasks-list">
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;