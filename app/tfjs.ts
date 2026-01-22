import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-wasm'
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm'

let initialized = false

export async function initTF() {
  setWasmPaths('/tfjs/') 
  
  if (initialized) return

  await tf.setBackend('wasm')
  await tf.ready()

  initialized = true
  console.log('TFJS backend:', tf.getBackend())
}
