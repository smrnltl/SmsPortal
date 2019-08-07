using System;
using System.Data;
using Dapper;

namespace sc.data
{
    public class Parameters
    {
        private DynamicParameters _params;

        public DynamicParameters Params
        {
            get { return this._params; }
            private set { this._params = value; }
        }

        public Parameters()
        {
            this._params = new DynamicParameters();
        }

        public void Add(string name, object value, DbType? dbType, ParameterDirection? direction, int? size)
        {
            this._params.Add(name, value, dbType, direction, size);
        }

        public void Add(string name, object value = null, DbType? dbType = default(DbType?), ParameterDirection? direction = default(ParameterDirection?), int? size = default(int?), byte? precision = default(byte?), byte? scale = default(byte?))
        {
            this._params.Add(name, value, dbType, direction, size, precision);
        }

        public T Get<T>(string name)
        {
            return this._params.Get<T>(name);
        }
    }
}
