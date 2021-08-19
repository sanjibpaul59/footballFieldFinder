import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Icon from "@material-ui/core/Icon";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import auth from "./../auth/auth-helper";
import { listByOwner } from "./api-field.js";
import { Redirect, Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 600,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  title: {
    margin: `${theme.spacing(3)}px 0 ${theme.spacing(3)}px ${theme.spacing(
      1
    )}px`,
    color: theme.palette.protectedTitle,
    fontSize: "1.2em",
  },
  addButton: {
    float: "right",
  },
  leftIcon: {
    marginRight: "8px",
  },
  avatar: {
    borderRadius: 0,
    width: 65,
    height: 40,
  },
  listText: {
    marginLeft: 16,
  },
}));

export default function Myfields() {
  const classes = useStyles();
  const [fields, setfields] = useState([]);
  const [redirectToSignin, setRedirectToSignin] = useState(false);

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    listByOwner(
      {
        userId: jwt.user._id,
      },
      { t: jwt.token },
      signal
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true);
      } else {
        setfields(data);
      }
    });

    return function cleanup() {
      abortController.abort();
    };
  }, []);

  if (redirectToSignin) {
    return <Redirect to="/signin" />;
  }
  return (
    <div>
      <Paper className={classes.root} elevation={4}>
        <Typography type="title" className={classes.title}>
          Your fields
          <span className={classes.addButton}>
            <Link to="/owner/add-field">
              <Button color="primary" variant="contained">
                <Icon className={classes.leftIcon}>add_box</Icon> New field
              </Button>
            </Link>
          </span>
        </Typography>
        <List dense>
          {fields.map((field, i) => {
            return (
              <Link to={"/owner/field/" + field._id} key={i}>
                <ListItem button>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        "/api/fields/image/" +
                        field._id +
                        "?" +
                        new Date().getTime()
                      }
                      className={classes.avatar}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={field.fieldName}
                    secondary={field.description}
                    className={classes.listText}
                  />
                </ListItem>
                <Divider />
              </Link>
            );
          })}
        </List>
      </Paper>
    </div>
  );
}
