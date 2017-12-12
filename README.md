# Object-Relational Mapping for PouchDB/CouchDB and Framework inspired by Odoo
After years developing applications with *magic* MVC and ORM included with it, I started to think even though these ORM Frameworks and relational-databases are powerful. They lack some important points that needs to be fixed.

# Purpose of this project
- Creating an ORM for PouchDB/CouchDB which is a non-relational database or simply called NoSQL (except PouchDB that can be configured to use SQLite, etc), with a fabulous sync feature (https://pouchdb.com/guides/replication.html), offline capabilities, revision management, and performance. One more thing, ITS JSON!! (ORM Repo https://github.com/rafi16jan/pouchdb-orm) Ready ✓

- Build a *not so magic* server-side MVC or PWA (Progressive Web Apps that only rely to RESTFul APIs and can be ran offline, either with service worker or local PouchDB) Framework. I prefer PWA but who knows, I need advice. (Framework Repo https://github.com/rafi16jan/rapyd-framework) In-progress •

- Use RapydScript (Python transpiler to Javascript, currently ES5 for compatibilty) in server-side (Node.js) and client-side, because Python's slogan "readability counts" is true. I managed to build full-customized ERP based on customer's needs with Odoo. With a horrible performance... Done ✓

- So we will have Python's readabilty, Javascript's JIT Compiler performance, and NoSQL concurreny with sync! If you have experiences with concurrent user greater than 150-200 you'll know how without sync two requests writing to the same record can make conflicts.

# How to test
To install just do `npm install` on the module directory

To test the ORM read the test.pyj file, if you know Odoo you should feel familiar with the code.
To execute it `node ./node_modules/.bin/rapydscript -p orm/ -x test.pyj`, or if you encounter bugs remove the cache too `rm -rf orm/*.pyj-cached && node ./node_modules/.bin/rapydscript -p orm/ -x test.pyj`

To test the Framework read the server.pyj file, its the file that contains the main controller (the Class is also similar to Odoo's http.Controller)
To execute it `rm -rf orm/*.pyj-cached && node ./node_modules/.bin/rapydscript -p orm/ -x server.pyj`

# What's In-progress
So lately I've been requested to finish this project so I worked on it. And now the plain ORM is ready for use (although not tested heavily). Now I'm developing the PWA for the client side. In the future I'll made the documentation for all APIs and ORM logic, but for now I'll just point the fundamentals.

- The ORM is designed to mimic Odoo's ORM, so if you're an Odoo Developer you'll be familiar with all the logic and style

- Both server-side and client-side will have the same *codebase*, why? Because it'll save development time. But isn't it unsecure? Yes and no, in fact you can actually set all code you write to be executed only on server-side (with ajax ofcourse). The client-side execution is for the offline feature (that should be revalidate on the server side).

- The database that will be created is both on server-side and client-side. Multi databases on server-side and single database on the client-side for offline use. With this scenario user can first save changes on the device and then upload it when he wants (or internet coverage). So no data-loss.

- Even though this framework is designed to mimic Odoo, there are **differences**. Odoo is Python while this is Javascript that written on Python's syntax. So, learn about anonymous function, asynchronous operation (Promises, Callback), and any other else about Javascript.

# What's still undecided
- Wether to use original Rapydscript https://github.com/atsepkov/RapydScript rather than https://github.com/kovidgoyal/rapydscript-ng (for now I use rapydscript-ng)

- Server-side MVC (like Django, Odoo) or PWA with RESTFul Webservices (Custom REST API Controllers or CouchDB's REST API), currently I develop the PWA

- Use PouchDB Server (leveldb) or CouchDB (now CouchDB but I use in-memory db for testing https://github.com/pouchdb-community/pouchdb-memory)

- Custom authentication with token (CSRF if MVC) or CouchDB authentication (http://docs.couchdb.org/en/2.1.0/api/server/authn.html)

All feedback and advice are appreciated
