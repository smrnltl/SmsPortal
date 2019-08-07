using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.data
{
    public class PagedData<T>
    {
        public IEnumerable<T> Data { get; set; }

        public Pager Pager { get; set; }
    }

    public class Pager
    {
        public int PageNo { get; set; }

        public int ItemsPerPage { get; set; }

        public int PagePerDisplay { get; set; }

        public int TotalNextPages { get; set; }

        public int TotalCount { get; set; }
    }

}
