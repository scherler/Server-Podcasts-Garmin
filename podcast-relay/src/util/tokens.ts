export const token =
  document.cookie
    ?.split('; ')
    ?.find(row => row.startsWith('session='))
    ?.split('=')[1] || '';

export const getHeaders = () => {
  const headers = new Headers();
  headers.append('Accept', 'application/json');
  headers.append('Authorization', token);
  return headers;
};
