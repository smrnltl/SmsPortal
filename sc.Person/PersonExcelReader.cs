using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using sc.data;
using sc.import;

namespace sc.Person
{
    public class PersonExcelReader
    {
        public Tuple<DbResult, List<PersonInfo>> ReadData(Stream stream, string fileName, double allowedSizeKB, params string[] fileTypes)
        {
            bool success = false;
            string message = "";
            var data = new List<PersonInfo>();

            var result1 = FileValidator.ValidatFile(stream, fileName, allowedSizeKB, fileTypes);
            if (!result1.IsFileValid) message = result1.Message;
            else
            {
                var dt = stream.ToDataTable(true);
                data = ReadTable(dt);

                if (data != null && data.Any()) success = true;
                else message = "Could not read data";
            }

            var result = new DbResult
            {
                IsDbSuccess = success,
                DbMessage = success ? "Data read successfully" : message
            };

            return new Tuple<DbResult, List<PersonInfo>>(result, data);
        }

        public List<PersonInfo> ReadTable(DataTable dt)
        {
            if (dt != null && dt.Rows.Count > 0)
            {
                int len = dt.Rows.Count;
                var data = new List<PersonInfo>();

                for (var i = 0; i < len; i++)
                {
                    var r = dt.Rows[i];
                    if(!string.IsNullOrWhiteSpace(r[0].ToString()) && !string.IsNullOrWhiteSpace(r[0].ToString()))
                    {
                        data.Add(new PersonInfo
                        {
                            PersonName = r[0].ToString(),
                            Mobile = r[1].ToString(),
                            Email = r[2].ToString(),
                            Address = r[3].ToString()
                        });

                    }
                }

                return data;
            }

            return null;
        }
    }
}
