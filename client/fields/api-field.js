const createField = async (params, credentials, field) => {
  console.log(JSON.parse(field));
  try {
    let response = await fetch('/api/fields/by/' + params.userId, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + credentials.t,
      },
      body: field,
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};

const list = async (signal) => {
  try {
    let response = await fetch('api/fields/', {
      method: 'GET',
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const read = async (params, signal) => {
  try {
    let response = await fetch('/api/fields/' + params.fieldId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

const listByOwner = async (params, credentials, signal) => {
  try {
    let response = await fetch('/api/fields/by/' + params.userId, {
      method: 'GET',
      signal: signal,
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer' + credentials.t,
      },
    });
    return response.json();
  } catch (err) {
    console.log(err);
  }
};