define(['lib/url'], function (url) {
    var paginationQueryParameterName = 'p',
        maxNumberOfPagesAroundSelected = 2;

    function createPaginationItemWithLink(itemUrl, itemHtml) {
        var item = document.createElement('LI'),
            link = document.createElement('A');
        link.href = itemUrl;
        link.innerHTML = itemHtml;
        item.appendChild(link);

        return item;
    }

    function createPaginationItem(itemHtml, cssClass) {
        var item = document.createElement('LI');
        item.className = cssClass;
        item.innerHTML = itemHtml;

        return item;
    }

    function getSelectedNumberOfProductsPerPage(productsPerPage) {
        for (var i = 0; i < productsPerPage.length; i++) {
            if (true === productsPerPage[i]['selected']) {
                return productsPerPage[i]['number'];
            }
        }
    }

    return {
        getPaginationQueryParameterName: function() {
            return paginationQueryParameterName;
        },

        renderPagination: function (totalNumberOfResults, productsPerPage) {
            var paginationContainer = document.createElement('DIV'),
                totalPageCount = Math.ceil(totalNumberOfResults / getSelectedNumberOfProductsPerPage(productsPerPage));

            paginationContainer.id = 'pagination';

            if (totalPageCount < 2) {
                return paginationContainer;
            }

            var pagination = document.createElement('OL'),
                selectedPageNumber = Math.max(1, url.getQueryParameterValue(paginationQueryParameterName));

            if (totalPageCount && 1 < selectedPageNumber) {
                var previousPageUrl = url.updateQueryParameter(paginationQueryParameterName, selectedPageNumber - 1),
                    linkPrev = document.createElement('I');
                linkPrev.className = 'icon-angle-left';
                pagination.appendChild(createPaginationItemWithLink(previousPageUrl, linkPrev.outerHTML));
            }

            for (var pageNumber = 1; pageNumber <= totalPageCount; pageNumber++) {
                if (selectedPageNumber === pageNumber) {
                    pagination.appendChild(createPaginationItem(pageNumber.toString(), 'current'));
                    continue;
                }

                if (selectedPageNumber - maxNumberOfPagesAroundSelected > 0 && pageNumber == 1) {
                    var firstPageUrl = url.updateQueryParameter(paginationQueryParameterName, 1);
                    pagination.appendChild(createPaginationItemWithLink(firstPageUrl, pageNumber.toString()));
                    if (selectedPageNumber - maxNumberOfPagesAroundSelected - 1 > 1) {
                        pagination.appendChild(createPaginationItem('...', 'spacing'));
                    }
                    continue;
                }

                if (selectedPageNumber + maxNumberOfPagesAroundSelected < totalPageCount && pageNumber == totalPageCount) {
                    var lastPageUrl = url.updateQueryParameter(paginationQueryParameterName, totalPageCount);
                    if (selectedPageNumber + maxNumberOfPagesAroundSelected + 1 < totalPageCount) {
                        pagination.appendChild(createPaginationItem('...', 'spacing'));
                    }
                    pagination.appendChild(createPaginationItemWithLink(lastPageUrl, pageNumber.toString()));
                    continue;
                }

                if (pageNumber < selectedPageNumber - maxNumberOfPagesAroundSelected ||
                    pageNumber > selectedPageNumber + maxNumberOfPagesAroundSelected
                ) {
                    continue;
                }

                var pageUrl = url.updateQueryParameter(paginationQueryParameterName, pageNumber);
                pagination.appendChild(createPaginationItemWithLink(pageUrl, pageNumber.toString()));
            }

            if (totalPageCount && totalPageCount > selectedPageNumber) {
                var nextPageUrl = url.updateQueryParameter(paginationQueryParameterName, selectedPageNumber + 1),
                    linkNext = document.createElement('I');
                linkNext.className = 'icon-angle-right';
                pagination.appendChild(createPaginationItemWithLink(nextPageUrl, linkNext.outerHTML));
            }

            paginationContainer.appendChild(pagination);

            return paginationContainer;
        }
    }
});
