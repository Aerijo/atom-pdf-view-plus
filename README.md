# pdf-view-plus

This package provides a PDF viewer for Atom. It is intended to completely replace [`pdf-view`](https://atom.io/packages/pdf-view).

## Installing

To install, first install `npm` (or `yarn`), and then [apx](https://www.npmjs.com/package/@aerijo/apx) with the following command
```
npm install -g @aerijo/apx
```
then run
```
apx install pdf-view-plus
```


### ...why?

This package is written in TypeScript. It first needs to be translated to JavaScript, but `apm` does not support installing from a published asset, and will only install the source files. The built in transpiler is old and [being removed](https://github.com/atom/atom/issues/17001). The best alternative would be [`atom-ts-transpiler`](https://github.com/smhxx/atom-ts-transpiler), but that would make the package size over 5 times bigger (7MB to 41MB) for a one time convenience, to fix a problem that doesn't need to exist in the first place.


## Developing

1. Clone repo & navigate to repo root
2. Run `npm install`
4. Run `apm link --dev`
3. Run `npm run watch`
5. Open PDF in dev mode.
