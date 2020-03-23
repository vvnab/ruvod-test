import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  TextField,
  Box,
  Divider
} from "@material-ui/core";

import { useTranslation } from "react-i18next";
import Skeleton from "@material-ui/lab/Skeleton";
import { Person, Reply, Delete } from "@material-ui/icons";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { isEmail, isEmpty } from "validator";
import { Frame } from "./Frame";
import { Error } from "./Error";
import { USER, UPDATE_USER, DELETE_USER, USERS } from "../store";

import styles from "./UserUpdateForm.module.scss";

const Loading = () => (
  <Card>
    <CardContent>
      <Box className={styles.avatarBox}>
        <Skeleton variant="rect" className={styles.avatar} />
        <Box className={styles.fieldsBox}>
          <Skeleton variant="rect" height={30} className={styles.textfield} />
          <br />
          <Skeleton variant="rect" height={30} className={styles.textfield} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const UserUpdateForm = ({ history, match }) => {
  const userId = match.params.id;
  const [{ name, email }, setUser] = useState({ name: "", email: "" });
  const { loading, networkStatus, error, data, refetch } = useQuery(USER, {
    variables: { id: userId },
    notifyOnNetworkStatusChange: true
  });
  const [updateUser] = useMutation(UPDATE_USER, { errorPolicy: "all" });
  const [deleteUser] = useMutation(DELETE_USER, {
    update(cache, { data: deleteUser }) {
      const { users } = cache.readQuery({ query: USERS });
      cache.writeQuery({
        query: USERS,
        data: { users: users.filter(i => i.id !== deleteUser.deleteUser.id) }
      });
    },
    errorPolicy: "all"
  });
  useEffect(() => {
    if (data && data.user) {
      setUser(data.user);
    }
  }, [data]);
  const refresh = async () => {
    try {
      await refetch(USER);
    } catch (ex) {}
  };
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({ name: false, email: false });
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [i] = useTranslation();

  const saveUser = async () => {
    let _errors = errors;
    try {
      if (!isEmail(email)) {
        _errors = { ..._errors, email: true };
        setErrors(_errors);
      }
      if (isEmpty(name)) {
        _errors = { ..._errors, name: true };
        setErrors(_errors);
      }
      if (_errors.name || _errors.email) {
        throw new Error(i("invalidUserForm"));
      }
      setSaveDisabled(true);
      await updateUser({ variables: { id: userId, input: { name, email } } });
      history.goBack();
    } catch (ex) {
      setSaveDisabled(false);
      setErrorMessage(ex.message);
    }
  };

  const removeUser = async () => {
    try {
      if (!window.confirm(i("deleteConfirm"))) return;
      await deleteUser({ variables: { id: userId } });
      history.goBack();
    } catch (ex) {
      setErrorMessage(ex.message);
    }
  };

  const nameChange = e => {
    const { value } = e.target;
    if (!isEmpty(value)) {
      setErrors({ ...errors, name: false });
    }
    setUser({ email, name: value });
  };
  const emailChange = e => {
    const { value } = e.target;
    if (isEmail(value)) {
      setErrors({ ...errors, email: false });
    }
    setUser({ name, email: value });
  };

  return (
    <Frame
      title={i("updateUser")}
      action={{ action: history.goBack, icon: <Reply /> }}
    >
      {networkStatus === 4 || loading ? (
        <Loading />
      ) : error ? (
        <Error message={error.message} onRefresh={refresh} />
      ) : (
        <Card>
          <CardContent>
            <Box className={styles.avatarBox}>
              <Person className={styles.avatar} />
              <Box className={styles.fieldsBox}>
                <TextField
                  required
                  label={i("userName")}
                  className={styles.textfield}
                  onChange={nameChange}
                  value={name}
                />{" "}
                <br />
                <TextField
                  required
                  label={i("userEmail")}
                  className={styles.textfield}
                  onChange={emailChange}
                  value={email}
                />
              </Box>
            </Box>
            {errorMessage && (
              <Box color="secondary.main">
                <br />
                <Divider />
                <br />
                {errorMessage}
              </Box>
            )}
          </CardContent>
          <CardActions>
            <Button onClick={history.goBack} color="primary">
              {i("cancel")}
            </Button>
            <Button color="primary" onClick={saveUser} disabled={saveDisabled}>
              {i("save")}
            </Button>
            <div className={styles.filler}></div>
            <IconButton className={styles.deleteButton} onClick={removeUser}>
              <Delete />
            </IconButton>
          </CardActions>
        </Card>
      )}
    </Frame>
  );
};

export { UserUpdateForm };
