from orm import models, fields, data
from ....database.auth.main import createLocalAuthWorker

auth_worker = createLocalAuthWorker('res_users_auth')

class ResUsers(models.Model):
    _name = 'res.users'

    name = fields.Char(string="Name", required=True)
    login = fields.Char(string="Username/Email", required=True)

    async def auth(self, login, password):
        record, rest = await auth_worker.pglite.query(models.sql.raw(f"select password from res_users_auth where login = '{login}'").toQuery({}).sql)
        if not record or record.password != password: return False
        return True

models.register(ResUsers)

async def add_admin():
    default_login = 'admin'
    default_password = '998ed4d621742d0c2d85ed84173db569afa194d4597686cae947324aa58ab4bb'
    record, auth_result = await Promise.all([
        models.env['res.users'].search([('login', '=', 'admin')], limit=1),
        auth_worker.pglite.query(models.sql.raw("select password from res_users_auth where login = 'admin'").toQuery({}).sql),
    ])
    if not len(record):
        models.env['res.users'].create({'login': 'admin', 'name': 'Administrator'})
    if not len(auth_result.rows):
        auth_worker.pglite.query(models.sql.raw(f"insert into res_users_auth (login, password) values ('{default_login}', '{default_password}')").toQuery({}).sql)

data.register(add_admin)
