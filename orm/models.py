import drizzle__orm.pg__core.expressions as expressions
from drizzle__orm.sql import sql
from drizzle__orm.pg__core import QueryBuilder, PgDialect, pgTable, uuid, jsonb
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

    def __len__(self):
        return len(self._values)

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
        records._values = values
        return records

    def _prebrowse(self, ids):
        records = new (self.constructor())
        if not Array.isArray(ids): ids = [ids]
        self._values = [{'id': id, 'data': {}} for id in ids]
        return records

    async def _exec(self, query):
        result =  await self._db_worker.pglite.query(query.sql, query.params)
        return result.rows

    async def create(self, values):
        create_date = new (Date()).toISOString()
        if not Array.isArray(values): values = [values]
        for value in values:
            value.create_date = create_date
            del value.id
        insert = self.env[self._name]._db_orm.insert(self.env[self._name]._db_orm_table)
        records = await self._exec(insert.values([{'data': sql.raw(f"'{JSON.stringify(value)}'::jsonb")} for value in values]).returning({'*': __('*', sql)}).toSQL())
        recordset = self._new(records)
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
        records = await self._exec(update.set(values).where(expressions.inArray(sql.raw(f'id'), ids)).returning({'*': __('*', sql)}).toSQL())
        recordset = self._new(records)
        return recordset

    async def browse(self, ids):
        if not Array.isArray(ids): ids = [ids]
        query = new (QueryBuilder())
        records = await self._exec(query.select({'*': __('*', sql)})['from'](sql.raw(f'{self._table_name}')).where(expressions.inArray(self.env[self._name]._db_orm_table.id, ids)).toSQL())
        recordset = self._new(records)
        return recordset

    async def search(self, domain, **params): #limit=100, page=1, order=''):
        limit = params.limit or 0
        page = params.page or 1
        order = params.order or ''
        offset = params.offset or ((page - 1) * limit)
        query = {}
        start_or = False
        conditions = []
        table = self.env[self._name]._db_orm_table
        for args in domain:
            field, operator, value = args
            if operator == '=': conditions.push(expressions.eq(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == '!=': conditions.push(expressions.neq(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == 'in': conditions.push(expressions.inArray(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == 'not in': conditions.push(expressions.notInArray(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == '>': conditions.push(expressions.gt(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == '>=': conditions.push(expressions.gte(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == '<': conditions.push(expressions.lt(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == '<=': conditions.push(expressions.lte(sql.raw(f"data->'{field}'"), sql.raw(f"'{JSON.stringify(value)}'::jsonb")))
            elif operator == 'like': conditions.push(expressions.like(sql.raw(f"data->>'{field}'"), ('%' + value + '%') if not value.includes('%') else value))
            elif operator == 'ilike': conditions.push(expressions.ilike(sql.raw(f"data->>'{field}'"), ('%' + value + '%') if not value.includes('%') else value))
        query = new (QueryBuilder())
        query = query.select({'*': __('*', sql)})['from'](sql.raw(f'{self._table_name}'))
        if conditions.length:
            condition = conditions[0] if conditions.length == 1 else expressions['and'](*conditions)
            query = query.where(condition)
        records = await self._exec(query.toSQL())
        recordset = self._new(records)
        return recordset

    async def unlink(self, ids):
        delete_from = self.env[self._name]._db_orm.delete(self.env[self._name]._db_orm_table)
        await self._exec(delete_from.where(expressions.inArray(self.env[self._name]._db_orm_table.id, ids)).toSQL())
        return None

    def map(self, fn):
        results = []
        for value in self._values:
            results.push(fn(self._new(value)))
        return results

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
