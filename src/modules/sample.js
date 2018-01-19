import firebase, { ref } from './firebase'

const init = () => {
  console.log('sample module init 1')
  ref.child('init').once('value')
    .then(() => console.log('sample module init 2'))
}

firebase.once('init', init)


// app.get('/writeToFirebase', (req, res) => {

  var update = {};
  update['/posts/' + 888 + '/lastNotificationTimestamp'] = 123;
  update['/user-posts/' + 111 + '/' + 222 + '/lastNotificationTimestamp'] = 456;
  ref.update(update);

// res.end('hello world')
// })