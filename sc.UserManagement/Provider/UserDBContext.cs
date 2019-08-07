using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using sc.data;

namespace sc.UserManagement
{
    public class UserDBContext : DbContext
    {
        public UserDBContext(): base("DefaultConnection") { }

        public async Task<PagedData<UserInfo>> GetUsers(int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_users_getall]", p);

                return new PagedData<UserInfo>
                {
                    Data = data.ReadAsList<UserInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public async Task<UserInfo> GetUserById(string userId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@UserId", userId);

                var data = await this.ExecuteAsObjectAsync<UserInfo>("[dbo].[usp_users_getById]", p);

                return data;
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeleteUser(string userId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@UserId", userId);

                return await this.ExecuteDbResultAsync("[dbo].[usp_users_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
