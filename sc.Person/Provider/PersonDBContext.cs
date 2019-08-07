using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using sc.data;

namespace sc.Person
{
    public class PersonDBContext : DbContext
    {
        public PersonDBContext(): base("DefaultConnection") { }

        public async Task<PagedData<PersonReturnInfo>> GetPersons(string personName, string mobile, string email, byte isActive, int groupId,
            int pageNo, int itemsPerPage, int pagePerDisplay)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PersonName", personName);
                p.Add("@Mobile", mobile);
                p.Add("@Email", email);
                p.Add("@IsActive", isActive);
                p.Add("@GroupId", groupId);
                p.Add("@PageNo", pageNo);
                p.Add("@ItemsPerPage", itemsPerPage);
                p.Add("@PagePerDisplay", pagePerDisplay);

                var data = await this.ExecuteMultipleAsync("[dbo].[usp_person_getAll]", p);

                return new PagedData<PersonReturnInfo>
                {
                    Data = data.ReadAsList<PersonReturnInfo>(),
                    Pager = data.ReadAsObject<Pager>()
                };
            }
            catch (Exception ex)
            {

                throw ex;
            }
            
        }

        public async Task<PersonReturnInfo> GetPersonById(int personId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PersonId", personId);

                var data = await this.ExecuteAsObjectAsync<PersonReturnInfo>("[dbo].[usp_person_getById]", p);

                return data;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public PersonReturnInfo GetPersonByIdSync(int personId)
        {
            try
            {
                Parameters p = new Parameters();
                p.Add("@PersonId", personId);

                return this.ExecuteAsObject<PersonReturnInfo>("[dbo].[usp_person_getById]", p);
            }
            catch (Exception ex)
            {

                throw ex;
            }
        }

        public async Task<DbResult> DeletePerson(int[] persons, string username)
        {
            try
            {
                var personsXML = new XElement("Root", persons.Select(x => new XElement("Persons", new XElement("PersonID", x)))).ToString();
                Parameters p = new Parameters();
                p.Add("@Persons", personsXML);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("[dbo].[usp_person_delete]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DbResult> SavePerson(PersonInfo person)
        {
            try
            {
                var p = new Parameters();

                p.Add("@PersonId", person.PersonId);
                p.Add("@PersonName", person.PersonName);
                p.Add("@Mobile", person.Mobile);
                p.Add("@Address", person.Address);
                p.Add("@Email", person.Email);
                p.Add("@IsActive", person.IsActive);
                p.Add("@Username", person.Username);
                p.Add("@GroupId", person.GroupId);

                return await this.ExecuteDbResultAsync("dbo.[usp_person_save]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<DbResult> ImportPersons(List<PersonInfo> persons, int groupId, string username)
        {
            try
            {
                var personsXML = new XElement("Root", 
                    persons.Select(x => new XElement("Persons", new XElement("PersonName", x.PersonName),
                                                                new XElement("Mobile", x.Mobile),                                   
                                                                new XElement("Email", x.Email),                                   
                                                                new XElement("Address", x.Address)                                  
                                                                            ))).ToString();
                var p = new Parameters();

                p.Add("@Persons", personsXML);
                p.Add("@GroupId", groupId);
                p.Add("@Username", username);

                return await this.ExecuteDbResultAsync("dbo.[usp_person_import]", p);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
