<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Error.aspx.cs"  %>

<% Response.StatusCode = 404; %>

<div class="list-header clearfix">
    <span>Something went wrong</span>
</div>
<div class="list-sfs-holder">
    <div class="alert alert-error">
        An unexpected error has occurred. Please contact the system administrator.
    </div>
</div>