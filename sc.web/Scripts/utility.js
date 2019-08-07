(function ($) {
   showMessage = function (msg, type) {
       $.iGrowl({
           message: msg,
           type: type,
           icon: type === 'success' ? 'feather-check' : 'feather-delete',
           placement: {
               x: 'left',
               y: 'bottom'
           }
       });
    };

    loadSingleSumoSelect = function (element) {
        $('#' + element).SumoSelect({
            search: true,
            searchText: 'Search...'
        });
        $('#' + element).prop("selectedIndex", -1);
    };

    unloadSingleSumoSelect = function (element) {
        $('#' + element)[0].sumo.unSelectAll();
        $('#' + element).prop("selectedIndex", -1);
    };

    loadMultiSumoSelect = function (element) {
        $('#' + element).SumoSelect({
            selectAll: true,
            search: true,
            searchText: 'Search...'

        });
    };

    unloadMultiSumoSelect = function (element) {
        $('#' + element)[0].sumo.unload();
    };

    convertStrArrToIntArr = function (arr) {
        var result = arr;
        for (var i = 0; i < arr.length; i++) {
            result[i] = parseInt(arr[i]);
        }
        return result;
    };
})(jQuery);