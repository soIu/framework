# Object-Relational Mapping for PouchDB/CouchDB inspired by Odoo
After years developing applications with *magic* MVC and ORM included with it, I started to think even though these ORM Frameworks and relational-databases are powerful. They lack some important points that need to be fixed.

# Purpose of this project
- Creating ORM for PouchDB/CouchDB wich is a non-relational database or simply called NoSQL (except PouchDB that can be configured to use SQLite, etc), with a fabulous sync feature (https://pouchdb.com/guides/replication.html), revision management, and performance. One more thing, ITS JSON!!

- Build a *not so magic* server-side MVC or PWA (Progressive Web Apps that only rely to RESTFul APIs and can be ran offline, either with service worker or local PouchDB). I prefer PWA but who knows, I need advice.

- Use RapydScript (Python transpiler to Javascript, currently ES5 for compatibilty) in server-side (Node.js) and client-side, because Python's slogan "readability counts" is true. I managed to build full-customized ERP based on customer's needs with Odoo. With a horrible performance...

- So we will have Python's readabilty, Javascript's JIT Compiler performance, and NoSQL concurreny with sync! If you have experiences with concurrent user greater than 150-200 you'll know how without sync two requests writing to the same record can make conflicts.

# What's still undecided
- Wether to use original Rapydscript https://github.com/atsepkov/RapydScript rather than https://github.com/kovidgoyal/rapydscript-ng (for now I use rapydscript-ng)

- Server-side MVC (like Django, Odoo) or PWA with RESTFul Webservices (Custom REST API Controllers or CouchDB's REST API)

- Use PouchDB Server (leveldb) or CouchDB (now CouchDB but I use in-memory db for testing https://github.com/pouchdb-community/pouchdb-memory)

- Custom authentication with token (CSRF if MVC) or CouchDB authentication (http://docs.couchdb.org/en/2.1.0/api/server/authn.html)

All feedback and advice are appreciated
