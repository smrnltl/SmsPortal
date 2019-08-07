// pagination start
(function ($) {
    $.fn.pagination = function (p) {
        var $self = $(this);
        
        p.pageNo = parseInt(p.pageNo);
        p.itemsPerPage = parseInt(p.itemsPerPage);
        p.pagePerDisplay = parseInt(p.pagePerDisplay);
        p.totalNextPages = parseInt(p.totalNextPages);

        var html = "";
        var start = Math.floor((p.pageNo - 1) / p.pagePerDisplay) * p.pagePerDisplay + 1;
        var end = start + (p.pagePerDisplay - 1);

        if ((end - p.pageNo) > p.totalNextPages) end = p.pageNo + p.totalNextPages;

        var prev = p.pageNo - 1;
        var next = p.pageNo + 1;

        html = '<li class="page-item previous ' + (prev > 0 ? '' : 'disabled') + '"><a class="page-link" href="javascript:void(0);" ' + (prev > 0 ? 'data-page="' + prev + '"' : '') + '>Prev</a></li>';

        for (var i = start; i <= end; i++) {
            html += '<li class="page-item ' + (i == p.pageNo ? "active" : "") + '"><a class="page-link" href="javascript:void(0);" data-page="' + i + '">' + i + '</a></li>';
        }

        html += '<li class="page-item next ' + (p.totalNextPages > 0 ? '' : 'disabled') + '"><a class="page-link" href="javascript:void(0);" ' + (p.totalNextPages > 0 ? 'data-page="' + next + '"' : '') + '>Next</a></li>';
        $self.html('<ul class="pagination no-margin">' + html + '</ul>');
        $self.addClass("clearfix");

        $('[data-page]').on('click', function () {
            var page = $(this).attr('data-page');
            p.callback(page);
        });
    }
})(jQuery);
// pagination end