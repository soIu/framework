from orm import models, fields

class ResUsers(models.Model):
    _name = 'res.users'

    name = fields.Char(string="Name", required=True)

models.register(ResUsers)
