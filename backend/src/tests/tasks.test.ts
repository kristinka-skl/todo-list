import app from '../app';
import supertest from 'supertest';
import { clearDatabase, closeDatabase, connectDatabase } from './db';
import { describe, beforeAll, afterEach, afterAll, test, expect } from '@jest/globals';
import { format } from 'date-fns';

const request = supertest(app);

describe('Test request with mongoose', () => {
   beforeAll(async () => await connectDatabase());
   afterEach(async () => await clearDatabase());
   afterAll(async () => await closeDatabase());

   test('GET - /api/tasks', async () => {
      const task = {
         name: "Hello world",
         date: format(new Date(), 'yyyy-dd-mm')
      };
      await request.post('/api/tasks').send(task);

      const res = await request.get('/api/tasks').send();

      const body = res.body;
      expect(res.statusCode).toBe(200);
      expect(body[0].name).toBe(task.name);
      expect(body[0].date).toBe(task.date);
      expect(body[0].isDone).toBe(false);
   });

   test('PATCH - /api/tasks/:id', async () => {
      const task = {
         name: "Hello world",
         date: format(new Date(), 'yyyy-dd-mm')
      };
      const createdTask = await request.post('/api/tasks').send(task);

      await request.patch(`/api/tasks/${createdTask.body._id}`).send({ isDone: true });

      const res = await request.get('/api/tasks').send();
      const actualTask = res.body[0];

      expect(res.statusCode).toBe(200);
      expect(actualTask.name).toBe(task.name);
      expect(actualTask.date).toBe(task.date);
      expect(actualTask.isDone).toBe(true);
   });

   test('POST - /api/tasks - date is required', async () => {
      const task = {
         name: "Hello world"
      };
      const res = await request.post('/api/tasks').send(task);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
   });

   test('POST - /api/tasks - date should be in the future', async () => {
      const task = {
         name: "Hello world",
         date: '1950-01-01'
      };
      const res = await request.post('/api/tasks').send(task);

      console.log(res.body);
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
   });
})
