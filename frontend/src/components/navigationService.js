// navigationService.js

let navigateFn;

export const setNavigate = (navFunc) => {
  navigateFn = navFunc;
 
};

export const navigateTo = (path) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    console.error("Navigation function is not set yet!");
  }
};
