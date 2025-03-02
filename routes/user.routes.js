import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({error: "Usuario no encontrado"});
         res.json(user);
    } catch (error) {
        res.status(500).json({error: error.message});
    }    
});

router.post("/", async (req, res) => {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
  
      await user.update(req.body);
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router; 