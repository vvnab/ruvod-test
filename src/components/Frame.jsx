import React from "react";
import {
  Container,
  Typography,
  AppBar,
  Toolbar,
  IconButton
} from "@material-ui/core";
import PropTypes from "prop-types";
import { Menu } from "@material-ui/icons";
import styles from "./Frame.module.scss";

const Frame = ({ title, children, action }) => {
  return (
    <Container>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <Menu />
          </IconButton>
          <Typography variant="h6" className={styles.title}>
            {title}
          </Typography>
          {action && (
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={action.action}
            >
              {action.icon}
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
      <div className={styles.main}>{children}</div>
    </Container>
  );
};

Frame.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired,
  action: PropTypes.object
};

export { Frame };
