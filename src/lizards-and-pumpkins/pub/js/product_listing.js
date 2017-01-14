require(
    ['lib/domReady', 'product_grid', 'filter_navigation', 'pagination', 'lib/url', 'lib/translate', 'common'],
    function (domReady, productGrid, filterNavigation, pagination, url, translate) {

        domReady(function () {
            filterNavigation.renderLayeredNavigation(filterNavigationJson, '#facet-box-layer');
            renderContent();
        });

        function renderContent() {
            var container = document.querySelector('.page-content');

            if (typeof totalNumberOfResults === 'undefined' || 0 === totalNumberOfResults) {
                container.appendChild(createEmptyListingBlock());
                return;
            }

            container.appendChild(createToolbar());
            productGrid.renderGrid(productListingJson, container);
        }

        function createEmptyListingBlock() {
            var emptyListingMessage = document.createElement('P');
            emptyListingMessage.className = 'note-msg';
            emptyListingMessage.textContent = translate('There are no products matching the selection.');

            return emptyListingMessage;
        }

        function createSortingSelect() {
            var sortingSelect = document.createElement('SELECT');

            sortingSelect.className = 'form-control';

            if (typeof window.availableSortOrders !== 'object' || typeof window.selectedSortOrder !== 'object') {
                return sortingSelect;
            }

            sortingSelect.addEventListener('change', function () {
                document.location.href = this.value
            }, true);

            window.availableSortOrders.map(function (sortBy) {
                sortingSelect.appendChild(createSortingSelectOption(sortBy));
            });

            return sortingSelect;
        }

        function createSortingSelectOption(sortBy) {
            var sortingOption = document.createElement('OPTION'),
                newUrl = url.updateQueryParameters({"order": sortBy['code'], "dir": sortBy['selectedDirection']});

            sortingOption.textContent = translate(sortBy['code']);
            sortingOption.value = url.removeQueryParameterFromUrl(newUrl, pagination.getPaginationQueryParameterName());
            sortingOption.selected = isSelectedSortBy(sortBy);

            return sortingOption;
        }

        function isSelectedSortBy(sortBy) {
            return sortBy['code'] === window.selectedSortOrder['code'] &&
                sortBy['selectedDirection'] === window.selectedSortOrder['selectedDirection'];
        }

        function createToolbar() {
            var toolbar = document.createElement('DIV');
            toolbar.className = 'toolbar';
            toolbar.appendChild(createSortingBlock());
            toolbar.appendChild(createProductsPerPageBlock());
            toolbar.appendChild(pagination.renderPagination(totalNumberOfResults, productsPerPage));

            return toolbar;
        }

        function createSortingBlock() {
            var sortByLabel = document.createElement('LABEL');
            sortByLabel.textContent = translate('Sort By');

            var sortBy = document.createElement('DIV');
            sortBy.className = 'sort-by';

            sortBy.appendChild(sortByLabel);
            sortBy.appendChild(createSortingSelect());

            return sortBy;
        }

        function createProductsPerPageBlock() {
            var productPerPageLabel = document.createElement('LABEL');
            productPerPageLabel.textContent = translate('Items') + ': ';

            var productPerPage = document.createElement('DIV');
            productPerPage.className = 'limiter';

            productPerPage.appendChild(productPerPageLabel);
            productPerPage.appendChild(createProductsPerPageSelect());

            return productPerPage;
        }

        function createProductsPerPageSelect() {
            var select = document.createElement('SELECT');

            select.className = 'form-control';

            if (typeof window.productsPerPage !== 'object') {
                return select;
            }

            select.addEventListener('change', function () {
                document.location.href = this.value
            }, true);

            window.productsPerPage.map(function (numberOfProductsPerPage) {
                select.appendChild(createProductsPerPageOption(numberOfProductsPerPage));
            });

            return select;
        }

        function createProductsPerPageOption(numberOfProductsPerPage) {
            var option = document.createElement('OPTION'),
                newUrl = url.updateQueryParameter('limit', numberOfProductsPerPage['number']);

            option.textContent = numberOfProductsPerPage['number'];
            option.value = url.removeQueryParameterFromUrl(newUrl, pagination.getPaginationQueryParameterName());
            option.selected = numberOfProductsPerPage['selected'];

            return option;
        }
    }
);
