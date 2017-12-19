# Object-Relational Mapping for PouchDB/CouchDB and Framework inspired by Odoo
After years developing applications with *magic* MVC and ORM included with it, I started to think even though these ORM Frameworks and relational-databases are powerful. They lack some important points that needs to be fixed.

Now Framework is on Beta Stage!

# Screenshots
![alt text](https://lh3.googleusercontent.com/6eMONy2QopTAY8XmomagfHElmf5E8_wpLLJQ7pX4fEX2EroBbwFBspoQf1e8R-WC9zaFjVx4HOq2lAr_9H6RPogd5SNMzka-afEiu-tsFO-5qzPPFyVPy9JJ6051lzmQdJxIvUl_E-dSXVgRvz4UupvlQ-xVm3JplMzoUNsR2Wg8DZj0AuXl_QRXGc-DADYflHxm6NaCvyRQCaQjJC3zOWBJ1-0g---K0SYz3vW24TzHELAuLKrPlJuXf-3rpxt9mFIKmPEgIM_RNLmq5f8jW4MZb8Quh9K9ALnL0jBL7VgqC-UoSCLP9CoKey2uY3m64uISfRKJjtCFNyUgmSZ3JftKalzBfNqAyG8smBv1_cXkByoIFTYEnU56aJEZB0iRFl7ArWrFBERlI6Bv_IoLWcwUDa6VOHMycbm77S26MO22uzxh1cI4k9XUjkuJbWh1vyBHC98o-gDn8o1SXzM0e_9HzzyVdemJRZ0-dg9-4gdstZo-8H39KINnTMVpujJyO2c2tRM3jMQM4b3gny55D6Hk3IISbg1FL2faye8L5docu7j1cdrUJaUWscoHojh7GOoLr-4NB7KCQUtKEEs48kmbntse42A9scgxhgE=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/mUJYnT6lDA2KXbrgYbBu6aYb7jsVKImqATqLW2rVyFeOCi3uISNdEV49UZXd0fY3E0b_oXD9iFyrT8kOnp2F1Eio0TzQKs9VwerpNCtQEa-GXTDH1FJJgrK3k0Nt2uH84v0i-uufS7dOY-mvTBRNkItUzYVX135OYrUtAoS5S1O8wwJLqvbUe6ngr9ZyT_Xdc3X-oBiMdTtIKgsy0UB0IeUp4sE1ptEszFFIbtgH4MW8dGP_GAUfKEycV20uulj8FFgGdkMwQMe9KQc2YkKojwKC68xhchZeyqkATDzeDToPhGUQcyegnIu1wqjeM_7Q8FskvMglBeEQgmXreuqFbsupfdFikXmuZ0HRq3uDZfUqkOfsnejnTZrVoas12iDI3a_T6QhZDIhYIb2xn5uM0kz-3X098s45FsklwVyhaptaPREFBwxcp8Y4j6ggs-mY0gIto6cVQ4zo4xEQtSarD1ySf7WThRzH4VqcnkyIJoiKS6UWVvCVZxSgJgA4FZvIsWTrAzL3b74ai_7y5N0J7VvDYYNTv2lhpN9A1RJdqMTMqg6SCFO3S8e01dIgc38Ec5-ILuOfhvGwoa0JAQYYYjD1oaM_uVSJ8PJQ1nA=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/Bu4voQkjOyCgkKFCsnt-YxOQsQgGu3YUwSzmlnyKgawmp5MjhSLmVA7cDVbleK9ohX3b-2i3dmVtRd1_Un9RWD7hkpGJtP5TVlGdx2fCp-MKWpKWwDThWiWfMApT4kmjYoKEnmLWRMJsKrSgeGNO3RRQJBoRYosjDjJSrnwcQtNRgiNs8ZYvKuBlLY-U_ODZlBS3vLXCI7NJi_gh9c65uqbbHY3VOnx6TYWdgpVwZTynVOtPDlRde1Xx4aW_vaLbtRSV3sKUNOfk8eCaFbPeGpvnzw2xSHcKLepjGtMIHMWJnqbZ92s8jMLolkmxch9BL16sY-0CFvSy_XkAD0xULTcoYtU03zlSMZAecgYXeuAhw_GeokJt1cJ_uObFfZfPT3sNKodLxZgCAGSfKfHhvaLWOPPri7sczzlc9AiEpRtrwjH8qYl4qzVPuQPXpVx-wR7SGPVqnA-P2TBr36YTKYSsQABpf-b_n8DYvFhHoZ-bi2Ou0xaM-p4rWtLvXYppOd-GC7O0rigszBUjpeeA9Wv1j2B3T5V7G9vYfVWU3httC8B8mW02HjEgUzTlmcs7XDFBoEuDIJWI5CQmeE8l75etnaHC-jPd51EzsYU=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/rV4rGRPK26hfT1oCbU3LGU6NEAetvx900t4MUmP8yzqZ-pBEkj6xZ866F82YgYktYc4eWFBnuvm4B-m2-BxQE-LwErCF3HlyyKndtBSfacCpGlZ3ZI7V1Z3ciucKah-w0vHtzoY2puUWA3JJxGDAYiCQ47TJUXQxZ3c6NhrPgzw6yo_wSwBqoVaU4vkk_oNgp_-8YaEeTUgk_zRSeDXyB6C-1qh4NQj4kpi7c4pkLTYqNsxrbL9kWswp0RKowXr1-e99soW5ea-akR7Q8hXyKd8eJFND3hvNrzGFsKnVDR1cr4PMZPdht1maNPp1EgFPc0fr1rs16oq3IIlB030CRWtrF_s9gi2rxSugAOh6Aj0tD55myvzhDF9VtvbHl6AurTEaeGEKGQN32lxIaaMO9jCGxBfneTGMBM1zakqL3jzAwTdJ4vP5tOxUviEBMlGWZrFLVNATwg5pWPRDxe_XWIx7gJLvCCHojXZft06sFfbLGK6rZRRR6VnD2BzErHCubBhhlz7r_4hWD0YcqjNaYD7v-wwzb3GnLovYsjCdyv7yiROLG9rcVACdTH2zOvAaNm-YdvDIy6UVJWg_qV8mucziCW9Kv5s0sjbQj9Y=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/mo9TLGaLrQrHZczHMnwNfaTcZIcjTEh40MYGO1f2i9YopfjTZgSbfDn_HoiHcVQeGtjvQKc-_2o_AuCwfbQlBQFqzZjJB2EZMjX8jQ0vqgHbfvEtnKpJvJrqhIWuObEGn2fVqNrHQ97hCfQQ43Hfc_zYwepX_Kn8gDgJCa7nUTrIVPXKl4RhNcArOl0i3JH5uEU_ouYAi3XoH5xKQnrM1Ws_RdZrL5WfpYy-R3Sj46RIAj_xIpAUcVbI0NiZ4DGRwtBHvYUKflWiv3Ucyg4VWn_8KAR31b-MLndnk1ViFuunUErxdE_PxtZ7-1Aenegcr__yCXddRwQuZxX49LzhSz--heX5-yDZr5VbW3LXjE83lHoo92WkzX7U1BZuqUDRokCMkmDIBxN-Gykw8Ttkzg5inv1bvVuH7S3qBnDoCjxYT2N-GNUNLbGUwpeK1ZrLP9KOs_QRL5m8S7XUJZb_TfVdmKeTfGNeBxFXfqvKfyev8qKzLr0RMY8m9Y_Bb5Swc22jfJe4QpwGEbPeFL8CRoTmPpBJVW_XwF3clxUbaWVtppoMUKKVASnML2Cmj4-rMe7rVnYvQVCD-_kbtxqxUDrNXciv193OtjgkGJc=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/gOB-oOV9Dwmw2X_y3OtSqf_QEKeyLaiapMh1cUmfFPRn8XGYrukVW-TnuMfTZjvhyJqN2BNPVh5X6TBqF-06gtuHKkx1Rt4anTvvnNSvlixURdsJb-inLdLVJYMna97mcm6MbtMST9TsSqkkpjoI-0LRnaYgqBM0pG-VxfkPBANaQpvuiJuOFdH2ZLDs_BKZ27zI6wzOHODLJyF_Z1Utw7X_HUlQoxf8hU4zTTYkS331CxtmaYH7bedA-EuvNzytSJedSegzF__V3GrklV1dJVfpCD45ZRwY2qESLCYgdDPX9t0XxZcRyLditmhcu51Dah8XSHUsuTDvZzeZuEtb3rdNDRKYN7I3MP84QQgD9lF9BPFTlCoUEs8Rs_Iffd0Y042RwkiDzqQofpL76nijIAgsIl6bseG_pMEi2xXThhj07J-6WnXfVRp5a2z_Fj2MVwa6c2_OIzWdyWrk8AiZjuK0U6na06VpvIuXYRozzsMK9vGAeFFvJy-QTP1pbppxe42UWjomQ0qoYMF-gOL0pCpRnNpUlod-v81fCOafq176aTgqj2qNrM1i2VrHeP3DwFMKg1ffqbA1gR7OFrN47HEeylGPGuS47ZVkwgQ=w868-h542-no)
![alt text](https://lh3.googleusercontent.com/gBotHnlOZQSeOmGKOY-ud3anoK4-QWgNx1Z-GzsDi-qqspFNX7pvN8ptjZ-3Nh0z4vO5Mxow5ib9W67cahthV2wSZGilFRyZASx3GhUZkertzRj1CLRatiOseBPoe_ov5eQ7j_YLGsL3KPpHYcrSSP-Hj2QhLDNgKMbN0uS7c2eMub1fnzFydZUcP7Zi1PdBa0dy4u9nMcFvmNR4Os_Ez1J2YTDm1moh-ObaZqH5gKakcJFuAkFsbFAiLZ--GRCIK35tj8pAJfUTy-ZwdqIKiw0ZaBQijblyJsrMay0fievxT35CPr-W83qMF00glum335ASGsFD8Kpy6F1JLX5yAg04jBIypbtslkVIxjiEoo-4cS6o2kOyFDN7kblajRVsPkMVROpAMgQVJRgZgELvbU6BshT79OlM_ZYC-9P884dM6SgqNXzLjCXQ2yE36YylepEHFb71j2y0TbeKsChiztfkZjgOkRxlunHe8Lhir4LZ0-gGe4BQe3priJm3IDpEQRfLaGpcHp10JhOxuzBBMap6R_yY6Pc6CLB64fdhlT_r917TfAAU-JFgMQSApXaz63ZdOoEk73unANNLdJ9uc6bTMuFnyLnFhKk6muU=w479-h542-no)
![alt text](https://lh3.googleusercontent.com/ev4yZ-QEFIn6bHxCgR8FfpGHbp02B0KN4CUOEoQaxQfXJFnsJoDDpqXMry0DgC4K-Am3nqVdI_LyhI4Rse-n2s6bwPPCoZER3uNSE7AIOx8nlW95ZX-rYri1Rd21Xs7KiSaJdhf1xcOi7S5DiKZjWbO6RbbJGLLr_oecjCw6p_7BwjJmPz9C9L5bE6P5Q_oqD1mmVxzUILEeFcQYcopu9Z8sB28WDB2W-9OzEvxy49xw2kJpzgoSseZRBgr1ctySOuR1EDJsOG6P4Xc4st0glRh7C-R3M8pOV4Od_LvX0u1OKgQJ5Ty0xucAOOavMdryHjeGwfoVHNzXTd35m_mv2xwHg2cbS1D2uR6HZAbMJRDPrLVIdP1qQeR7B7hIHFJ02-X7eT0v7njDwbq7SVf9QIo0tsNV-9Qy3ZEqjWYS4Fo-ONytipmjmREYhmp_rx1YQaVoV77ykkY_oP8kkVh0A5HHzsJ2BwgwPU4scSWxLbpkw9_alGNitJ02be4Fm4AsvwkFNiEpiSLcEdacgqZS4zsfVW8AfdjegOkkrzLOD9AtawIHoV7Bpj9dUVLVEjP0J0-xokV9JXs9NeXMKmRqX7DFM4BxuzDfYuPKwZ8=w478-h542-no)

# Purpose of this project
- Creating an ORM for PouchDB/CouchDB which is a non-relational database or simply called NoSQL (except PouchDB that can be configured to use SQLite, etc), with a fabulous sync feature (https://pouchdb.com/guides/replication.html), offline capabilities, revision management, and performance. One more thing, ITS JSON!! (ORM Repo https://github.com/rafi16jan/pouchdb-orm) Done ✓

- Build a *not so magic* server-side MVC or PWA (Progressive Web Apps that only rely to RESTFul APIs and can be ran offline, either with service worker or local PouchDB) Framework. I prefer PWA, but I still need recommendation. (Framework Repo https://github.com/rafi16jan/rapyd-framework) Ready ✓

- Use RapydScript (Python transpiler to Javascript, currently ES5 for compatibilty) in server-side (Node.js) and client-side, because Python's slogan "readability counts" is true. I managed to build full-customized ERP based on customer's needs with Odoo. But the performance is not good. Done ✓

- So we will have Python's readabilty, Javascript's JIT Compiler performance, and NoSQL concurreny with sync! If you have experiences with concurrent user greater than 150-200 you'll know how without sync two requests writing to the same record can make conflicts.

# How to test
To install just do `npm install` on the module directory

To test the ORM read the test.pyj file, if you know Odoo you should feel familiar with the code.

To execute it `node ./node_modules/.bin/rapydscript -x test.pyj`, or if you encounter bugs remove the cache too `rm -f */*.pyj-cached && node ./node_modules/.bin/rapydscript -x test.pyj`

To test the Framework read the server.pyj file, it is the file that contains the main controller (the Class is also similar to Odoo's http.Controller)

To execute it `rm -f */*.pyj-cached && node ./node_modules/.bin/rapydscript -p modules -x server.pyj`

The Webclient is on client folder, put it on nginx or something else or simply open it on a browser. It should work.

# What's In-progress
So lately I've been requested to finish this project so I worked on it. And now the plain ORM is ready for use (although not tested heavily). Now I'm developing the PWA for the client side. In the future I'll made the documentation for all APIs and ORM logic, but for now I'll just point the fundamentals.

- The ORM is designed to mimic Odoo's ORM, so if you're an Odoo Developer you'll be familiar with all the logic and style

- Both server-side and client-side will have the same *codebase*, why? Because it'll save development time. But isn't it unsecure? Yes and no, in fact you can actually set all code you write to be executed only on server-side (with ajax ofcourse). The client-side execution is for the offline feature (that should be revalidate on the server side).

- The database that will be created is both on server-side and client-side. Multi databases on server-side and single database on the client-side for offline use. With this scenario user can first save changes on the device and then upload it when he wants (or internet coverage). So no data-loss.

- Even though this framework is designed to mimic Odoo, there are **differences**. Odoo is Python while this is Javascript that written on Python's syntax. So, learn about anonymous function, asynchronous operation (Promises, Callback), and any other else about Javascript.

- All client aspects (Menu, List, Form) are only declared on the server, the rendering, processing, will be performed on client. In my Webclient, I provided some functions to help the process.

- The client ORM should be loaded after login. So if you want to build your own Webclient sent POST request to /api/login and evaluate the client_js argument on the returned JSON.

- The client ORM declare some global variables. tools, models, and db. The DB variable is not server's database object, but the client's.

- If you are a hardcore Javascript developer (especially ES6). I know my Webclient isn't good, but I doesn't have time to learn ES6 so I can't waste more time to delay the project. Just build a Webclient yourself if you want to help. I really apreciate it.

# What's still undecided
- Wether to use original Rapydscript https://github.com/atsepkov/RapydScript rather than https://github.com/kovidgoyal/rapydscript-ng (for now I use rapydscript-ng)

- Server-side MVC (like Django, Odoo) or PWA with RESTFul Webservices (Custom REST API Controllers or CouchDB's REST API), currently I develop the PWA

- Use PouchDB Server (leveldb) or CouchDB (now CouchDB but I use in-memory db for testing https://github.com/pouchdb-community/pouchdb-memory)

- Custom authentication with token (CSRF if MVC) or CouchDB authentication (http://docs.couchdb.org/en/2.1.0/api/server/authn.html)

All feedback and advice are appreciated
