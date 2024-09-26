const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');

router.get('/', todoController.getTodos);
router.post('/', todoController.addTodo);
router.put('/reorder', todoController.reorderTodos);  // 이 라인을 위로 옮겼습니다
router.put('/:id', todoController.toggleTodo);
router.patch('/:id', todoController.updateTodo);  // 새로운 업데이트 라우트
router.delete('/:id', todoController.deleteTodo);

module.exports = router;