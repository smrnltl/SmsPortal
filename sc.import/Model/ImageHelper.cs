using System;
using System.IO;

namespace sc.import
{
    public class ImageHelper
    {
        public static void saveThumbnailImages(string sourceFile, int targetSize, string destinationPath, string fileName)
        {
            try
            {
                if (!Directory.Exists(destinationPath))
                {
                    Directory.CreateDirectory(destinationPath);
                }

                PictureManager.CreateThmnail(sourceFile, targetSize, Path.Combine(destinationPath, fileName));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}