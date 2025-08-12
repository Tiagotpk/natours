const express = require('express');

const createUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: 'All users data here',
    },
  });
};

const getUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: 'All users data here',
    },
  });
};
const getAllUsers = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: 'All users data here',
    },
  });
};
const updateUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: 'All users data here',
    },
  });
};
const deleteUser = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      users: 'All users data here',
    },
  });
};

const router = express.Router();

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
