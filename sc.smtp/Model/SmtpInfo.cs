using System;

namespace sc.smtp
{
    public class SmtpInfo
    {
        public int ID { get; set; }

        public string HostName { get; set; }

        public int PortNo { get; set; }

        public bool EnableSSL { get; set; }

        public bool UseAuthentication { get; set; }

        public string DisplayName { get; set; }

        public string FromAddress { get; set; }

        public string Password { get; set; }

        public string ToAddress { get; set; }

        public bool IsActive { get; set; }

        public DateTime AddedOn { get; set; }

        public string AddedBy { get; set; }

        public bool IsUpdated { get; set; }

        public string UpdatedBy { get; set; }

        public DateTime UpdatedOn { get; set; }

        public bool IsDeleted { get; set; }

        public DateTime DeletedOn { get; set; }

        public string DeletedBy { get; set; }
    }
    public class SmtpReturnInfo
    {
        public int ID { get; set; }

        public string HostName { get; set; }

        public int PortNo { get; set; }

        public bool EnableSSL { get; set; }

        public bool UseAuthentication { get; set; }

        public string DisplayName { get; set; }

        public string FromAddress { get; set; }

        public string Password { get; set; }

        public string ToAddress { get; set; }
    }
}
