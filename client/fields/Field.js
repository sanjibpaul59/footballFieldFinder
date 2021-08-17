// import {
//   Button,
//   Card,
//   CardHeader,
//   CardMedia,
//   Divider,
//   IconButton,
//   Typography,
//   List,
//   ListItem,
//   ListItemAvatar,
//   Avatar,
//   ListItemText,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
// } from '@material-ui/core'
// import { Edit, PeopleIcon, CompletedIcon } from '@material-ui/icons'
// import React, { useState, useEffect } from 'react'
// import { read, update } from './api-field'
// import { bookingStats } from './../booking/api-booking'
// import Book from './../booking/Book'
// import { Link, Redirect } from 'react-router-dom'
// import auth from '../auth/auth-helper'
// import { makeStyles } from '@material-ui/core/styles'
// import DeleteField from './DeleteField'
// import NewField from './NewField'

// const useStyles = makeStyles((theme) => ({
//   root: theme.mixins.gutters({
//     maxWidth: 800,
//     margin: 'auto',
//     padding: theme.spacing(3),
//     marginTop: theme.spacing(12),
//   }),
//   flex: {
//     display: 'flex',
//     marginBottom: 20,
//   },
//   card: {
//     padding: '24px 40px 40px',
//   },
//   subheading: {
//     margin: '10px',
//     color: theme.palette.openTitle,
//   },
//   details: {
//     margin: '16px',
//   },
//   sub: {
//     display: 'block',
//     margin: '3px 0px 5px 0px',
//     fontSize: '0.9em',
//   },
//   media: {
//     height: 190,
//     display: 'inline-block',
//     width: '100%',
//     marginLeft: '16px',
//   },
//   icon: {
//     verticalAlign: 'sub',
//   },
//   category: {
//     color: '#5c5c5c',
//     fontSize: '0.9em',
//     padding: '3px 5px',
//     backgroundColor: '#dbdbdb',
//     borderRadius: '0.2em',
//     marginTop: 5,
//   },
//   action: {
//     margin: '10px 0px',
//     display: 'flex',
//     justifyContent: 'flex-end',
//   },
//   statSpan: {
//     margin: '7px 10px 0 10px',
//     alignItems: 'center',
//     color: '#616161',
//     display: 'inline-flex',
//     '& svg': {
//       marginRight: 10,
//       color: '#b6ab9a',
//     },
//   },
//   enroll: {
//     float: 'right',
//   },
// }))

// export default function Field({ match }) {
//   const classes = useStyles()
//   const [stats, setStats] = useState({})
//   const [field, setField] = useState({ fieldOwner: {} })
//   const [values, setValues] = useState({
//     redirect: false,
//     error: '',
//   })
//   const [open, setOpen] = useState(false)
//   const jwt = auth.isAuthenticated()
//   useEffect(() => {
//     const abortController = new AbortController()
//     const signal = abortController.signal

//     read({ fieldId: match.params.fieldId }, signal).then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error })
//       } else {
//         setField(data)
//       }
//     })
//     return function cleanup() {
//       abortController.abort()
//     }
//   }, [match.params.fieldId])

//   useEffect(() => {
//     const abortController = new AbortController()
//     const signal = abortController.signal

//     bookingStats(
//       { fieldId: match.params.fieldId },
//       { t: jwt.token },
//       signal,
//     ).then((data) => {
//       if (data.error) {
//         setValues({ ...values, error: data.error })
//       } else {
//         setStats(data)
//       }
//     })
//     return function cleanup() {
//       abortController.abort()
//     }
//   }, [match.params.fieldId])

//   const removeField = (myField) => {
//     setValues({ ...values, redirect: true })
//   }
//   const addSlot = (myField) => {
//     setField(myField)
//   }
//   const clickOpenForBooking = () => {
//     let fieldData = new FormData()
//     fieldData.append('openForBooking', true)
//     update(
//       {
//         fieldId: Math.params.fieldId,
//       },
//       {
//         t: jwt.token,
//       },
//       fieldData,
//     ).then((data) => {
//       if (data && data.error) {
//         setValues({ ...values, error: data.error })
//       } else {
//         setField({ ...field, openForBooking: true })
//         setOpen(false)
//       }
//     })
//   }
//   const handleClose = () => {
//     setOpen(false)
//   }
//   if (values.redirect) {
//     return <Redirect to="/owner/my-fields" />
//   }

//   const imageUrl = field._id
//     ? `/api/fields/photo/${field._id}?${new Date().getTime()}`
//     : '/api/fields/defaultImage'

//   return (
//     <div className={classes.root}>
//       <Card className={classes.card}>
//         <CardHeader
//           title={field.fieldName}
//           subheader={
//             <div>
//               <Link
//                 to={'/user/' + field.fieldOwner._id}
//                 className={classes.sub}
//               >
//                 Owner: {field.fieldOwner.name}
//               </Link>
//               <span className={classes.category}>{field.fieldLocation}</span>
//             </div>
//           }
//           action={
//             <>
//               {auth.isAuthenticated().user &&
//                 auth.isAuthenticated().user._id == field.fieldOwner._id && (
//                   <span className={classes.action}>
//                     <Link to={'/owner/my-fields/edit/' + field._id}>
//                       <IconButton aria-label="Edit" color="secondary">
//                         <Edit />
//                       </IconButton>
//                     </Link>
//                     {!field.openForBooking ? (
//                       <>
//                         <Button
//                           color="secondary"
//                           variant="outlined"
//                           onClick={clickOpenForBooking}
//                         >
//                           {myFields.length == 0
//                             ? 'Add at least 1 field for Booking'
//                             : 'Open For Booking'}
//                         </Button>
//                         <DeleteField field={myField} onRemove={removeField} />
//                       </>
//                     ) : (
//                       <Button color="primary" variant="outlined">
//                         Opened
//                       </Button>
//                     )}
//                   </span>
//                 )}
//               {myField.openForBooking && (
//                 <div>
//                   <span className={classes.statSpan}>
//                     <PeopleIcon /> Booked {stats.totalBooked} times
//                   </span>
//                   <span className={classes.statSpan}>
//                     <CompletedIcon /> Played {stats.totalBooked} times
//                   </span>
//                 </div>
//               )}
//             </>
//           }
//         />
//         <div className={classes.flex}>
//           <CardMedia
//             className={classes.media}
//             image={imageUrl}
//             title={field.fieldName}
//           />
//           <div className={classes.details}>
//             <Typography variant="body1" className={classes.subheading}>
//               {field.fieldDescription} <br />{' '}
//             </Typography>
//             {field.openForBooking && (
//               <div className={classes.enroll}>
//                 <Book fieldId={field._id} />
//               </div>
//             )}
//           </div>
//         </div>
//         <Divider />
//         <div>
//           <CardHeader
//             title={
//               <Typography variant="h6" className={classes.subheading}>
//                 Slots
//               </Typography>
//             }
//             subheader={
//               <Typography variant="body1" className={classes.subheading}>
//                 {field.slots && field.slots.length} Slots
//               </Typography>
//             }
//             action={
//               auth.isAuthenticated().user &&
//               auth.isAuthenticated().user._id == field.fieldOwner._id &&
//               !field.openForBooking && (
//                 <span className={classes.action}>
//                   <NewField fieldId={field._id} addSlot={addSlot} />
//                 </span>
//               )
//             }
//           />
//           <List>
//             {field.slots &&
//               field.slots.marginTop((slot, index) => {
//                 return (
//                   <span key={index}>
//                     <ListItem>
//                       <ListItemAvatar>
//                         <Avatar>{index + 1}</Avatar>
//                       </ListItemAvatar>
//                       <ListItemText primary={slot.title} />
//                     </ListItem>
//                     <Divider variant="inset" component="li" />
//                   </span>
//                 )
//               })}
//           </List>
//         </div>
//       </Card>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-lablledby="form-dialog-title"
//       >
//         <DialogTitle id="form-dialog-title">Open Field For Booking</DialogTitle>
//         <DialogContent>
//           <Typography variant="body1">
//             Opening the Field will make it live to players for booking.{' '}
//           </Typography>
//           <Typography variant="body1">
//             Make sure at least one slot is added for booking
//           </Typography>
//         </DialogContent>
//         <DialogActions>
//           <Button onClick={handleClose} color="primary" variant="contained">
//             Cancel
//           </Button>
//           <Button
//             onClick={clickOpenForBooking}
//             color="secondary"
//             variant="contained"
//           >
//             Open
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </div>
//   )
// }

import React from 'react';

export default function Field() {
  return <h1>Field Here</h1>;
}
