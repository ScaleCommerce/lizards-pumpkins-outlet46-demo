define(['product'], function (Product) {

    function createProductImage(imageUrl, alt) {
        var image = new Image();
        image.src = imageUrl;
        image.alt = alt;
        return image;
    }

    function createAndAppendPricesBlock(product, container) {
        var price = document.createElement('DIV');
        price.textContent = product.getPrice();
        price.className = product.hasSpecialPrice() ? 'old-price' : 'regular-price';

        container.appendChild(price);

        if (product.hasSpecialPrice()) {
            var specialPrice = document.createElement('DIV');
            specialPrice.textContent = product.getSpecialPrice();
            specialPrice.className = 'special-price';
            container.appendChild(specialPrice);
        }

        return container;
    }

    function createLabel(className, labelText) {
        var container = document.createElement('DIV'),
            textElement = document.createElement('SPAN');

        textElement.textContent = labelText;
        container.className = 'label ' + className;
        container.appendChild(textElement);

        return container;
    }

    function createGridItem(productSourceData) {
        var product = new Product(productSourceData),
            mainImage = product.getMainImage().replace(/1800x1600/i, '250x250'),
            productLi = document.createElement('LI'),
            container = document.createElement('DIV'),
            title = document.createElement('A'),
            productImage = createProductImage(mainImage,'');

        title.textContent = product.getAttributeValue('name');
        title.setAttribute('href',baseUrl + product.getAttributeValue('url_key'));

        container.appendChild(productImage);
        container.appendChild(title);
        createAndAppendPricesBlock(product, container);

        if (product.isNew()) {
            container.appendChild(createLabel('new', 'NEW'));
        }

        if (product.hasSpecialPrice() && product.getDiscountPercentage() >= 5) {
            container.appendChild(createLabel('sale', '-' + product.getDiscountPercentage() + '%'));
        }

        productLi.appendChild(container);

        return productLi;
    }

    return {
        renderGrid: function (productGridJson, placeholder) {
            if (typeof placeholder.appendChild !== 'function') {
                return;
            }

            var grid = document.createElement('UL');
            grid.className = 'products-grid';

            placeholder.appendChild(grid);

            productGridJson.map(function (productSourceData) {
                grid.appendChild(createGridItem(productSourceData));
            });
        }
    }
});
