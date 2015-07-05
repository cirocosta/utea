# Utea

> A toy WebGL 3D Engine (*with basic 2D support*)

:warning: Under heavy construction :construction_worker: :construction:


## Messing around

The examples are currently available at [http://cirocosta.github.io/utea/example/](http://cirocosta.github.io/utea/example/). Go check them out!

If you wish to run the project locally:

```sh
$ npm install

# start webpack's dev-server
$ npm run start

# now you're ready :D
# go to http://localhost:8080/example/  or http://localhost:8080/webpack-dev-server/


# OR, build the project's examples and start your own
$ npm run build
$ python -m "SimpleHTTPServer"

# server started, now just
# go to http://localhost:8000/example/

```

If you don't know what npm is all about, check the next session.


### Beginners Guide to Install

This project depends on [NodeJS](https://nodejs.org/) for transpilling the code without the need of a browser to run the Javascript transpiller. [NPM](https://www.npmjs.com/) is the package manager that allows us to distribute only the project's source code without the need of packing all the dependencies together. The development and general dependencies are explicited in `./package.json`.

After you've installed NodeJS and NPM then you're able to clone the repo (`git clone git@github.com:cirocosta/utea.git`) and run that code above. After `npm install` is executed all of the dependencies will be downloaded. `npm run start` will run the script to set a webserver and let you dig into the generated code locally at `http://locahost:PORT/`.

**IMPORTANT**: `npm run start` and `npm run build` will fail in Windows as it exports `NODE_ENV` variable to set the proper build through `export` command (which i don't believe is available in windows - not a windows user here).


## Samples

![](https://cloud.githubusercontent.com/assets/3574444/8483683/c61c046c-20c8-11e5-8532-67361b71f6b9.gif)
![](https://cloud.githubusercontent.com/assets/3574444/8467383/f376755e-2033-11e5-9135-45690703652b.gif)
![](https://cloud.githubusercontent.com/assets/3574444/8113905/9535fb32-1047-11e5-8211-bdfa167d20c6.gif)
![](https://cloud.githubusercontent.com/assets/3574444/8187106/7eac5452-1424-11e5-8e1c-f91cb7d10de7.gif)


## LICENSE

GPLv2. See `./LICENSE`.

