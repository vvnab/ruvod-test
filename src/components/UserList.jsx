import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@apollo/react-hooks";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Typography,
  Fab,
  IconButton
} from "@material-ui/core";
import PropTypes from "prop-types";
import Skeleton from "@material-ui/lab/Skeleton";
import { Add } from "@material-ui/icons";

import styles from "./UserList.module.scss";
import { Frame } from "./Frame";
import { Error } from "./Error";

import { USERS } from "../store";

const Loading = () => (
  <TableContainer className={styles.table}>
    <Table aria-label="simple table">
      <TableBody>
        {[...Array(11).keys()].map(i => (
          <TableRow key={i}>
            <TableCell>
              <Skeleton variant="text" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Users = ({ data, action, history }) => {
  const [i] = useTranslation();
  return (
    <React.Fragment>
      {data && data.length > 0 ? (
        <TableContainer className={styles.table}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>{i("userName").toUpperCase()}</TableCell>
                <TableCell>{i("userEmail").toUpperCase()}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, k) => (
                <TableRow
                  key={row.id}
                  onClick={() => history.push(`users/${row.id}`)}
                >
                  <TableCell>#{k + 1}</TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell>{row.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Typography variant="h6" className={styles.empty}> {i("usersEmpty")} </Typography>
      )}
      <div className={styles.fab}>
        <Fab color="secondary" aria-label="add">
          <IconButton color="inherit" href={action.href}>
            <Add />
          </IconButton>
        </Fab>
      </div>
    </React.Fragment>
  );
};

Users.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  action: PropTypes.object
};

const UserList = ({ history }) => {
  const [i] = useTranslation();
  const { loading, networkStatus, error, data, refetch } = useQuery(USERS, {
    notifyOnNetworkStatusChange: true
  });
  const refresh = async () => {
    try {
      await refetch(USERS);
    } catch (ex) {}
  };
  return (
    <Frame title={i("userList")}>
      {networkStatus === 4 || loading ? (
        <Loading />
      ) : error ? (
        <Error message={error.message} onRefresh={refresh} />
      ) : (
        <Users
          history={history}
          data={data.users}
          action={{ title: i("addUserButton"), href: "#/users/new" }}
        />
      )}
    </Frame>
  );
};

export { UserList };
