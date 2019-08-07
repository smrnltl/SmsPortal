using System.Collections.Generic;
using System.IO;

namespace sc.import
{
    public static class CsvToArrayProvider
    {
        public static IEnumerable<string[]> ToArray(this Stream stream, bool skipFirstRow)
        {
            using (StreamReader reader = new StreamReader(stream))
            {
                List<string[]> data = new List<string[]>();

                string line;
                bool firstRow = false;

                while ((line = reader.ReadLine()) != null)
                {
                    if (!firstRow)
                    {
                        firstRow = true;
                        continue;
                    }

                    data.Add(line.Split(','));
                }

                return data;
            }
        }
    }
}
