import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Box,
  Divider
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Person, Reply } from "@material-ui/icons";

import { useMutation } from "@apollo/react-hooks";

import { Frame } from "./Frame";
import { isEmail, isEmpty } from "validator";

import { USERS, ADD_USER } from "../store";

import styles from "./UserUpdateForm.module.scss";

const UserCreateForm = ({ history, match }) => {
  const [{ name, email }, setUser] = useState({ name: "", email: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState({ name: false, email: false });
  const [saveDisabled, setSaveDisabled] = useState(false);
  const [createUser] = useMutation(ADD_USER, {
    update(cache, { data: createUser }) {
      const { users } = cache.readQuery({ query: USERS });
      cache.writeQuery({
        query: USERS,
        data: { users: users.concat([createUser]) }
      });
    },
    errorPolicy: "all"
  });
  const [i] = useTranslation();
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
      await createUser({ variables: { input: { name, email } } });
      history.goBack();
    } catch (ex) {
      setSaveDisabled(false);
      setErrorMessage(ex.message);
    }
  };
  return (
    <Frame
      title={i("addUser")}
      action={{ action: history.goBack, icon: <Reply /> }}
    >
      <Card>
        <CardContent>
          <Box className={styles.avatarBox}>
            <Person className={styles.avatar} />
            <Box className={styles.fieldsBox}>
              <TextField
                className={styles.textfield}
                required
                label={i("userName")}
                value={name}
                error={errors.name}
                onChange={nameChange}
              />{" "}
              <br />
              <TextField
                className={styles.textfield}
                required
                label={i("userEmail")}
                value={email}
                error={errors.email}
                onChange={emailChange}
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
        </CardActions>
      </Card>
    </Frame>
  );
};

export { UserCreateForm };
