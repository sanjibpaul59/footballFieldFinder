import {
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@material-ui/core'
import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import auth from '../auth/auth-helper'

export default function FieldByOwner() {
  const [myFields, setMyFields] = useState([])
  const [redirectToSignin, setRedirectToSignin] = useState(false)
  const jwt = auth.isAuthenticated()

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal
    listByOwner(
      {
        userId: jwt.userId._id,
      },
      { t: jwt.token },
      signal,
    ).then((data) => {
      if (data.error) {
        setRedirectToSignin(true)
      } else {
        setMyFields(data)
      }
    })
    return function cleanup() {
      abortController.abort()
    }
  }, [])

  if (redirectToSignin) {
    return <Redirect to="/sigin" />
  }
  {
    myFields.map((myField, i) => {
      return (
        <Link to={'/owner/my-field/' + myField._id} key={i}>
          <ListItem button>
            <ListItemAvatar>
              <Avatar
                src={
                  '/api/fields/photo' + myField._id + '?' + new Date().getTime()
                }
              />
            </ListItemAvatar>
            <ListItemText
              primary={myField.fieldName}
              secondary={myField.fieldLocation}
            />
          </ListItem>
          <Divider />
        </Link>
      )
    })
  }
}
