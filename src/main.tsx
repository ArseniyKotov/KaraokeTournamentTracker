import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { Amplify } from 'aws-amplify'
import output from '../amplify_outputs.json'
import DataInitializer from './utils/DataInitializer'

Amplify.configure(output);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DataInitializer>
      <App />
    </DataInitializer>
  </React.StrictMode>
)
