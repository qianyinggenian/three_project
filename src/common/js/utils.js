export function getResourcePath (path, systemCode) {
  let urlPath = '';
  console.log('process.env.NODE_ENV', process.env.NODE_ENV);
  if (process.env.NODE_ENV !== 'development') {
    urlPath = `/${systemCode}${path}`;
  } else {
    urlPath = path;
  }
  return urlPath;
}
