import express from 'express';
import { User } from '../models/User.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all users
router.get('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
    });
    
    return res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get user by ID
router.get('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Create new user
router.post('/', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    
    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user
router.put('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const { name, email, role, active, password } = req.body;
    
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Check if email is unique if it's being changed
    if (email !== user.email) {
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }
    
    // Update user fields
    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    
    if (active !== undefined) {
      user.active = active;
    }
    
    if (password) {
      user.password = password;
    }
    
    await user.save();
    
    return res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active,
    });
  } catch (error) {
    console.error('Update user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/:id', authenticate, authorize(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    await user.destroy();
    
    return res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.json(user);
  } catch (error) {
    console.error('Get current user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;