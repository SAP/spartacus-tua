import { OccConfig, ProductScope } from '@spartacus/core';

export const defaultTmaOccProductConfig: OccConfig = {
  backend: {
    occ: {
      endpoints: {
        product:
          'products/${productCode}?fields=DEFAULT,averageRating,images(FULL),classifications,manufacturer,numberOfReviews,categories(FULL),baseOptions,baseProduct,variantOptions,variantType,productOfferingPrice(FULL)',
        product_scopes: {
          list:
            'products/${productCode}?fields=code,name,summary,price(formattedValue),images(DEFAULT,galleryIndex)',
          details:
            'products/${productCode}?fields=DEFAULT,averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags,images(FULL),productOfferingPrice(FULL),productSpecification,validFor',
          attributes: 'products/${productCode}?fields=classifications',
          variants:
            'products/${productCode}?fields=purchasable,baseOptions(DEFAULT),baseProduct,variantOptions(DEFAULT),variantType',
        },
        productReviews: 'products/${productCode}/reviews',
        // Uncomment this when occ gets configured
        // productReferences:
        //   'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))&referenceType=${referenceType}',
        productReferences:
          'products/${productCode}/references?fields=DEFAULT,references(target(images(FULL)))',
        // tslint:disable:max-line-length
        productSearch:
          'products/search?fields=products(code,name,summary,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions,productSpecification,productOfferingPrice(FULL)),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch',
        // tslint:enable
        productSuggestions: 'products/suggestions',
      },
    },
    loadingScopes: {
      product: {
        details: {
          include: [ProductScope.LIST, ProductScope.VARIANTS],
        },
      },
    },
  },
};
