export const create = async (params, credentials) => {
  try {
    let response = await fetch("/api/booking/new" + params.fieldId, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + credentials.t,
      },
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const listBooked = async (credentials, signal) => {
  try {
    let response = await fetch("/api/booking/booked", {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};

export const bookingStats = async (params, credentials, signal) => {
  try {
    let response = await fetch("/api/booking/stats/" + params.fieldId, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + credentials.t,
      },
      signal: signal,
    });
    return await response.json();
  } catch (err) {
    console.log(err);
  }
};
