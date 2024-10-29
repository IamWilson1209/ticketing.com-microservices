import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
  req.session = null;
  res.clearCookie('session');
  res.send({});
  console.log('User signed out');
});

export { router as signoutRouter };