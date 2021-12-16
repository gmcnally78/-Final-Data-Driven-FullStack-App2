import React, { useState, useEffect } from 'react';
import {
    Flex,
    InputGroup,
    InputLeftElement,
    Input,
    Button,
    Text,
    IconButton,
    Divider,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    useAuthUser,
    withAuthUser,
    withAuthUserTokenSSR,
    AuthAction,
} from 'next-firebase-auth';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Header from '../../components/Header';

const SingleTodo = ({itemData}) => {
  const AuthUser = useAuthUser();
  const [inputName, setInputName] = useState(itemData.name);
  const [inputDate, setInputDate] = useState(itemData.date);
  const [statusMsg, setStatusMsg] = useState('');

  const sendData = async () => {
    try {
      console.log("sending!");
      // try to update doc
      const docref = await firebase.firestore().collection(AuthUser.id).doc(itemData.id);
      const doc = docref.get();

      if (!doc.empty) {
        docref.update(
          {
            name: inputName,
            date: firebase.firestore.Timestamp.fromDate( new Date(inputDate) )
          }
        );
        setStatusMsg("Updated!");
      }

    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Flex>
        <Heading>{itemData.name}</Heading>
      </Flex>
      <Flex>
        <Text>{itemData.date}</Text>
      </Flex>
    </>
  );
};

export const getServerSideProps = withAuthUserTokenSSR(
  {
    whenUnauthed: AuthAction.REDIRECT_TO_LOGIN
  }
)(
  async ({ AuthUser, params }) => {
    // take the id parameter from the url and construct a db query with it
    const db = getFirebaseAdmin().firestore();
    const doc = await db.collection(AuthUser.id).doc(params.id).get();
    let itemData;
    if (!doc.empty) {
      // document was found
      let docData = doc.data();
      itemData = {
        id: doc.id,
        name: docData.name,
        date: docData.date.toDate().toDateString()
      };
    } else {
      // no document found
      itemData = null;
    }
    // return the data
    return {
      props: {
        itemData
      }
    }
  }
)

export default withAuthUser(
  {
    whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
    whenUnauthedBeforeInit: AuthAction.REDIRECT_TO_LOGIN
  }
)(SingleTodo)