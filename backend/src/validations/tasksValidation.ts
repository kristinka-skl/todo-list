import { Joi, Segments } from "celebrate";
import { isValidObjectId } from "mongoose";

const DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/;

export const createTaskSchema = {
    [Segments.BODY]: Joi.object({
        name: Joi.string().trim().min(1).max(96).required(),
        date: Joi.string()
            .pattern(DATE_REGEXP) 
            .required()
            .custom((value: string, helpers: Joi.CustomHelpers): string | Joi.ErrorReport => {
                
                const now = new Date();
                const year = now.getFullYear();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                
                const today: string = `${year}-${month}-${day}`; 
                
                if (value < today) {
                    return helpers.message({ custom: `Date must be ${today} or later` });
                }
                return value; 
            })
            .messages({
                'string.pattern.base': 'Date format must be YYYY-MM-DD',
                'any.required': 'Date is required'
            }),
        isDone: Joi.boolean().default(false),
    })
};

export const taskIdSchema = {
  [Segments.PARAMS]: Joi.object({
    taskId: Joi.string()
      .trim()
      .custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.message({ custom: 'Invalid id format' });
        }
        return value;
      })
      .required(),
  })
};

export const updateTaskStatusSchema = {
    ...taskIdSchema,
    [Segments.BODY]: Joi.object({
        isDone: Joi.boolean().required(),
    })
};