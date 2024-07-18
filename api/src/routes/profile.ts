import { Router } from 'express';
import { UserRepository } from '../libs/db';

const router = Router();
// Create
router.post('', async (req, res) => {
  const user = UserRepository.create(req.body);
  const result = await UserRepository.save(user);
  return res.send(result);
});

// Read
router.get('', async (_req, res) => {
  const users = await UserRepository.find();
  return res.send(users);
});

// Read by ID
router.get('/:id', async (req, res) => {
  const user = await UserRepository.findOneBy({ id: parseInt(req.params.id, 10) });
  if (user) {
    return res.send(user);
  }
  const newUser = UserRepository.create({ id: parseInt(req.params.id, 10), email: '', phone: '', username: '' });
  const result = await UserRepository.save(newUser);
  return res.send(result);
});

// Update
router.put('/:id', async (req, res) => {
  const user = await UserRepository.findOneBy({ id: parseInt(req.params.id, 10) });
  if (user) {
    UserRepository.merge(user, req.body);
    const result = await UserRepository.save(user);
    return res.send(result);
  }
  return res.status(404).send({ message: 'User not found' });
});

// Delete
router.delete('/:id', async (req, res) => {
  const result = await UserRepository.delete(req.params.id);
  return res.send(result);
});

export default router;
