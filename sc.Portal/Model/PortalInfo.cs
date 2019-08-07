using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.Portal
{
    public class PortalGroupInfo
    {
        public int MessagePortalGroupId { get; set; }
        public int MessageTypeId { get; set; }
        public int MessageGatewayId { get; set; }
        public int GroupId { get; set; }
        public int[] Persons { get; set; }
        public bool IsSent { get; set; }
        public string MessageText { get; set; }
        public string Username { get; set; }
    }

    public class PortalReturnInfo
    {
        public int RowNo { get; set; }
        public int MessagePortalGroupId { get; set; }
        public int MessagePortalPersonId { get; set; }
        public int PersonId { get; set; }
        public int GroupId { get; set; }
        public string PersonName { get; set; }
        public string GroupName { get; set; }
        public string Mobile { get; set; }
        public string MessageText { get; set; }
        public bool IsSent { get; set; }
        public string Username { get; set; }
    }

    public class PortalPersonInfo
    {
        public int MessagePortalGroupId { get; set; }
        public int PersonId { get; set; }
        public bool IsSent { get; set; }
        public string Username { get; set; }
    }

    public class MessageTypeInfo
    {
        public int MessageTypeId { get; set; }
        public string MessageTypeName { get; set; }
    }

    public class MessageGatewayInfo
    {
        public int MessageGatewayId { get; set; }
        public string GatewayName { get; set; }
        public string GatewayURL { get; set; }
        public string GatewayPort { get; set; }
        public bool IsActive { get; set; }
        public string Username { get; set; }
    }
}
