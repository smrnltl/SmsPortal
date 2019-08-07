<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="PageNotFound.aspx.cs"  %>

<% Response.StatusCode = 404; %>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link id="favicon" type="icon shortcut" media="icon" href="~/ClientTemplate/images/favicon.ico" rel="icon" />

	<title>Online Policy Submission</title>

	<!-- Google font -->
	<link href="https://fonts.googleapis.com/css?family=Montserrat:500" rel="stylesheet">
	<link href="https://fonts.googleapis.com/css?family=Titillium+Web:700,900" rel="stylesheet">

	<!-- Custom stlylesheet -->
	<link type="text/css" rel="stylesheet" href="/CustomPages/css/PageNotFound.css" />


</head>

<body>

	<div id="notfound">
		<div class="notfound">
			<div class="notfound-404">
				<h1>404</h1>
			</div>
			<h2>Oops! This Page Could Not Be Found</h2>
			<p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p>
			<a href="/Home">Go To Homepage</a>
		</div>
	</div>

</body>

</html>

