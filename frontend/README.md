# React + Vite + GH-pages

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# Use template to get started

1. create repo in github
1. select template repo
1. clone repo
1. open cloned repo
1. run bash command to update and install dependancies
```
npm update && npm install
```


## Once installed and updated
1. in file vite.config.js-> change the base: "/gh-template/" to the github repo name
1. in file package.json -> change the base: "homepage": "https://graganold.github.io/gh-template/", to "homepage": "https://graganold.github.io/< GITHUB-REPO-NAME >/"


## Lastly
 - run bash command to deploy the github pages
 ```
 npm run deploy
 ```