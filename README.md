# Solu Framework
A full featured, ORM-backed, isomorphic framework using RPython, GunDB and React Native.

# Transition to RPython and GunDB
We are transitioning major parts of our framework namely the language (RapydScript) and the database (PouchDB/CouchDB). The reason we choose RPython is plenty, if not many. An example would be that RPython compiles directly to WebAssembly making it faster than Javascript and on-par with the hottest languages like Rust and Go, and it is a great language to apply compile-time computation, execution, and code refactoring as every global variables, function decorators, and any code that is called outside of the main function are evaluated at compile-time.

And the reason we choose Gun is mainly because it aligns more with our goal to make a truly distributed, decentralized software. Our current implementation of the Pouch/Couch ecosystem is that we only use the full synchronization on the server-side and gradually synchronize records as the client fetch it, developing another layer of abstraction that doesn't truly distributes server load to the client (although with Javascript's event driven design the performance is still good). With GunDB, the distribution and the decentralization of user load will be truly achieved and because of the realtime design (using WebSocket) our existing [MVVM](https://en.m.wikipedia.org/wiki/Model–view–viewmodel) client architecture will be used more effectively.

# Difference from the old version
Although it is obvious this transition have breaking changes, the new ORM API syntax will still be exactly the same for the most parts. Only some functions and properties will be written like the Python/Odoo's counterpart (like the search method will use the list and tuple combination instead of an \*args and default properties of fields will not be changed to *defaults* as Javascript reserves it as a keyword).

# Purpose of this project
- Replacing or making an alternative to Odoo and Python's synchronous, I/O blocking design. Allowing us to develop asynchronous and performant ERP and IoT Apps.

- Support some parallel programming paradigms consisting of Threads/Worker, Async-Await, Promises, [Promise.all](https://medium.freecodecamp.org/promise-all-in-javascript-with-example-6c8c5aea3e32), [Serverless](https://en.m.wikipedia.org/wiki/Serverless_computing), and Micro Services.

- Support hardware interfacing and IoT on the Client (Desktop/Phone) and Server, using technologies like WebBluetooth, WebUSB, <del>Cordova, Cordova/</del>Node.js General Purpose I/O, React Native Modules, and we planned to support Microcontrollers or SBCs too.

- Creating an ORM for [GunDB](https://gun.eco). Adding a powerful relational mapping to a graph-based, distributed, decentralized database.

- Build a React Native client app for major platforms (Android, iOS, [Web](https://docs.expo.io/workflow/web/), and [Desktop](https://microsoft.github.io/react-native-windows/))

- Use RPython for readability and performance.

All feedback and advice are appreciated
