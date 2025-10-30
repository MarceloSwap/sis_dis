import Task from '../models/Task';

class TaskController {
    async create(req, res) {
        try {
            const task = new Task({
                title: req.body.title,
                description: req.body.description,
                priority: req.body.priority || 'media',
                done: req.body.done || false,
                completed: req.body.completed || false,
                user: req.user._id
            });
            await task.save();
            res.status(201).json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async list(req, res) {
        try {
            const tasks = await Task.find({ user: req.user._id });
            res.json({ tasks });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async toggle(req, res) {
        try {
            const task = await Task.findOne({
                _id: req.params.task_id,
                user: req.user._id
            });
            
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
            
            task.completed = !task.completed;
            task.done = task.completed;
            
            if (task.completed) {
                task.completedAt = new Date();
            } else {
                task.completedAt = null;
            }
            
            await task.save();
            
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async get(req, res) {
        try {
            const task = await Task.findOne({
                _id: req.params.task_id,
                user: req.user._id
            });
            
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
            
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async remove(req, res) {
        try {
            const task = await Task.findOneAndDelete({
                _id: req.params.task_id,
                user: req.user._id
            });
            
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
            
            res.json({ message: 'Tarefa excluída com sucesso' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async done(req, res) {
        try {
            const task = await Task.findOneAndUpdate(
                { _id: req.params.task_id, user: req.user._id },
                { done: true },
                { new: true }
            );
            
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
            
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async todo(req, res) {
        try {
            const task = await Task.findOneAndUpdate(
                { _id: req.params.task_id, user: req.user._id },
                { done: false },
                { new: true }
            );
            
            if (!task) {
                return res.status(404).json({ error: 'Tarefa não encontrada' });
            }
            
            res.json(task);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

export default new TaskController();