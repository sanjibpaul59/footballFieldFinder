const create = async (params, credentials, field) => {
  try {
    let response = await fetch('/api/fields/by/' + params.userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + credentials.t,
      },
      body: field,
    })
    return response.json()
  } catch (err) {
    console.log(err)
  }
}

const listByOwner = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/fields/by/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + credentials.t,
      },
    })
    return response.json()
  } catch (err) {
    console.log(err)
  }
}
