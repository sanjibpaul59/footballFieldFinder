import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import fieldInIsland from "./../assets/images/fieldInIsland.jpg";
import SportsSoccerIcon from "@material-ui/icons/SportsSoccer";
import LocationSearchingIcon from "@material-ui/icons/LocationSearching";
import BookIcon from "@material-ui/icons/Book";

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: "100%",
    margin: "auto",
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(2),
  },
  title: {
    padding: `${theme.spacing(2)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
    textAlign: "center",
  },
  media: {
    minHeight: 400,
  },
  credit: {
    padding: 4,
    textAlign: "right",
    backgroundColor: "#fafafa",
    "& a": {
      color: "#3f4771",
    },
  },
  body: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2.5)}px ${theme.spacing(
      1
    )}px`,
    color: "#2e7d32",
    textAlign: "center",
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: `${theme.spacing(2)}px`,
    textAlign: "center",
    color: "#2e7d32",
  },
  searchOption: {
    marginBottom: theme.spacing(10),
  },
  motto: {
    padding: theme.spacing(2),
    color: "#263238",
  },
  mottoIcon: {
    fontSize: 48,
  },
}));

export default function Home() {
  const classes = useStyles();
  return (
    <div>
      <Card className={classes.card} elevation={0}>
        <CardMedia
          className={classes.media}
          image={fieldInIsland}
          title="Field Image"
        />
        <Typography
          variant="body2"
          component="p"
          className={classes.credit}
          color="textSecondary"
          elevation={0}
        >
          Photo by{" "}
          <a
            href="https://unsplash.com/photos/6-TfzTGbC7A?utm_source=unsplash&utm_medium=referral&utm_content=creditShareLink"
            target="_blank"
            rel="noopener noreferrer"
          >
            Ivars Utināns
          </a>{" "}
          on Unsplash
        </Typography>
        <CardContent>
          <Typography variant="h4" className={classes.title}>
            Welcome to Field Finder!
          </Typography>
          <Typography variant="h6" className={classes.body}>
            Find a suitable Football Field near you from the Largest Field
            Database of the Country!
          </Typography>
        </CardContent>
      </Card>
      <div className={classes.searchOption}>
        <Paper elevation={0} style={{ textAlign: "center" }}>
          <Typography variant="h5">Find a Field Near You, Now!</Typography>
        </Paper>
      </div>
      <div className={classes.root}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper elevation={0} className={classes.paper}>
              <LocationSearchingIcon className={classes.mottoIcon} />
              <Typography variant="h3" className={classes.motto}>
                Find
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={0} className={classes.paper}>
              <BookIcon className={classes.mottoIcon} />
              <Typography variant="h3" className={classes.motto}>
                Book
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper elevation={0} className={classes.paper}>
              <SportsSoccerIcon className={classes.mottoIcon} />
              <Typography variant="h3" className={classes.motto}>
                Play
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}
