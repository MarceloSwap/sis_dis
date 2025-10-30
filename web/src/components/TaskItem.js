import React from 'react';

const TaskItem = ({ task, onToggle, onDelete }) => {
  const getPriorityClass = (priority) => {
    return `priority-${priority}`;
  };

  const getPriorityLabel = (priority) => {
    const labels = {
      baixa: 'Baixa',
      media: 'Média',
      alta: 'Alta'
    };
    return labels[priority] || priority;
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${getPriorityClass(task.priority)}`}>
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <span className={`task-priority ${task.priority}`}>
          {getPriorityLabel(task.priority)}
        </span>
      </div>
      
      {task.description && (
        <p className="task-description">{task.description}</p>
      )}
      
      <div className="task-meta">
        <span className="task-date">
          Criada em: {new Date(task.createdAt).toLocaleDateString('pt-BR')}
        </span>
        {task.completed && task.completedAt && (
          <span className="task-completed-date">
            Concluída em: {new Date(task.completedAt).toLocaleDateString('pt-BR')}
          </span>
        )}
      </div>
      
      <div className="task-actions">
        {!task.completed ? (
          <button 
            className="btn btn-success" 
            onClick={() => onToggle(task._id)}
          >
            <i className="fas fa-check"></i>
            Concluir
          </button>
        ) : (
          <button 
            className="btn btn-outline" 
            onClick={() => onToggle(task._id)}
          >
            <i className="fas fa-undo"></i>
            Reabrir
          </button>
        )}
        <button 
          className="btn btn-danger" 
          onClick={() => onDelete(task._id)}
        >
          <i className="fas fa-trash"></i>
          Excluir
        </button>
      </div>
    </div>
  );
};

export default TaskItem;