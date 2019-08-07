using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.Person
{
    public class PersonInfo
    {
        public int PersonId { get; set; }
        public string PersonName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
        public string Username { get; set; }
        public int GroupId { get; set; }
    }

    public class PersonReturnInfo
    {
        public int RowNo { get; set; }
        public int PersonId { get; set; }
        public int GroupId { get; set; }
        public string PersonName { get; set; }
        public string GroupName { get; set; }
        public string Mobile { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public bool IsActive { get; set; }
    }
}
