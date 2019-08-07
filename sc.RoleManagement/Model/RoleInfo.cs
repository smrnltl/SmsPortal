using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.RoleManagement
{
    public class RoleInfo
    {
        public string Id { get; set; }
        public string Name { get; set; }
    }

    public class UsersInRoleModel
    {
        public string Id { get; set; }
        public List<string> EnrolledUsers { get; set; }
        public List<string> RemovedUsers { get; set; }
    }

    public class RolesInUserModel
    {
        public string Username { get; set; }
        public string[] AddRoles { get; set; }
        public string[] RemoveRoles { get; set; }
    }

}
