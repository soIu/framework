# Rapyd Framework
An Object-Relational Mapping for PouchDB/CouchDB and Framework inspired by Odoo

# What's New

- New Frontend with React/Preact and full ES6, allowing ORM operations to be declared with async-await. Making it more performant and easier to do Parallel and Scalable code.
- Full external JS libraries compatibility, using CommonJS on Node and Webpack on browser.
- Full React Components compatibility, making it easier to build Frontend UI even on React Native.
- Upcoming Python/Odoo backend compatibility. For developers who prefer Python (Flask) or Odoo on server-side rather than Node.js https://github.com/rafi16jan/rapyd-odoo
- Have some success PoC and one giant automobile client in Indonesia on Production. I'll post some details later on

# Purpose of this project
- Replacing or making an alternative to Odoo and Python's synchronous, I/O blocking design. Allowing us to develop asynchronous and performant ERP or Business Apps.

- Support some parallel programming paradigms consisting of Threads/Worker, Async-Await, Promises, [Promise.all](https://medium.freecodecamp.org/promise-all-in-javascript-with-example-6c8c5aea3e32), Coroutines (TODO), and MicroServices.

- Support hardware interfacing and IoT on the Client (Desktop Browser, Phone) and Server, using technologies like WebBluetooth, WebUSB, Cordova, Cordova/Node.js General Purpose I/0, WebAssembly, Node-gyp and we planned to support Microcontrollers or SBCs too.

- Creating an ORM for PouchDB/CouchDB, with a fabulous sync feature (https://pouchdb.com/guides/replication.html), offline capabilities, revision management, and performance.

- Build a *not so [magic](https://en.wikipedia.org/wiki/Magic_(programming))* server-side MVC or PWA (Progressive Web Apps that only rely to RESTFul APIs and can be ran offline, either with service worker or local PouchDB) Framework. (Framework Client Repo https://github.com/rafi16jan/rapyd-client)

- Use RapydScript (Python transpiler to Javascript, currently ES5 for compatibilty) in server-side (Node.js) and client-side, because Python's slogan "readability counts" is true.

- So we will have Python's readabilty, Javascript's performance (JIT Compilation) and async/parallel features, and NoSQL concurreny.

# How to use the Framework
To install just do `npm install` on the module directory

To run the server, do `node server.js` or pass `--clear-cache` to clear the cache

Modify app.conf to change port or other variables (Documentation is upcoming)

The Webclient is on client folder, put it on nginx or something else or simply open index.html on a browser, it should work. Or if you're lazy enough you can change local_app variable in app.conf to True. Then, open the server url (don't forget the port).

# How to test (Advanced)
To test the ORM read the test.pyj file, if you know Odoo you should feel familiar with the code.

To execute it `node ./node_modules/.bin/rapydscript -x test.pyj`, or if you encounter bugs remove the cache too `rm -f */*.pyj-cached && node ./node_modules/.bin/rapydscript -x test.pyj`

To test the Framework read the server.pyj file, it is the file that contains the main controller (the Class is also similar to Odoo's http.Controller)

To execute it `rm -f */*.pyj-cached && node ./node_modules/.bin/rapydscript -p modules -x server.pyj`

# What's still undecided
- Wether to use original Rapydscript https://github.com/atsepkov/RapydScript rather than https://github.com/kovidgoyal/rapydscript-ng (for now I use rapydscript-ng)

- (DECIDED) Server-side MVC (like Django, Odoo) or PWA with RESTFul Webservices (Custom REST API Controllers or CouchDB's REST API). PWA is already developed https://github.com/rafi16jan/rapyd-client

- (DEVELOPER CHOICE) Use PouchDB Server (leveldb) or CouchDB (now CouchDB but I use in-memory db for testing). There are so many adapters for PouchDB ranging from MySQL, SQLite to Facebook's RocksDB. The most common and decent is Google's LevelDB but you're free to choose and configure it at app.conf

- Custom authentication with token (CSRF if MVC) or CouchDB authentication (http://docs.couchdb.org/en/2.1.0/api/server/authn.html)

All feedback and advice are appreciated
