import Vue from 'vue'
import Router from 'vue-router'
import Contract from '@/components/Contract'
import Confirmation from '@/components/Confirmation'
import Sign from '@/components/Sign'
import SignFail from '@/components/SignFail'
import Timeline from '@/components/Timeline'
import SecretAdmin from '@/components/SecretAdmin'
import Viewer from '@/components/Viewer'
import Map from '@/components/Map'
import Property from '@/components/Property'
import Final from '@/components/Final'
import Payment from '@/components/Payment'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/timeline/100000002/propertyExchange1'
    },
    {
      path: '/timeline',
      redirect: '/timeline/100000002/propertyExchange1'
    },
    {
      path: '/contract',
      redirect: '/contract/100000002/100000008'
    },
    {
      path: '/contract/:sellerId/:buyerId',
      name: 'Contract',
      component: Contract
    },
    {
      path: '/confirm/:contractId',
      name: 'Confirmation',
      component: Confirmation
    },
    {
      path: '/final',
      name: 'Final',
      component: Final
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/payment/:exchangeid',
      name: 'Payment',
      component: Payment
    },
    {
      path: '/signfail',
      name: 'SignFail',
      component: SignFail
    },
    {
      path: '/viewer',
      name: 'Viewer',
      component: Viewer
    },
    {
      path: '/map/:uprn',
      name: 'Map',
      component: Map
    },
    {
      path: '/secretadmin',
      name: 'SecretAdmin',
      component: SecretAdmin
    },
    {
      path: '/property/:contractId',
      name: 'Property',
      component: Property
    },
    {
      path: '/timeline/:sellerId/:propertyExchangeId',
      name: 'Timeline',
      component: Timeline
    }
  ]
})
