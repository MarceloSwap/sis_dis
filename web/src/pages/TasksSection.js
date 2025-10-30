import React, { useState, useEffect } from 'react';
import TaskForm from '../components/TaskForm';
import TaskList from '../components/TaskList';
import api from '../services/api';

const TasksSection = ({ showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      setTasks(response.data.tasks || []);
    } catch (error) {
      showToast('Erro ao carregar tarefas', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      await api.post('/tasks', taskData);
      showToast('Tarefa criada com sucesso!', 'success');
      setShowForm(false);
      loadTasks();
    } catch (error) {
      showToast('Erro ao criar tarefa', 'error');
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      showToast('Status da tarefa atualizado!', 'success');
      loadTasks();
    } catch (error) {
      showToast('Erro ao atualizar tarefa', 'error');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      return;
    }

    try {
      await api.delete(`/tasks/${taskId}`);
      showToast('Tarefa excluída com sucesso!', 'success');
      loadTasks();
    } catch (error) {
      showToast('Erro ao excluir tarefa', 'error');
    }
  };

  return (
    <section className="tasks-section">
      <div className="container">
        <div className="tasks-header">
          <h2>Minhas Tarefas</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowForm(!showForm)}
          >
            <i className="fas fa-plus"></i>
            Nova Tarefa
          </button>
        </div>

        {showForm && (
          <TaskForm 
            onSubmit={handleAddTask}
            onCancel={() => setShowForm(false)}
          />
        )}

        <TaskList 
          tasks={tasks}
          loading={loading}
          onToggle={handleToggleTask}
          onDelete={handleDeleteTask}
        />
      </div>
    </section>
  );
};

export default TasksSection;