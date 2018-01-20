import { EventEmitter } from 'events'
import firebase from 'firebase'
import path from 'path'

const AUTH_DOMAIN = process.env.AUTH_DOMAIN
const API_KEY = process.env.API_KEY
const FIREBASE_URL = process.env.FIREBASE_URL || 'https://todolist-c5f4d.firebaseio.com/'

if (!FIREBASE_URL) { throw new Error('FIREBASE_URL must be defined') }

const config = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: FIREBASE_URL,
  serviceAccount: path.join(__dirname, '../config/firebase', `service-worker-creds.${process.env.NODE_ENV === 'production' ? 'prod' : 'dev'}.json`)
}

firebase.initializeApp(config)

export const ref = firebase.database().ref()
export const todoRef = firebase.database().ref('todos')
export const userTodoRef = firebase.database().ref('user-todos')

const firebaseModule = new EventEmitter()

export default firebaseModule

ref.child('init').once('value', () => firebaseModule.emit('init'))
