```sh
{
  "name": "ng4-auto-complete",
  "version": "0.0.67",
  "description": "An Auto-Complete Model for Angular 5 with extended features and make life easy.",
  "main": "index.js",
  "typings": "index.d.ts",
  "scripts": {
    "transpile": "ngc",
    "package": "rollup -c",
    "minify": "uglifyjs dist/bundles/autoComplete.umd.js --screw-ie8 --compress --mangle --comments --output dist/bundles/autoComplete.umd.min.js",
    "build": "npm run transpile && npm run package && npm run minify"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/hardy12994/ng4-auto-complete.git"
  },
  "keywords": [
    "ng4-auto-complete",
    "auto-complete",
    "ng5",
    "auto-list",
    "ng-auto-complete",
    "autoComplete-ng5"
  ],
  "author": "hardeepsingh12994@gmail.com",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/hardy12994/ng4-auto-complete/issues"
  },
  "homepage": "https://github.com/hardy12994/ng4-auto-complete#readme",
  "dependencies": {
    "@angular/core": "^5.0.0",
    "@angular/forms": "^5.0.0"
  },
  "devDependencies": {
    "@angular/compiler": "^5.2.6",
    "@angular/compiler-cli": "^5.2.6",
    "node-sass": "^4.5.3",
    "rollup": "^0.50.1",
    "rollup-plugin-angular": "^0.5.3",
    "rollup-plugin-commonjs": "^8.2.6",
    "rollup-plugin-node-resolve": "^3.0.0",
    "rollup-plugin-typescript": "^0.8.1",
    "rollup-plugin-typescript2": "^0.8.0",
    "typescript": "^2.3.4",
    "uglify-js": "^3.3.12"
  }
}
```