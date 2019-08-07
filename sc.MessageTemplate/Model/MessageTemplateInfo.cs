using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.MessageTemplate
{
    public class MessageTemplateInfo
    {
        public int MessageTemplateId { get; set; }
        public string TemplateName { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public string Username { get; set; }
    }
}
