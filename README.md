# pdf-view-plus

This package provides a PDF viewer for Atom. It is intended to replace [`pdf-view`](https://atom.io/packages/pdf-view). It is still a work in progress; some features, such as synctex and remembering view state have not been implemented yet.


## Installing

To install, first install `npm`, and then [apx](https://www.npmjs.com/package/@aerijo/apx) with the following command
```
npm install -g @aerijo/apx
```
then run
```
apx install pdf-view-plus
```


### ...why?

This package is written in TypeScript. It first needs to be translated to JavaScript, but `apm` will only install the source files. In the interest of making this package accessible, the releases have been configured to work with both `apx` and `apm`. However, the `apm` install is 70MB, while installing via `apx` is only 7MB.


## Developing

1. Clone repo & navigate to repo root
2. Run `npm install`
4. Run `apm link --dev`
3. Run `npm run watch`
5. Open PDF in dev mode.
