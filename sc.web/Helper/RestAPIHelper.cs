using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web;

namespace sc.web.Helper
{
    public class MessageInfo
    {
        public string Phone { get; set; }
        public string Message { get; set; }
    }

    public class RestAPIHelper
    {
        //private const string URL = "http://192.168.1.66:8080/";
        //private static string urlParameters = "v1/sms/send/?phone=9849302279&message=TestFirstMessage";       

        public static async Task<bool> CallAPI(string URL, string mobile, string mesage)
        {
            try
            {
                bool result;
                HttpClient client = new HttpClient();
                client.BaseAddress = new Uri(URL);
                string urlParameter = "v1/sms/send/?phone=" + mobile + "&message=" + mesage;

                // Add an Accept header for JSON format.
                client.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));

                // List data response.
                HttpResponseMessage response = await client.GetAsync(urlParameter);  // Blocking call! Program will wait here until a response is received or a timeout occurs.
                if (response.IsSuccessStatusCode)
                {
                    result = true;
                    //object obj = response.Content.ReadAsAsync();
                }
                else
                {
                    result = false;
                }
                //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
                client.Dispose();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }

        //public static bool PostCallAPI()
        //{
        //    try
        //    {
        //        MessageInfo messageInfo = new MessageInfo();
        //        messageInfo.Phone = "9849302279";
        //        messageInfo.Message = "Test First Message";
        //        bool result;
        //        HttpClient client = new HttpClient();
        //        client.BaseAddress = new Uri(URL);

        //        // Add an Accept header for JSON format.
        //        client.DefaultRequestHeaders.Accept.Add(
        //        new MediaTypeWithQualityHeaderValue("application/json"));

        //        // List data response.
        //        HttpResponseMessage response = client.PostAsJsonAsync(urlParameters, messageInfo).Result;  // Blocking call! Program will wait here until a response is received or a timeout occurs.
        //        if (response.IsSuccessStatusCode)
        //        {
        //            result = true;
        //            Uri returnUrl = response.Headers.Location;
        //            //object obj = response.Content.ReadAsAsync();

        //            // Parse the response body.
        //            //var dataObjects = response.Content.ReadAsAsync<IEnumerable<DataObject>>().Result;  //Make sure to add a reference to System.Net.Http.Formatting.dll
        //            //foreach (var d in dataObjects)
        //            //{
        //            //    Console.WriteLine("{0}", d.Name);
        //            //}
        //        }
        //        else
        //        {
        //            result = false;
        //            //Console.WriteLine("{0} ({1})", (int)response.StatusCode, response.ReasonPhrase);
        //        }

        //        //Make any other calls using HttpClient here.

        //        //Dispose once all HttpClient calls are complete. This is not necessary if the containing object will be disposed of; for example in this case the HttpClient instance will be disposed automatically when the application terminates so the following call is superfluous.
        //        client.Dispose();
        //        return result;
        //    }
        //    catch (Exception ex)
        //    {

        //        throw ex;
        //    }

        //}
    }
}