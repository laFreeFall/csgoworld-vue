export const getHeader = () => {
  const tokenData = JSON.parse(window.localStorage.getItem('user'))
  const headers = {
    'Accept': 'application/json',
    'Authorization': 'Bearer ' + tokenData.auth.access_token
  }

  return headers
}
