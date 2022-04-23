const express = require('express');
const router = express.Router();

const User = require('../../models/User');

// @route GET api/user/test
// @description tests user route
// @access Public
router.get('/test', (req, res) => res.send('user route testing!'));

// @route GET api/user
// @description Get all users
// @access Public
router.get('/', (req, res) => {
    User.find()
      .then(users => res.json(users))
      .catch(err => res.status(404).json({ nousersfound: 'No Users found' }));
  });
  
// @route GET api/users/:id
// @description Get single user by id
// @access Public
router.get('/:id', (req, res) => {
  //Book.findById(req.params.id)
  //  .then(user => res.json(user))
  //  .catch(err => res.status(404).json({ nouserfound: 'No User found' }));
});

// @route GET api/users
// @description add/save user
// @access Public
router.post('/', (req, res) => {
  User.create(req.body)
    .then(book => res.json({ msg: 'User added successfully' }))
    .catch(err => res.status(400).json({ error: 'Unable to add this User' }));
});

// @route GET api/user/:id
// @description Update user
// @access Public
router.put('/:id', (req, res) => {
  User.findByIdAndUpdate(req.params.id, req.body)
    .then(user => res.json({ msg: 'Updated successfully' }))
    .catch(err =>
      res.status(400).json({ error: 'Unable to update the Database' })
    );
});

// @route GET api/users/:id
// @description Delete user by id
// @access Public
router.delete('/:id', (req, res) => {
  User.findByIdAndRemove(req.params.id, req.body)
    .then(user => res.json({ mgs: 'User deleted successfully' }))
    .catch(err => res.status(404).json({ error: 'No such a user' }));
});

module.exports = router;