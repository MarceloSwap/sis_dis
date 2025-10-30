import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
const validator = require('express-joi-validation').createValidator({ passError: true });

import taskController from './controllers/tasks';
import userController from './controllers/users';
import taskSchema from './schemas/task';
import userSchema from './schemas/user';
import 'dotenv/config';
import authMiddleware from './middlewares/auth';

const app = express();

// Middlewares
app.use(cors({
    origins: ['*'],
    methods: ['*'],
    allowedHeaders: ['*']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Rotas públicas
app.post('/users', validator.body(userSchema.user), userController.create);
app.post('/sessions', validator.body(userSchema.auth), userController.auth);

// Rotas de autenticação (compatibilidade com frontend)
app.post('/auth/register', validator.body(userSchema.user), userController.create);
app.post('/auth/login', validator.body(userSchema.auth), userController.auth);

// Middleware de autenticação
app.use(authMiddleware);

// Rotas protegidas
app.get('/tasks', taskController.list);
app.get('/tasks/:task_id', validator.params(taskSchema.task_id), taskController.get);
app.delete('/tasks/:task_id', validator.params(taskSchema.task_id), taskController.remove);
app.post('/tasks', validator.body(taskSchema.task), taskController.create);
app.put('/tasks/:task_id/done', validator.params(taskSchema.task_id), taskController.done);
app.put('/tasks/:task_id/todo', validator.params(taskSchema.task_id), taskController.todo);
app.patch('/tasks/:task_id/toggle', validator.params(taskSchema.task_id), taskController.toggle);

const port = 3333;

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString()
        });
    } else if (err) {
        res.status(400).json({
            type: err.type
        });
    } else {
        next(err);
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Api do SisDis online na porta: ${port}`);
});

module.exports = app;