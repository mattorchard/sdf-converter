export const objectAsQueryParam = (object: {}) =>
  new URLSearchParams(Object.entries(object));

export const replaceUrlParams = (params: URLSearchParams) => {
  const newUrl = new URL(window.location.href);
  newUrl.search = params.toString();
  window.history.replaceState(undefined, "", newUrl);
};
