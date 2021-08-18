import React, { useState, useEffect } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Edit from "@material-ui/icons/Edit";
import { Link, Redirect } from "react-router-dom";
import auth from "../auth/auth-helper";
import { read } from "./api-field.js";

export default function Field({ match }) {
  const [field, setField] = useState({ fieldOwner: {} });
  const [values, setValues] = useState({
    error: "",
  });

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
