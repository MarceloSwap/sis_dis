import Joi from 'joi';

const taskSchema = {
    task: Joi.object({
        title: Joi.string().required().messages({
            'string.empty': 'Título é obrigatório',
            'any.required': 'Título é obrigatório'
        }),
        description: Joi.string().optional().allow(''),
        priority: Joi.string().valid('baixa', 'media', 'alta').default('media'),
        done: Joi.boolean().default(false),
        completed: Joi.boolean().default(false)
    }),
    
    task_id: Joi.object({
        task_id: Joi.string().hex().length(24).required().messages({
            'string.hex': 'ID da tarefa deve ser um ObjectId válido',
            'string.length': 'ID da tarefa deve ter 24 caracteres',
            'any.required': 'ID da tarefa é obrigatório'
        })
    })
};

export default taskSchema;