import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import CardActions from "@material-ui/core/CardActions"
import Divider from "@material-ui/core/Divider"
import Typography from "@material-ui/core/Typography"
import PropTypes from "prop-types"
import { Link } from "react-router-dom"
import auth from "./../auth/auth-helper"
import Book from "./../booking/Book"
import { GridList, GridListTile, GridListTileBar } from "@material-ui/core"

const useStyles = makeStyles((theme) => ({
  title: {
    padding: `${theme.spacing(3)}px ${theme.spacing(2.5)}px ${theme.spacing(
      2
    )}px`,
    color: theme.palette.openTitle,
  },
  media: {
    minHeight: 400,
  },
  gridList: {
    width: "100%",
    minHeight: 200,
    padding: "16px 0 0px",
  },
  tile: {
    textAlign: "center",
    border: "1px solid #cecece",
    backgroundColor: "#04040c",
  },
  image: {
    height: "100%",
  },
  tileBar: {
    backgroundColor: "rgba(0, 0, 0, 0.85)",
    textAlign: "left",
  },
  tileTitle: {
    fontSize: "1.1em",
    marginBottom: "5px",
    color: "#fffde7",
    display: "block",
  },
  action: {
    margin: "0 10px",
  },
}))

export default function Fields(props) {
  const classes = useStyles()
  const findCommon = (field) => {
    return !props.common.find((booked) => {
      return booked.field._id == field._id
    })
  }

  return (
    <GridList cellHeight={220} className={classes.gridList} cols={2}>
      {props.fields.map((field, i) => {
        return (
          findCommon(field) && (
            <GridListTile
              className={classes.tile}
              key={i}
              style={{ padding: 0 }}
            >
              <Link to={"/field/" + field._id}>
                <img
                  src={"/api/fields/photo/" + field._id}
                  alt={field.fieldName}
                  className={classes.image}
                />
              </Link>
              <GridListTileBar
                className={classes.tileBar}
                title={
                  <Link to={"/field" + field._id} className={classes.tileTitle}>
                    {field.fieldName}
                  </Link>
                }
                subtitle={<span>{field.location}</span>}
                actionIcon={
                  <div className={classes.action}>
                    {auth.isAuthenticated() ? (
                      <Book fieldId={field._id} />
                    ) : (
                      <Link to="/signin">Signin to Book</Link>
                    )}
                  </div>
                }
              />
            </GridListTile>
          )
        )
      })}
    </GridList>
  )
}

Fields.propTypes = {
  fields: PropTypes.array.isRequired,
}
