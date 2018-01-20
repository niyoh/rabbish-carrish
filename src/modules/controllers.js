import firebase, { todoRef, ref } from './firebase'
import express from 'express'

const init = () => {
  console.log('sample module init 1')
  ref.child('init').once('value')
    .then(() => console.log('sample module init 2'))
}

const router = express.Router()

firebase.once('init', init)


router.post('/todoItem/:userId/:todoName/:todoDeadline', (req, res) => {
  var userId = req.params.userId;
  var todoName = req.params.todoName;
  var todoDeadline = req.params.todoDeadline;

  var todoItem = {
    userId: userId,
    todoName: todoName,
    todoDeadline: todoDeadline,
    createdTime: Date.now()
  };
  var todoId = ref.child('todos').push(todoItem).key;

  res.json({
    todoId: todoId
  })
});

router.get('/todoItem/:todoId', (req, res) => {
  var todoId = req.params.todoId;

  todoRef.child(todoId).once('value').then((snapshot) => {
    var todoItem = snapshot.val();
    res.json(todoItem);
    res.end();
  });
});

router.put('/todoItem/:todoId/:todoDeadline', (req, res) => {
  var todoId = req.params.todoId;
  var todoDeadline = req.params.todoDeadline;

  console.log('on9');
  ref.set("I'm writing data")
    .then(function(){
      console.log("Data saved successfully.");
    })
    .catch(function(error){
      console.log("Data could not be saved." + error);
    });

  todoRef.child(todoId).once('value').then((todoItem) => {
    todoItem.todoDeadline = todoDeadline;

    var update = {};
    update['/todos/' + todoId] = todoItem;

    ref.update(update, function(error) {
      console.log('damn it');
    });

    res.json(todoRef.child(todoId));
    res.end();
  });
});

router.delete('/todoItem/:todoId', (req, res) => {
  var todoId = req.params.todoId;
  console.log('fucking shit');
  todoRef.child(todoId).remove().then(function() {
    console.log('shit');
  })
});

export default router