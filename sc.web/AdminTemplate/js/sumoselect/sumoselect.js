$(document).ready(function () {
    window.asd = $('.SlectBox').SumoSelect({ csvDispCount: 3, selectAll:true, captionFormatAllSelected: "Yeah, OK, so everything." });
    window.test = $('.testsel').SumoSelect({okCancelInMulti:true, captionFormatAllSelected: "Yeah, OK, so everything." });

    window.testSelAll = $('.testSelAll').SumoSelect({okCancelInMulti:true, selectAll:true });

    window.testSelAll2 = $('.testSelAll2').SumoSelect({selectAll:true});

    window.testSelAlld = $('.SlectBox-grp').SumoSelect({okCancelInMulti:true, selectAll:true, isClickAwayOk:true });

    window.Search = $('.search-box').SumoSelect({ csvDispCount: 3, search: true, searchText:'Enter here.' });
    window.sb = $('.SlectBox-grp-src').SumoSelect({ csvDispCount: 3, search: true, searchText:'Enter here.', selectAll:true });
    window.searchSelAll = $('.search-box-sel-all').SumoSelect({ csvDispCount: 3, selectAll:true, search: true, searchText:'Enter here.', okCancelInMulti:true });
    window.searchSelAll = $('.search-box-open-up').SumoSelect({ csvDispCount: 3, selectAll:true, search: false, searchText:'Enter here.', up:true });
    window.Search = $('.search-box-custom-fn').SumoSelect({ csvDispCount: 3, search: true, searchText:'Enter here.', searchFn: function(haystack, needle) {
        var re = RegExp('^' + needle.replace(/([^\w\d])/gi, '\\$1'), 'i');
        return !haystack.match(re);
    } });

    window.groups_eg_g = $('.groups_eg_g').SumoSelect({selectAll:true, search:true });


    $('.SlectBox').on('sumo:opened', function(o) {
        console.log("dropdown opened", o)
    });

});