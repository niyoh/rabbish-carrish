import firebase, { todoRef, userTodoRef, ref } from './firebase'
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
  var todoId = todoRef.push(todoItem).key;

  var userTodoItem = {
    todoId: todoId
  };
  userTodoRef.child(userId).push(userTodoItem);

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

  todoRef.child(todoId).once('value').then((snapshot) => {
    var todoItem = snapshot.val();
    todoItem.todoDeadline = todoDeadline;

    var update = {};
    update['/todos/' + todoId] = todoItem;

    ref.update(update);

    res.json(todoItem);
    res.end();
  }).catch((error) => {
    console.log(error);
  });
});

router.delete('/todoItem/:todoId', (req, res) => {
  var todoId = req.params.todoId;

  todoRef.child(todoId).remove().then(() => {
    res.json({
      result: 'Success'
    });
    res.end();
  }).catch((error) => {
    res.json({
      result: 'Failed'
    });
    res.end();
  })
});

router.get('/todoItems/:userId', (req, res) => {
  var userId = req.params.userId;

  userTodoRef.child(userId).once('value', (snapshot) => {
    var promises = [];
    snapshot.forEach((childSnapshot) => {
      console.log(childSnapshot.key);
      console.log(childSnapshot.val().todoId);
      promises.push(todoRef.child(childSnapshot.val().todoId).once('value'));
    });

    Promise.all(promises).then((snapshots) => {
      var todoItems = [];
      for (var i in snapshots) {
        todoItems.push(snapshots[i].val());
      }

      res.json(todoItems);
      res.end();
    })
  });
});

export default router