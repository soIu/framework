# Solu Framework
A full featured, ORM-backed, isomorphic framework using RPython, Pouch/CouchDB and React.

# Purpose of this project
- Replacing or making an alternative to Odoo and Python's synchronous, I/O blocking design. Allowing us to develop asynchronous and performant ERP and IoT Apps.

- Support some parallel programming paradigms consisting of Threads/Worker, Async-Await, Promises, [Promise.all](https://medium.freecodecamp.org/promise-all-in-javascript-with-example-6c8c5aea3e32), [Serverless](https://en.m.wikipedia.org/wiki/Serverless_computing), and Micro Services.

- Support hardware interfacing and IoT on the Client (Desktop/Phone) and Server, using technologies like WebBluetooth, WebUSB, Cordova, Cordova/Node.js General Purpose I/O, React Native Modules, and we planned to support Microcontrollers or SBCs too

- Build a React client app for major platforms

- Use RPython for readability and performance.

# Transition to RPython and New DB engine
We are transitioning major parts of our framework namely the language (RapydScript) and the database engine. The reason we choose RPython is plenty, if not many. An example would be that RPython compiles directly to WebAssembly making it faster than Javascript and on-par with the hottest languages like Rust and Go, and it is a great language to apply compile-time computation, execution, and code refactoring as every global variables, function decorators, and any code that is called outside of the main function are evaluated at compile-time.

# Difference from the old version
Although it is obvious this transition have breaking changes, the new ORM API syntax will still be exactly the same for the most parts. Only some functions and properties will be written like the Python/Odoo's counterpart (like the search method will use the list and tuple combination instead of an \*args, and default properties of fields will not be changed to *defaults* like it used to).

All feedback and advice are appreciated
