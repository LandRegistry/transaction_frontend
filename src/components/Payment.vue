<template>
  <div style="margin-top: 260px;">
    <div class="pageTitle"></div>
    <div class="subTitle"></div>
    <div class="details">
      <h4>Relax, we'll sort out all the money.</h4>

      <!-- <p>ipsum quia dolor sit amet, consectetur, adipisci velit</p> -->

      <i class="material-icons md-200 red">credit_card</i>

      <div class="demo-list-action mdl-list">
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Deposit paid by buyer</span>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="deposit" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Draw down mortgage</span>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="mortgage" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Transfer funds to seller</span>
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
            <span>Stamp Duty Land Tax paid</span>
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
            <span>Register Updated</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="register" class="material-icons green">done</i>
              <small v-else>{{ formattedCompletionDate }}</small>
            </a>
          </span>
        </div>
      </div>
      <p>The above funds have been paid or are waiting to be paid by others.</p>
      <button v-if="!register && !loading" v-on:click="callmortgage" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Completion</button>
      <p v-if="loading">
        Please wait... <pulse-loader :loading="loading"></pulse-loader>
      </p>
      <p v-if="register">
        Congratulations - you now own the property!
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
      contract: {},
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
  computed: {
    formattedCompletionDate: function() {
      return moment(this.contract.completionDate).format('DD MMMM YYYY');
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
  
  created: async function () {

    //var interval = window.setInterval(this.updatestatus, 2000);
    console.log("Exchange ID: " + this.$route.params.exchangeid);
    const contractId = this.$route.params.exchangeid.substring(16);
    console.log("Contract ID: " + contractId);
    this.contract = await this.loadContract(contractId);
  },
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
  color: white;
  font-size: 25px;
  margin-top: -75px;
  padding-bottom: 10px;
  margin-left: -40px;
}

.subTitle {
  color: white;
  font-size: 17px;
  padding-bottom: 20px;
  margin-left: -265px;
}

.details {
  /* margin-top: 200px; */
  background-color: #0C1D3B;
  color: white;
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
  color: white;
  margin-left: 10%;
  margin-right:10%;
}
.material-icons.green { color: #62A11E; }

.material-icons.red { color: #E2324C; }

</style>
