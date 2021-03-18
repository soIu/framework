from orm import models, fields

class Users(models.Model):
    _name = 'res.users'

    name = fields.Char(string="Name", required=True)
    login = fields.Char(string="Login", required=True)
    password = fields.Char(string="Password")

print 'Im imported'
