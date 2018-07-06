<template>
  <div style="margin-top: 220px;">
    <div class="details">

      <!-- <i class="material-icons md-200 red">credit_card</i> -->
      <img src="../../static/screen 20 card icon.png" width=150>

      <h6>These steps need to happen before you can complete on the sale of the property.</h6>

      <div class="demo-list-action mdl-list">
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <h5>Deposit paid by buyer</h5>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="deposit" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <h5>Draw down mortgage</h5>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="mortgage" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <h5>Transfer funds to seller</h5>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="transfer" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
            </a>
          </span>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <h5>Stamp duty land tax paid</h5>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="sdlt" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
            </a>
          </span>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <h5>Register updated</h5>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="register" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
            </a>
          </span>
        </div>
      </div>
      <button v-if="!register && !loading" v-on:click="callmortgage" class="mdl-button mdl-js-button mdl-button--raised blue">Complete</button>
      <p v-if="loading">
        <pulse-loader :color="color" :loading="loading"></pulse-loader>
      </p>
      <p v-if="register">
        Congratulations, you now own the property!
      </p>
    </div>

  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
import moment from 'moment';
export default {
  components: {
    PulseLoader
  },
  data() {
    return {
      color: '#488aff',
      contract: {
        completionDate: "2018-02-15"
      },
      deposit: true, // it should be done by now so default true to avoid showing date for a few seconds
      mortgage: false,
      additional: false,
      escrow: false,
      transfer: false,
      sdlt: false,
      register: false,
      propertyexchanges: [],
      exchangeid: '',
      saleprice: 180000,
      mortgageprice: 162000,
      depositprice: 18000,
      additionalprice: 1000,
      hmrc:1000,
      buyerid:100000008,
      loading: false

    }
  },
  async created() {
    // Get contract
    const contractId = 'contract' + this.$route.params.exchangeid.substring(16);
    this.contract = await this.loadContract(contractId);
  },
  computed: {
    formattedCompletionDate: function() {
      if (this.contract.completionDate) {
        return moment(this.contract.completionDate).format('Do MMMM YYYY');
      } else {
        return 'Checking...'
      }
    },
  },
  methods: {
    loadContract: async function(contractId) {

      // Get specified contract
      var data = JSON.stringify({
        'type': 'Contract',
        'id': contractId,   // supplied asset identifier
        'user': 'hmlr'
      });

      var response = await fetch(process.env.BACKEND_URL + '/api/get/asset', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    },
    callmortgage: function(){
      this.loading = true;
      console.log()
       var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "lender": {
            "namespace": "org.hmlr.model",
            "type": "Lender",
            "id": "santander"
          },
          "ammountInGBP": this.mortgageprice
        },
	      "propertyExchangeId": this.$route.params.exchangeid,
        "user": "santander"
      })
      console.log(data);
      const response=fetch(process.env.BACKEND_URL + '/api/payment/mortgage', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        console.log(data);
        this.mortgage = true;
        this.calladditional();
      }.bind(this));
    },
    calladditional: function(){
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "buyer": {
            "namespace": "org.hmlr.model",
            "type": "Buyer",
            "id": this.buyerid
          },
          "ammountInGBP": this.additionalprice
        },
	      "propertyExchangeId": this.$route.params.exchangeid,
        "user": this.buyerid
      })
      console.log(data);
       const response=fetch(process.env.BACKEND_URL + '/api/payment/additional', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        console.log(data);
        this.transfer = true; // not strictly accurate but so ticks in right order...
        this.callescrow();
      }.bind(this));
    },
    callescrow: function(){
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
        "sellerAmmountInGBP": 1,
        "sellerLenderAmmountInGBP": 1,
        "sellerHMRCAmmountInGBP": this.hmrc
        },
        "propertyExchangeId": this.$route.params.exchangeid,
        "user": "escrow"
      })
      console.log(data);
      const response=fetch(process.env.BACKEND_URL + '/api/payment/escrowpayout', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        console.log(data);
        this.sdlt = true;
        this.changestatusbuyer();
      }.bind(this));
    },

    changestatusbuyer: function(){
      var data = JSON.stringify({
          propertyExchangeId:this.$route.params.exchangeid,
          propertyExchangeStatus: "BUYER_MOVES_IN",
          user:"admin"
         });

      const response = fetch(process.env.BACKEND_URL + '/api/propertyExchange/updateStatus', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        console.log(data);
        this.updateregistry();
      }.bind(this));
    },

    updateregistry: function(){
      var data = JSON.stringify({
        "propertyExchangeId":this.$route.params.exchangeid,
        "user": "hmlr"
      })
      console.log(data);
      const response=fetch(process.env.BACKEND_URL + '/api/property/transfer', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        this.changestatuscompleted();
        console.log(data);
      }.bind(this));
    },
    changestatuscompleted: function(){
      var data = JSON.stringify({
          propertyExchangeId: this.$route.params.exchangeid,
          propertyExchangeStatus: "REGISTRY_UPDATED",
          user:"admin"
          });

      const response = fetch(process.env.BACKEND_URL + '/api/propertyExchange/updateStatus', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(function(data){
        console.log(data);
        this.loading = false;
        this.register = true;
      }.bind(this));
    },

    updatestatus: function () {
      var data = JSON.stringify({
        type: "PropertyExchange",
        id: this.$route.params.exchangeid,
        user: "hmlr"
    })

      fetch(process.env.BACKEND_URL + '/api/get/asset', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
        .then(result => {
          this.deposit = result.hasOwnProperty("depositReceipt")
          this.mortgage = result.hasOwnProperty("mortgageReceipt")
          this.transfer = result.hasOwnProperty("additionalFundsReceipt")
          this.sdlt = result.hasOwnProperty("escrowPayoutReceipt")
          this.register = result.hasOwnProperty("escrowPayoutReceipt")
        });
    }
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #488aff;
  text-decoration: none;
  font-weight: bold;
}

.material-icons.md-200 {
  font-size: 200px;
}

.mdl-button .material-icons {
  vertical-align: middle;
}

.mdl-button--icon .material-icons {
  transform: translate(-100px, -35px);
}

.pageTitle {
  font-size: 25px;
  margin-top: -75px;
  padding-bottom: 10px;
  margin-left: -40px;
}

.subTitle {
  font-size: 17px;
  padding-bottom: 20px;
  margin-left: -265px;
}

.details {
  /* margin-top: 200px; */
  text-align: center;
  position: relative;
  left: 0;
  /* padding-left: 25px; */
  height: 700px;
}

.success {
  background-color: limegreen;
  color: limegreen;
}


.mdl-list__item-primary-content {
  /* color: white; */
  margin-left: 10%;
  margin-right:10%;
}

.mdl-list__item {
  padding: 0px;
}

.material-icons.green { color: #62A11E; }

.material-icons.red { color: #E2324C; }

</style>
