import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { translationChunksConfig, translations } from '@spartacus/assets';
import { ConfigModule } from '@spartacus/core';
import { TmaB2cStorefrontModule } from '../../../tua-spa/src/storefrontlib/recipes';
import { tmaTranslations } from '../../../tua-spa/src/assets';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TmaB2cStorefrontModule.withConfig({
      backend: {
        tmf: {
          baseUrl: 'https://localhost:9002',
          prefix: '/b2ctelcotmfwebservices/v2/',
        },
        occ: {
          baseUrl: 'https://localhost:9002',
          prefix: '/rest/v2/',
          endpoints: {
            product_scopes: {
              details:
                'products/${productCode}?fields=DEFAULT,averageRating,stock(DEFAULT),description,availableForPickup,code,url,price(DEFAULT),numberOfReviews,manufacturer,categories(FULL),priceRange,multidimensional,configuratorType,configurable,tags,images(FULL),productOfferingPrice(FULL),productSpecification,validFor',
            },
            productSearch:
              'products/search?fields=products(code,name,summary,price(FULL),images(DEFAULT),stock(FULL),averageRating,variantOptions,productSpecification),facets,breadcrumbs,pagination(DEFAULT),sorts(DEFAULT),freeTextSearch',
          },
        }
      },
      context: {
        urlParameters: ['baseSite', 'language', 'currency'],
        baseSite: ['telcospa']
      },
      i18n: {
        resources: translations,
        chunks: translationChunksConfig,
        fallbackLang: 'en'
      },
      features: {
        level: '1.5'
      }
    }),
    ConfigModule.withConfig({
      i18n: {
        resources: tmaTranslations
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
