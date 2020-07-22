# Rapyd Framework
A full featured, ORM-backed, isomorphic framework using RapydScript, PouchDB/CouchDB, and React Native. Inspired by Odoo.

# What's New

- New [Async/Await support](#asyncawait-support)
- New Frontend with React Native without JSX, using Python's args and kwargs syntax to mimic JSX and enable it to pass any kind of objects (not only primitive types) as props. Also, UI customization is more easier now as the React Components are transpiled directly from RapydScript
- Full external JS libraries compatibility, using CommonJS on Node and Webpack on React Native, supports Expo Modules too https://docs.expo.io/versions/latest/.
- Full React Components compatibility, making it easier to build Frontend UI even on React Native.
- Upcoming Python/Odoo backend compatibility. For developers who prefer Python or Odoo on server-side rather than Node.js https://github.com/rafi16jan/rapyd-odoo
- Have many success PoCs and some giant automobile clients in Indonesia on Production. I'll post some details later on

# Purpose of this project
- Replacing or making an alternative to Odoo and Python's synchronous, I/O blocking design. Allowing us to develop asynchronous and performant ERP and IoT Apps.

- Support some parallel programming paradigms consisting of Threads/Worker, Async-Await, Promises, [Promise.all](https://medium.freecodecamp.org/promise-all-in-javascript-with-example-6c8c5aea3e32), Coroutines (TODO), and Micro Services.

- Support hardware interfacing and IoT on the Client (Desktop/Phone) and Server, using technologies like WebBluetooth, WebUSB, <del>Cordova, Cordova/</del>Node.js General Purpose I/O, React Native Modules, WebAssembly and we planned to support Microcontrollers or SBCs too.

- Creating an ORM for PouchDB/CouchDB, with a fabulous sync feature (https://pouchdb.com/guides/replication.html), offline capabilities, revision management, and performance.

- Build a React Native client app for major platforms (Android, iOS, [Web](https://docs.expo.io/workflow/web/), and [Desktop](https://microsoft.github.io/react-native-windows/))

- Use RapydScript (Python transpiler to Javascript, currently ES5 for compatibilty) in server-side (Node.js) and client-side, because Python's slogan "readability counts" is true.

- So we will have Python's readabilty, Javascript's performance (JIT Compilation) and async/parallel features, and NoSQL concurrency.

# How to use the Framework
To install just do `npm install` on the module directory

To run the server, do `node server.js` or pass `--clear-cache` to clear the cache

Modify app.conf to change port or other variables (Documentation is upcoming)

The React Native Webclient is on react/client folder, put it on nginx or something else or simply open index.html on a browser, it should work. Or if you're lazy enough you can change local_app variable in app.conf to True. Then, open the server url (don't forget the port).

# Async/Await support
We added async/await support out of the box for modern [browsers](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#Browser_compatibility), React Native, and **older versions of node.js** (using yortus's [asyncawait](https://github.com/yortus/asyncawait)) to minimize Promise chaining and add readability for asynchronous operations. But, because we support old node.js versions (some platform like RHEL 6 on Power Architecture only have Node.js 6 compiled for the platform) the syntax is different with Python's Async/Await. For example instead of async and await being a keyword:

```python
async def get_current_qty(self):
    move_ids = await self.env['stock.move'].search(['product_id', '=', somevariable])
```

Async become a decorator, and await become an identical keyword but function-like:

```python
@async
def get_current_qty(self):
    move_ids = await (self.env['stock.move'].search(['product_id', '=', somevariable]))
```

Or

```python
@async
def get_current_qty(self):
    move_ids = await [self.env['stock.move'].search(['product_id', '=', somevariable])]
```

On Node.js version below 7.6.0 the async decorator will be translated to [asyncawait's](https://github.com/yortus/asyncawait) async call and make the function returns a Promise (just like native [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)) and the function-like await to the library's await call. But on newer Node.js versions, modern browsers and React Native the decorator will only turn the function to an [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function).

# What's still undecided
- Wether to use original Rapydscript https://github.com/atsepkov/RapydScript rather than https://github.com/kovidgoyal/rapydscript-ng (for now I use rapydscript-ng)


- **DEVELOPER CHOICE** Use PouchDB Server (leveldb) or CouchDB (now CouchDB but I use in-memory db for testing). There are so many adapters for PouchDB ranging from MySQL, SQLite, to Facebook's RocksDB. The most common and decent is Google's LevelDB but you're free to choose an adapter and configure it on app.conf

All feedback and advice are appreciated
