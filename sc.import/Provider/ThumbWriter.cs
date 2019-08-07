using System;
using System.Drawing;

namespace sc.import
{
    public class ThumbWriter
    {
        public static bool CreateThumbnail(string fileName, string saveAsFileName, int thumbWidth, int thumbHeight)
        {
            using (Image thumbnail = Image.FromFile(fileName).GetThumbnailImage(thumbWidth, thumbHeight, null, new IntPtr()))
            {
                thumbnail.Save(saveAsFileName);
            }

            return true;
        }
    }
}
