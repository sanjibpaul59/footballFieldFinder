import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import FileUpload from '@material-ui/icons/AddPhotoAlternate';
import auth from '../auth/auth-helper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles } from '@material-ui/core/styles';
import { createField } from './../fields/api-field.js';
import { Link, Redirect } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(12),
    paddingBottom: theme.spacing(2),
  },
  error: {
    verticalAlign: 'middle',
  },
  title: {
    marginTop: theme.spacing(2),
    color: theme.palette.openTitle,
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
  input: {
    display: 'none',
  },
  filename: {
    marginLeft: '10px',
  },
}));

export default function NewField() {
  const classes = useStyles();
  const [values, setValues] = useState({
    fieldName: '',
    fieldLocation: '',
    fieldDetails: '',
    image: '',
    redirect: false,
    error: '',
  });

  const jwt = auth.isAuthenticated();

  const handleChange = (name) => (event) => {
    const value = name === 'image' ? event.target.files[0] : event.target.value;
    setValues({ ...values, [name]: value });
  };

  const clickSubmit = () => {
    let fieldData = new FormData();
    values.image && fieldData.append('image', values.image);
    values.fieldName && fieldData.append('fieldName', values.fieldName);
    values.fieldLocation &&
      fieldData.append('fieldLocation', values.fieldLocation);
    values.fieldDetails &&
      fieldData.append('fieldDetails', values.fieldDetails);

    createField({ userId: jwt.user._id }, { t: jwt.token }, fieldData).then(
      (data) => {
        if (data.error) {
          setValues({ ...values, error: data.error });
        } else {
          setValues({ ...values, error: '', redirect: true });
        }
      },
    );
  };

  if (values.redirect) {
    return <Redirect to={'/fields'} />;
  }
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Add Field
          </Typography>
          <br />
          <input
            accept="image/*"
            onChange={handleChange('image')}
            className={classes.input}
            id="icon-button-file"
            type="file"
            style={{ display: 'none' }}
          />
          <label htmlFor="icon-button-file">
            <Button
              variant="contained"
              color="secondary"
              component="span"
              style={{ marginBottom: 2 }}
            >
              Upload Photo
              <FileUpload />
            </Button>
          </label>
          <span className={classes.filename}>
            {values.image ? values.image.name : ''}
          </span>
          <br />
          <TextField
            id="fieldName"
            label="Field Name"
            className={classes.textField}
            value={values.fieldName}
            onChange={handleChange('fieldName')}
            margin="normal"
          />
          <br />
          <TextField
            id="fieldLocation"
            label="Field Location"
            className={classes.textField}
            value={values.fieldLocation}
            onChange={handleChange('fieldLocation')}
            margin="normal"
          />
          <br />
          <TextField
            id="fieldDetails"
            label="Field Details"
            className={classes.textField}
            value={values.fieldDetails}
            onChange={handleChange('fieldDetails')}
            margin="normal"
          />
          <br />
          {values.error && (
            <Typography component="p" color="error">
              <Icon color="error" className={classes.error}>
                error
              </Icon>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button
            color="primary"
            variant="contained"
            onClick={clickSubmit}
            className={classes.submit}
          >
            Submit
          </Button>
          <Link to="/owner/my-fields" className={classes.submit}>
            <Button variant="contained">Cancel</Button>
          </Link>
        </CardActions>
      </Card>
    </div>
  );
}
