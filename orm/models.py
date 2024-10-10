import drizzle__orm.pg__core.expressions as expressions
from drizzle__orm.sql import sql
from drizzle__orm.pg__core import QueryBuilder, pgTable, uuid, jsonb
from drizzle__orm.pglite.driver import drizzle
from ..database.main import createLocalWorker
fields = require('./fields.py')

class Model:
    _name = 'base.base'
    _is_env = False

    id = fields.Char(string="ID (UUID)", required=True)

    @property
    def ids(self):
        return [value.id for value in self._values]

    def __init__(self):
        if self._name not in env:
            env[self._name] = self
            Object.defineProperty(env, self._name, {'writable': False, 'configurable': False})
            self._is_env = True
            self._db_worker = createLocalWorker(self._name.split('.').join('_'))
            self._db_type = 'pglite'
            self._db_orm = drizzle(self._db_worker.pglite)
            self._db_orm_table = pgTable(self._name.split('.').join('_'), {'id': uuid().primaryKey().defaultRandom(), 'data': jsonb()})
        self.env = env
        self._fields = {}
        self._values = []
        self._db_worker = self.env[self._name]._db_worker
        self._table_name = self._name.split('.').join('_')
        for key in Object.getOwnPropertyNames(self):
            field = self[key]
            if not isinstance(field, fields.Field): continue
            field.name = key
            self._fields[key] = field
            del self[key]
            Object.defineProperty(self, field, {'get': lambda: self._getattr(field), 'set': lambda value: self._setattr(field, value)})
            if self._is_env and field.index and field.name != 'id': self._db_worker.createIndex(field)

    @property
    def _is_singleton(self):
        if self._values.length == 1: return True

    def _getattr(self, field):
        if not self._values: raise new (Error('Expected singleton, but instead got an empty recordset'))
        if not self._is_singleton: raise new (Error('Expected singleton, but instead got a set of records'))
        if field == 'id': self._values[0].id
        return self._values[0].data[field]

    def _setattr(self, field, value):
        if not self._values: raise new (Error('Expected singleton, but instead got an empty recordset'))
        if not self._is_singleton: raise new (Error('Expected singleton, but instead got a set of records'))
        if field == 'id': raise new (Error('Cannot set ID'))
        self._values[0].data[field] = value

    def _new(self, values):
        records = new (self.constructor())
        if not Array.isArray(values): values = [values]
        self._values = values
        return records

    def _prebrowse(self, ids):
        records = new (self.constructor())
        if not Array.isArray(ids): ids = [ids]
        self._values = [{'id': id, 'data': {}} for id in ids]
        return records

    def _exec(self, query):
        return self._db_worker.pglite.query(query)

    async def create(self, values):
        create_date = new (Date()).toISOString()
        if not Array.isArray(values): values = [values]
        for value in values:
            value.create_date = create_date
            del value.id
        #records = await self._exec(query.insert(__('${self._table_name}', sql)).values([{'data': __('${JSON.stringify(value)}::jsonb', sql)} for value in values]).returning().toSQL())
        insert = self.env[self._name]._db_orm.insert(self.env[self._name]._db_orm_table)
        records = await self._exec(insert.values([{'data': __('${JSON.stringify(value)}::jsonb', sql)} for value in values]).returning().toSQL())
        recordset = self._new(recordset)
        return recordset

    async def write(self, values):
        if not values:
            promises = []
            for record in self:
                promises.push(record.write(values=record._values[0].data))
            await Promise.all(promises)
            return self
        ids = self.ids
        update = self.env[self._name]._db_orm.update(self.env[self._name]._db_orm_table)
        records = await self._exec(update.set(values).where(expressions.inArray(self.env[self._name]._db_orm_table.id, ids)).returning().toSQL())
        recordset = self._new(recordset)
        return recordset

    async def browse(self, ids):
        if not Array.isArray(ids): ids = [ids]
        query = new (QueryBuilder())
        records = await self._exec(query.select({'*': __('*', sql)})['from'](__('${self._table_name}', sql)).where(expressions.inArray(self.env[self._name]._db_orm_table.id, ids)).toSQL())
        recordset = self._new(recordset)
        return recordset

    async def search(self, domain, **params): #limit=100, page=1, order=''):
        limit = params.limit or 0
        page = params.page or 1
        order = params.order or ''
        db = data.get_db()
        offset = params.offset or ((page - 1) * limit)
        query = {}
        start_or = False
        conditions = []
        table = self.env[self._name]._db_orm_table
        for args in domain:
            field, operator, value = args
            if operator == '=': conditions.push(expressions.eq(table[field], value))
            elif operator == '!=': conditions.push(expressions.neq(table[field], value))
            elif operator == 'in': conditions.push(expressions.inArray(table[field], value))
            elif operator == 'not in': conditions.push(expressions.notInArray(table[field], value))
            elif operator == '>': conditions.push(expressions.gt(table[field], value))
            elif operator == '>=': conditions.push(expressions.gte(table[field], value))
            elif operator == '<': conditions.push(expressions.lt(table[field], value))
            elif operator == '<=': conditions.push(expressions.lte(table[field], value))
            elif operator == 'like': conditions.push(expressions.like(table[field], ('%' + value + '%') if value.includes('%') else value))
            elif operator == 'ilike': conditions.push(expressions.ilike(table[field], ('%' + value + '%') if value.includes('%') else value))
        query = new (QueryBuilder())
        query = query.select({'*': __('*', sql)})['from'](__('${self._table_name}', sql))
        if conditions.length:
            condition = conditions[0] if conditions.length == 1 else expressions['and'](*conditions)
            query = query.where(condition)
        records = await self._exec(query.toSQL())
        recordset = self._new(recordset)
        return recordset

    async def unlink(self, ids):
        delete_from = self.env[self._name]._db_orm.delete(self.env[self._name]._db_orm_table)
        await self._exec(delete_from.where(expressions.inArray(self.env[self._name]._db_orm_table.id, ids)).toSQL())
        return None

def __iter__():
    #self = None
    #JS('self = this')
    if self._is_env or not self._values.length: yield from []
    elif self._values.length == 1: yield self
    else:
        for value in self._values:
            yield self._new(value)

Model.prototype[Symbol.iterator] = __iter__

env = {}

def register(model_class):
    #Instantiate them once to make them registered
    new (model_class())

sql.expressions = expressions

__all__ = ['Model', 'env', 'sql', 'register']
__default__ = {'Model': Model, 'env': env, 'sql': sql, 'register': register}
