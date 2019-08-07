$(function() {
    "use strict";
    $('.year-calendar').pignoseCalendar({
        theme: 'blue' // light, dark, blue
    });

    $('input.calendar').pignoseCalendar({
        format: 'YYYY-MM-DD',// date format string. (2017-02-02)
        maxDate: new Date()
    });
});