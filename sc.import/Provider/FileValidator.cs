using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace sc.import
{
    public class FileValidator
    {
        public static FileResult ValidatFile(Stream inputStream, string fileName, double allowedSizeInKB, params string[] fileType)
        {
            string message = "";

            // validate extension
            var valid = validateExtension(fileName, fileType);
            if (!valid) message = string.Format("Invalid file type. Allowed file types are - {0}", string.Join(",", fileType));

            // validate size
            valid = validatSize(inputStream.Length, allowedSizeInKB);
            if (!valid) message = string.Format("Invalid file size. File size cannot exceed {0} KB", allowedSizeInKB);

            return new FileResult
            {
                IsFileValid = string.IsNullOrEmpty(message),
                Message = string.IsNullOrEmpty(message) ? fileName : message
            };
        }

        #region helpers

        private static bool validateExtension(string filename, params string[] fileType)
        {
            return fileType.Contains(Path.GetExtension(filename).ToLower());
        }

        private static bool validatSize(double sizeInBytes, double allowedSizeInKB)
        {
            var sizeInKB = sizeInBytes / 1024;
            return allowedSizeInKB >= sizeInKB;
        }

        #endregion
    }
}
