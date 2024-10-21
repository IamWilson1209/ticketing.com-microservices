import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
  return currentUser ? <h1>You are sign in</h1> : <h1>Not authorized</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log('LandingPage getInitialProps');
  const client = buildClient(context);
  const { data } = await client.get('/api/users/currentuser');

  return data;
};

export default LandingPage;
