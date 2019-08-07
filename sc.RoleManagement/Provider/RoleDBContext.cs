using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using sc.data;

namespace sc.RoleManagement
{
    public class RoleDBContext : DbContext
    {
        public RoleDBContext(): base("DefaultConnection") { }

        public async Task<PagedData<RoleInfo>> GetRoles(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_roles_getall]", p);

                return new PagedData<RoleInfo>
                {
                    Data = data.ReadAsList<RoleInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public async Task<RoleInfo> GetRoleById(string id)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@Id", id);

                var data = await this.ExecuteAsObjectAsync<RoleInfo>("[dbo].[usp_roles_getById]", p);

                return data;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeleteRole(string id)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@Id", id);

                return await this.ExecuteDbResultAsync("[dbo].[usp_roles_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
