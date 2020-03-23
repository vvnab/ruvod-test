import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
// import styles from "./Confirm.module.scss";

const Confirm = ({ title, open, handleClose, children }) => {
  const [i] = useTranslation();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleClose(false)} color="primary">
          {i("disagree")}
        </Button>
        <Button onClick={() => handleClose(true)} color="primary" autoFocus>
          {i("agree")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

Confirm.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired
};

export { Confirm };
