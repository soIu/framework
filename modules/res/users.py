from orm import models, fields, tools, views, menu, data
from javascript import Object, asynchronous

class Users(models.Model):
    _name = 'res.users'

    name = fields.Char(string="Name", required=True)
    login = fields.Char(string="Login", required=True)
    password = fields.Char(string="Password")
    email = fields.Char(string="Email")
    phone = fields.Char(string="Phone")

if tools.is_server():
   default_admin_login = '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918'
   default_admin_password = '91c2271e5c57b60717b0ba057615173e3bdc9403fdb26832ff1c7dbe84760a3b'

   @asynchronous
   def create_admin():
       user_id = models.env['res.users'].search([('login', '=', default_admin_login)], 1).wait()
       if len(user_id): return
       models.env['res.users'].create(Object.fromDict({'name': 'Administrator', 'login': default_admin_login, 'password': default_admin_password})).wait()

   data.register(create_admin)

views.add('views/users.xml')

menu.add(id='users', string='Users', model='res.users', parent='settings', sequence=1)
