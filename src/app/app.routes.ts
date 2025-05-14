import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'tabs',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'houses/rental',
    loadComponent: () => import('./pages/homes-listing/homes-listing.page').then(m => m.HomesListingPage)
  },
  {
    path: 'houses',
    loadComponent: () => import('./pages/homes-listing/homes-listing.page').then(m => m.HomesListingPage)
  },
  {
    path: 'plots',
    loadComponent: () => import('./pages/plot-listing/plot-listing.page').then(m => m.PlotListingPage)
  },
  {
    path: 'business-properties/rental',
    loadComponent: () => import('./pages/business-property-listing/business-property-listing.page').then(m => m.BusinessPropertyListingPage)
  },
  {
    path: 'business-properties',
    loadComponent: () => import('./pages/business-property-listing/business-property-listing.page').then(m => m.BusinessPropertyListingPage)
  },
  {
    path: 'vacation-rentals',
    loadComponent: () => import('./pages/holiday-property-listing/holiday-property-listing.page').then(m => m.HolidayPropertyListingPage)
  },
  {
    path: 'vacation-rentals/:id',
    loadComponent: () => import('./pages/holiday-home-details/holiday-home-details.page').then(m => m.HolidayHomeDetailsPage)
  },
  {
    path: 'houses/rental/:id',
    loadComponent: () => import('./pages/home-details/home-details.page').then(m => m.HomeDetailsPage)
  },
  {
    path: 'houses/purchase/:id',
    loadComponent: () => import('./pages/home-details/home-details.page').then(m => m.HomeDetailsPage)
  },
  {
    path: 'business-properties/rental/:id',
    loadComponent: () => import('./pages/business-property-details/business-property-details.page').then(m => m.BusinessPropertyDetailsPage)
  },
  {
    path: 'business-properties/purchase/:id',
    loadComponent: () => import('./pages/business-property-details/business-property-details.page').then(m => m.BusinessPropertyDetailsPage)
  },
  {
    path: 'plots/:id',
    loadComponent: () => import('./pages/plot-details/plot-details.page').then(m => m.PlotDetailsPage)
  },
  {
    path: 'for-sale-by-owner',
    loadComponent: () => import('./pages/for-sale-by-owner/for-sale-by-owner.page').then( m => m.ForSaleByOwnerPage)
  },
  {
    path: 'home-filter',
    loadComponent: () => import('./pages/homes-listing/home-filter/home-filter.page').then( m => m.HomeFilterPage)
  },
  {
    path: 'plot-filter',
    loadComponent: () => import('./pages/plot-listing/plot-filter/plot-filter.page').then( m => m.PlotFilterPage)
  },
  {
    path: 'business-property-filter',
    loadComponent: () => import('./pages/business-property-listing/business-property-filter/business-property-filter.page').then( m => m.BusinessPropertyFilterPage)
  },
  {
    path: 'about-us',
    loadComponent: () => import('./pages/about-us/about-us.page').then( m => m.AboutUsPage)
  },
  {
    path: 'oil-and-gas',
    loadComponent: () => import('./pages/oil-and-gas/oil-and-gas.page').then( m => m.OilAndGasPage)
  },
  {
    path: 'contact-us',
    loadComponent: () => import('./pages/contact-us/contact-us.page').then( m => m.ContactUsPage)
  },
  {
    path: 'auctions',
    loadComponent: () => import('./pages/auctions/auctions.page').then( m => m.AuctionsPage)
  },
  {
    path: 'auction-view',
    loadComponent: () => import('./pages/auction-view/auction-view.page').then( m => m.AuctionViewPage)
  },
  {
    path: 'auctions/:id',
    loadComponent: () => import('./pages/auction-details/auction-details.page').then( m => m.AuctionDetailsPage)
  },
  {
    path: 'agents',
    loadComponent: () => import('./pages/agents/agents.page').then( m => m.AgentsPage)
  },
  {
    path: 'faq',
    loadComponent: () => import('./pages/faq/faq.page').then( m => m.FaqPage)
  },
  {
    path: 'faq-view',
    loadComponent: () => import('./pages/faq/faq-view/faq-view.page').then( m => m.FaqViewPage)
  },
  {
    path: 'rental-management',
    loadComponent: () => import('./pages/rental-management/rental-management.page').then( m => m.RentalManagementPage)
  },
  {
    path: 'agents/:id',
    loadComponent: () => import('./pages/agent-details/agent-details.page').then( m => m.AgentDetailsPage)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/tabs/home'
  },
  {
    path: 'custom-spinner',
    loadComponent: () => import('./pages/custom-spinner/custom-spinner.page').then( m => m.CustomSpinnerPage)
  },
  {
    path: 'language-menu',
    loadComponent: () => import('./shared/language-menu/language-menu.page').then( m => m.LanguageMenuPage)
  },

];
