import React, { useState } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Add from "@material-ui/icons/AddBox";
import { makeStyles } from "@material-ui/core";
import { newSlot } from "./api-field";
import auth from "../auth/auth-helper";

const useStyles = makeStyles((theme) => ({
  form: {
    minWidth: 500,
  },
}));

export default function NewSlot(props) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState({
    price: "",
    day: "",
    startTime: "",
    endTime: "",
  });
  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };
  const jwt = auth.isAuthenticated();
  const clickSubmit = () => {
    const slot = {
      price: values.price || undefined,
      day: values.day || undefined,
      startTime: values.startTime || undefined,
      endTime: values.endTime || undefined,
    };
    newSlot(
      {
        fieldId: props.fieldId,
      },
      {
        t: jwt.token,
      },
      slot
    ).then((data) => {
      console.log(data);
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        props.addSlot(data);
        setValues({
          ...values,
          price: "",
          day: "",
          startTime: "",
          // redirect:true,
          endTime: "",
        });
        setOpen(false);
      }
    });
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <Button
        aria-label="Add Slot"
        color="primary"
        variant="contained"
        onClick={handleClickOpen}
      >
        <Add /> &nbsp; New Slot
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div className={classes.form}>
          <DialogTitle id="form-dialog-title">Add New Slot</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Price"
              type="text"
              fullWidth
              value={values.price}
              onChange={handleChange("price")}
            />
            <br />
            <TextField
              margin="dense"
              label="Day"
              type="text"
              fullWidth
              value={values.day}
              onChange={handleChange("day")}
            />
            <br />
            <TextField
              margin="dense"
              type="date"
              fullWidth
              value={values.startTime}
              onChange={handleChange("startTime")}
            />
            <br />
            <TextField
              margin="dense"
              type="date"
              fullWidth
              value={values.endTime}
              onChange={handleChange("endTime")}
            />
            <br />
          </DialogContent>

          <DialogActions>
            <Button onClick={handleClose} color="primary" variant="contained">
              Cancel
            </Button>
            <Button onClick={clickSubmit} color="secondary" variant="contained">
              Add
            </Button>
          </DialogActions>
        </div>
      </Dialog>
    </div>
  );
}
NewSlot.propTypes = {
  fieldId: PropTypes.string.isRequired,
  addSlot: PropTypes.func.isRequired,
};
