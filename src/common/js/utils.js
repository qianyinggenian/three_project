export function getResourcePath (path,systemCode='three_project') {
  let urlPath = '';
  if (process.env.NODE_ENV !== 'development') {
    urlPath = `/${systemCode}${path}`;
  } else {
    urlPath = path;
  }
  // return process.env.NODE_ENV === 'production' ? `/${systemCode}${path}` : path;
  return urlPath;
}
