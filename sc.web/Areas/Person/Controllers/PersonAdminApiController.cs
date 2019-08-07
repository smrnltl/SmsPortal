using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using sc.web.Controllers;

using sc.Person;
using System.Threading.Tasks;

using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using sc.web.Models;
using sc.data;

namespace sc.web.Areas.Person.Controllers
{
    [System.Web.Mvc.RouteArea("Person", AreaPrefix = "")]
    public class PersonAdminApiController : BaseApiController
    {
        string username = HttpContext.Current.User.Identity.Name;

        private PersonDBContext _personDbContext;
        public PersonDBContext PersonDBContext
        {
            get
            {
                if (this._personDbContext == null)
                    this._personDbContext = new PersonDBContext();
                return _personDbContext;
            }
        }

        [HttpGet]
        [Route("Admin/GetPersons")]
        public async Task<IHttpActionResult> GetPersons(string personName, string mobile, string email, byte isActive, int groupId,
            int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                if (string.IsNullOrEmpty(personName)) personName = "";
                if (string.IsNullOrEmpty(mobile)) mobile = "";
                if (string.IsNullOrEmpty(email)) email = "";
                var data = await PersonDBContext.GetPersons(personName, mobile, email, isActive, groupId, pageNo, itemsPerPage, pagePerDisplay);
                return Ok(data);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        [Route("Admin/GetPersonById")]
        public async Task<IHttpActionResult> GetPersonById(int id)
        {
            try
            {
                var data = await PersonDBContext.GetPersonById(id);
                return Ok(data);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }


        [HttpPost]
        [Route("Admin/DeletePerson")]
        public async Task<IHttpActionResult> DeletePerson(int[] persons)
        {
            try
            {
                var result = await PersonDBContext.DeletePerson(persons, username);
                if (result != null)
                    return Ok(result);
                return InternalServerError();
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        [HttpPost]
        [Route("Admin/SavePerson")]
        public async Task<IHttpActionResult> SavePerson([FromBody] PersonInfo person)
        {
            person.Username = username;
            var result = await this.PersonDBContext.SavePerson(person);
            if (result.IsDbSuccess)
                return Ok(result);
            return InternalServerError();
        }

        [HttpPost]
        [Route("Admin/ImportPersons")]
        public async Task<IHttpActionResult> ImportPersons()
        {
            var req = HttpContext.Current.Request;
            var file = req.Files["persons"];
            int groupId = int.Parse(req.Form["groupId"]);
            var result1 = new PersonExcelReader().ReadData(file.InputStream, file.FileName, 1048576, ".xlsx");

            var result2 = await this.PersonDBContext.ImportPersons(result1.Item2, groupId, username);
            if (result2.IsDbSuccess)
                return Ok(result2);
            return InternalServerError();
        }
    }
}