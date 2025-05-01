/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Authenticator>
      {({ signOut, user }) => (
        <Layout>
          <HomePage />
        </Layout>
      )}
    </Authenticator>
  );
}

export default App;
