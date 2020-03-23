import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Paper, Divider, Typography, Box, Button } from "@material-ui/core";
import { Refresh } from "@material-ui/icons";

import styles from "./Error.module.scss";

const Error = ({ message, onRefresh }) => {
  const [i] = useTranslation();
  return (
    <Paper variant="outlined" className={styles.main}>
      <Box>
        <Typography variant="h6">{i("errorTitle")}</Typography>
        <Divider />
        <Box color="secondary.main" className={styles.message}>
          {message}
        </Box>
      </Box>
      <Box className={styles.buttonBox}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Refresh />}
          onClick={onRefresh}
        >
          {i("errorRefresh")}
        </Button>
      </Box>
    </Paper>
  );
};

Error.propTypes = {
  message: PropTypes.string
};

export { Error };
