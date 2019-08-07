using System;
using Dapper;
using System.Collections.Generic;
using System.Data;


namespace sc.data
{
    public class DapperDataReader
    {
        SqlMapper.GridReader _reader;
        IDbConnection _connection;

        public SqlMapper.GridReader Reader
        {
            set { this._reader = value; }
        }

        public IDbConnection Connection
        {
            set { this._connection = value; }
        }

        public IEnumerable<T> ReadAsList<T>()
        {
            return this._reader.Read<T>();
        }

        public T ReadAsObject<T>()
        {
            return this._reader.ReadSingleOrDefault<T>();
        }

        public void Close()
        {
            var state = this._connection.State;
            if (state != ConnectionState.Closed) this._connection.Close();

            this._reader = null;
        }

        public void Dispose()
        {
            this.Close();
        }
    }
}
