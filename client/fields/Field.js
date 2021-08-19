import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import PeopleIcon from "@material-ui/icons/Group";
import CompletedIcon from "@material-ui/icons/VerifiedUser";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { makeStyles } from "@material-ui/core";
import { read, update } from "./api-field.js";
import { Link, Redirect } from "react-router-dom";
import auth from "../auth/auth-helper";
import DeleteField from "./DeleteField";
import NewSlot from "./NewSlot.js";

const useStyles = makeStyles((theme) => ({
  root: theme.mixins.gutters({
    maxWidth: 800,
    margin: "auto",
    padding: theme.spacing(3),
    marginTop: theme.spacing(12),
  }),
  flex: {
    display: "flex",
    marginBottom: 20,
  },
  card: {
    padding: "24px 40px 40px",
  },
  subheading: {
    margin: "10px",
    color: theme.palette.openTitle,
  },
  details: {
    margin: "16px",
  },
  sub: {
    display: "block",
    margin: "3px 0px 5px 0px",
    fontSize: "0.9em",
  },
  media: {
    height: 190,
    display: "inline-block",
    width: "100%",
    marginLeft: "16px",
  },
  icon: {
    verticalAlign: "sub",
  },
  category: {
    color: "#5c5c5c",
    fontSize: "0.9em",
    padding: "3px 5px",
    backgroundColor: "#dbdbdb",
    borderRadius: "0.2em",
    marginTop: 5,
  },
  action: {
    margin: "10px 0px",
    display: "flex",
    justifyContent: "flex-end",
  },
  statSpan: {
    margin: "7px 10px 0 10px",
    alignItems: "center",
    color: "#616161",
    display: "inline-flex",
    "& svg": {
      marginRight: 10,
      color: "#b6ab9a",
    },
  },
  enroll: {
    float: "right",
  },
}));

export default function Field({ match }) {
  const [field, setField] = useState({ fieldOwner: {} });
  const [values, setValues] = useState({
    error: "",
    rediret: false,
  });
  const [open, setOpen] = useState(false);
  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    read(
      {
        fieldId: match.params.fieldId,
      },
      signal
    ).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setField(data);
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [match.params.fieldId]);

  const removeField = (field) => {
    setValues({ ...values, redirect: true });
  };
  const addSlot = (field) => {
    setField(field);
  };

  const clickOpenForBooking = () => {
    if (field.slots.length > 0) {
      setOpen(true);
    }
  };

  const openForBooking = () => {};

  const imageUrl = field._id
    ? `/api/fields/photo/${field._id}?${new Date().getTime()}`
    : `/api/fields/defaultImage`;
  return (
    <Card>
      <CardHeader
        title={field.fieldName}
        subheader={
          <div>
            <Link to={"/user/" + field.fieldOwner._id}>
              {" "}
              By {field.fieldOwner.name}
            </Link>
            <span>{field.location}</span>
            <span>{field.fieldOwner.phone}</span>
          </div>
        }
      />
      <CardMedia image={imageUrl} title={field.fieldName} />
      <div>
        <Typography variant="body1">{field.description}</Typography>
      </div>
      {auth.isAuthenticated().user &&
        auth.isAuthenticated().user._id == field.fieldOwner._id && (
          <span>
            {" "}
            <Link to={"/owner/my-field/edit" + field._id}>
              <IconButton aria-label="Edit" color="secondary">
                <Edit />
              </IconButton>
            </Link>{" "}
          </span>
        )}
    </Card>
  );
}
