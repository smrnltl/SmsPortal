using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.import
{
    public class ExcelWriter
    {
        public void ListToWorksheet<T>(ExcelPackage pck, string sheetName, IEnumerable<T> list)
        {
            var ws = pck.Workbook.Worksheets.Add(sheetName);
            int cols = WriteHeader(ws, list.First().GetType());
            int rows = WriteData(ws, list);
        }

        protected int WriteHeader(ExcelWorksheet ws, Type t)
        {
            var headers = GetProperties(t);
            var len = headers.Count();
            for (var i = 1; i <= headers.Count(); i++)
            {
                ws.Cells[1, i].Value = FormatHeader(headers.ElementAt(i - 1));
                ws.Cells[1, i].Style.Font.Bold = true;
            }
            return len;
        }

        protected int WriteData<T>(ExcelWorksheet ws, IEnumerable<T> list)
        {
            ws.Cells[2, 1].LoadFromCollection<T>(list);
            return list.Count();
        }

        //protected void FormatCells(ExcelWorksheet ws, int rows, int cols, bool zeroAsEmpty)
        //{
        //    object value;
        //    for (var i = 1; i <= rows; i++)
        //    {
        //        for (var j = 1; j <= cols; j++)
        //        {
        //            value = ws.Cells[i, j].Value;
        //        }
        //    }
        //}

        protected IEnumerable<string> GetProperties(Type t)
        {
            var properties = t.GetProperties();
            return properties.Select(x => x.Name);
        }

        protected string FormatHeader(string name)
        {
            return name.Replace("__", "/").Replace("_", " ").Replace("PlusSign", "+").Replace("MinusSign", "-");
        }
    }
}
