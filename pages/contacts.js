import React, { useState, useEffect } from 'react';
import {
    // Container,
    Flex,
    // Box,
    Heading,
    Text,
    IconButton,
    Button,
    // VStack,
    // HStack,
    // Wrap,
    // WrapItem,
    // FormControl,
    // FormLabel,
    Input,
    InputGroup,
    InputLeftElement,
    // Textarea,
    Divider,
    Link,
  } from '@chakra-ui/react';
  import { AddIcon, DeleteIcon, StarIcon } from "@chakra-ui/icons";
  // import {
  //   MdPhone,
  //   MdEmail,
  //   MdLocationOn,
  //   MdFacebook,
  //   MdOutlineEmail,
  //   MdOutlinePhonelink,
  //   MdOutlinePhoneInTalk,
  // } from 'react-icons/md';
  // import { BsGithub, BsDiscord, BsPerson } from 'react-icons/bs';
  import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../components/Header';

const Contact = () => {
    const AuthUser = useAuthUser();
  const [inputName, setInputName] = useState('');
  const [inputEmail, setInputEmail] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [inputPhone, setInputPhone] = useState('');
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    AuthUser.id &&
      firebase
        .firestore()
        .collection("contacts")
        .where( 'user', '==', AuthUser.id )
        .onSnapshot(
          snapshot => {
            setContacts(
              snapshot.docs.map(
                doc => {
                  return {
                    contactID: doc.id,
                    contactName: doc.data().name,
                    contactEmail: doc.data().email,
                    contactPhone: doc.data().phone  ,
                    contactMessage: doc.data().message                  
                  }
                }
              )
            );
          }
        )
  })

  const sendData = () => {
    try {
      // try to update doc
      firebase
        .firestore()
        .collection("contacts") // all users will share one collection
        .add({
          name: inputName,
          email: inputEmail,
          phone: inputPhone,
          message: inputMessage,
          user: AuthUser.id
        })
        .then(console.log('Data was successfully sent to cloud firestore!'));
      // flush out the user-entered values in the input elements onscreen
      setInputName('');
      setInputEmail('');
      setInputPhone('');
      setInputMessage('');

    } catch (error) {
      console.log(error)
    }
  }

  const deleteContact = (t) => {
    try {
      firebase
        .firestore()
        .collection("contacts")
        .doc(t)
        .delete()
        .then(console.log('Data was successfully deleted!'));
    } catch (error) {
      console.log(error)
    }
  };


  return (
    <>
    <Header
        email={AuthUser.email}
        signOut={AuthUser.signOut} />
    <Flex flexDir="column" maxW={800} align="center" justify="start" minH="100vh" m="auto" px={4} py={3}>
      <Flex justify="space-between" w="100%" align="center">
        <Heading mb={4}>Welcome, {AuthUser.email}!</Heading>
        <Flex>
          
          <IconButton ml={2} onClick={AuthUser.signOut} icon={<StarIcon />} />
        </Flex>
      </Flex>

      <InputGroup>
        <InputLeftElement
          pointerEvents="none"
          children={<AddIcon color="gray.300" />}
        />
        <Input type="text" value={inputName} onChange={(e) => setInputName(e.target.value)} placeholder="Contact Name" />
        <Input type="text" value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} placeholder="Contact Email" />
        <Input type="text" value={inputPhone} onChange={(e) => setInputPhone(e.target.value)} placeholder="Contact Phone" />
        <Input type="text" value={inputMessage} onChange={(e) => setInputMessage(e.target.value)} placeholder="Contact Message" />
        <Button
          ml={2}
          onClick={() => sendData()}
        >
          Add
        </Button>
      </InputGroup>

      {contacts.map((item, i) => {
        return (
          <React.Fragment key={i}>
            {i > 0 && <Divider />}
            <Flex
              w="100%"
              p={5}
              my={2}
              align="center"
              borderRadius={5}
              justifyContent="space-between"
            >
              <Flex align="center">
                <Text fontSize="xl" mr={4}>{i + 1}.</Text>
                <Text>
                <Link href={'/contacts/' + item.contactID}>
               {item.contactName}</Link>
                  </Text>
                <Text>... {item.contactEmail}</Text>
                <Text>... {item.contactPhone}</Text>
                <Text>... {item.contactMessage}</Text>
              </Flex>
              <IconButton onClick={() => deleteContact(item.contactID)} icon={<DeleteIcon />} />
            </Flex>
          </React.Fragment>
        )
      })}
    </Flex>
    </>
  )
}
  export const getServerSideProps = withAuthUserTokenSSR({
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN,
  })(async ({ AuthUser, req }) => {
    return {
      props: {
      }
    }
  })
  
  export default withAuthUser({
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN,
  })(Contact)