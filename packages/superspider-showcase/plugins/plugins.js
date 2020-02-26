import * as Sentry from '@sentry/browser'
import * as Integrations from '@sentry/integrations'
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

Sentry.init({
  dsn: 'https://18a7709b012b4e6ea60c91a1853f3b5a@sentry.io/2987713',
  integrations: [new Integrations.Vue({ Vue, attachProps: true })]
})
