import React from 'react';
import {
  useAuthUser,
  withAuthUser,
  withAuthUserTokenSSR,
} from 'next-firebase-auth';
import Header from '../components/Header';
import DemoPageLinks from '../components/DemoPageLinks';
import {
  Box,
} from '@chakra-ui/react';

const styles = {
  content: {
    padding: 32,
  },
  infoTextContainer: {
    marginBottom: 32,
  },
}

const Home = () => {
  const AuthUser = useAuthUser()


  return (
    <>
      <Header email={AuthUser.email} 
      signOut={AuthUser.signOut} />
      <Box p={4}>Final Data-Driven Full-Stack App</Box>
     
      {/* <div style={styles.content}>
        <div style={styles.infoTextContainer}>
          
         
          <a href="/todo" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add a Todo!</a>          
        </div>
        <div>
         <a href="/events" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add an Event!</a>
        </div>
        <div>
        <a href="/contacts" style={{ fontSize: "40px", textDecoration: 'underline' }}>Add an Contact!</a>
        </div>
        <DemoPageLinks />
      </div> */}
    </>
  );
}

export const getServerSideProps = withAuthUserTokenSSR()()

export default withAuthUser()(Home)
