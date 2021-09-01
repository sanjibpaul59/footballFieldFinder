import React from "react"
import { makeStyles } from "@material-ui/core/styles"
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
  // const findCommon = (field) => {
  //   return !props.common.find((booked) => {
  //     return booked.field._id == field._id
  //   })
  // }

  return (
    // <GridList cellHeight={220} classfieldName={classes.gridList} cols={2}>
    //   {props.fields.map((field, i) => {
    //     return (
    //       findCommon(field) && (
    //         <GridListTile
    //           classfieldName={classes.tile}
    //           key={i}
    //           style={{ padding: 0 }}
    //         >
    //           <Link to={"/field/" + field._id}>
    //             <img
    //               src={"/api/fields/image/" + field._id}
    //               alt={field.fieldfieldName}
    //               classfieldName={classes.image}
    //             />
    //           </Link>
    //           <GridListTileBar
    //             classfieldName={classes.tileBar}
    //             title={
    //               <Link to={"/field" + field._id} classfieldName={classes.tileTitle}>
    //                 {field.fieldfieldName}
    //               </Link>
    //             }
    //             subtitle={<span>{field.location}</span>}
    //             actionIcon={
    //               <div classfieldName={classes.action}>
    //                 {auth.isAuthenticated() ? (
    //                   <Book fieldId={field._id} />
    //                 ) : (
    //                   <Link to="/signin">Signin to Book</Link>
    //                 )}
    //               </div>
    //             }
    //           />
    //         </GridListTile>
    //       )
    //     )
    //   })}
    // </GridList>
    <GridList cellHeight={220} cols={2} className={classes.gridList}>
      {props.fields.map((field, i) => {
        return (
          <GridListTile key={i} style={{ padding: 0 }} className={classes.tile}>
            <Link to={"/field/" + field._id}>
              <img
                className={classes.image}
                src={"/api/fields/image/" + field._id}
                alt={field.fieldName}
              />
            </Link>
            <GridListTileBar
              className={classes.tileBar}
              title={
                <Link className={classes.tileTitle} to={"/field/" + field._id}>
                  {field.fieldName}
                </Link>
              }
              subtitle={
                <span>
                  {field.location} || Available Slots: {field.slots.length}
                </span>
              }
              actionIcon={
                <div className={classes.action}>
                  {auth.isAuthenticated() ? (
                    <Book fieldId={field._id} />
                  ) : (
                    <Link to="/signin">Sign in to Book</Link>
                  )}
                </div>
              }
            />
          </GridListTile>
        )
      })}
    </GridList>
  )
}

Fields.propTypes = {
  fields: PropTypes.array.isRequired,
}
