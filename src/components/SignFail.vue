<template>
  <div style="margin-top: 280px;">
<div class="headerText">
    <div class="pageTitle"></div>
    <div class="subTitle"></div>
</div>
    <div class="details">
      <h4>Use your touch ID to sign the contract</h4>
      <!-- <p>ipsum quia dolor sit amet, consectetur, adipisci velit</p> -->

      <button v-on:click="sign" class="mdl-button mdl-js-button mdl-button--icon" style="width: 300px; height: 300px; min-width: initial;">
        <i class="material-icons md-200" v-bind:class="{ success: isSuccess }">fingerprint</i>
      </button>
      <!-- <div v-if="signed" class="success">
                  <div> Done </div>
                  <div>
                    <i class="material-icons">done</i>
                  </div>
                </div>
                <div v-if="failed" class="fail">
                  <div> Sign failed </div>
                  <div>
                    <i class="material-icons">error</i>
                  </div>
                </div> -->
      <p v-if="isSigning">
        Please wait... <pulse-loader :loading="isSigning"></pulse-loader>
      </p>
      <p v-if="isSuccess">
        You have successfully signed the contract and paid the deposit!
      </p>
      <p v-else>
        This contract has been signed by the seller, by signing this contract you are agreeing to the terms of the contract.
        Once you have signed the contract your deposit will be paid and you will be committed to the purchase of the property.
      </p>
    </div>

  </div>
</template>

<script>
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'
export default {
  components: {
    PulseLoader
  },
  props: ['propId'],
  data() {
    return {
      isSuccess: false,
      isSigning: false,
      buyerid:100000008,
      depositprice: 18000
    }
  },
  async created(){
    this.isSuccess=false;
      var data = JSON.stringify({
        type:"PropertyExchange",
      id:"propertyExchange".concat(this.$route.params.propId),
      user:"admin"	

  });
  const response =await fetch(process.env.BACKEND_URL + '/api/get/assetStatus', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(function(data){
        var status=data;
        console.log("status",status)
        if(status=="CONTRACT_SIGNED"){
          this.isSuccess=true;
        }
      }.bind(this));

  },
  computed: {

  },
  methods: {
    pay: function() {
      this.$router.push('/payment/propertyExchange'+this.$route.params.propId);
    },
    sign: async function() {

      // Redirect if we are successful
      if (this.isSuccess) {
        window.location.href = process.env.LANDING_SCREEN_URL + '/#/Landing'
      }

      this.isSigning = true;

      // extract from passed info store?
      var userId = '100000008';
      var contractId = 'contract'+this.$route.params.propId;

      var data = JSON.stringify({
        'type': 'ApproveContract',
        'user': userId,
        'attributes': {
          'contractToUpdateId': contractId
        }
      });

      const response = await fetch(process.env.BACKEND_URL + '/api/transaction', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (response.ok) {
        var data = JSON.stringify({
          propertyExchangeId:"propertyExchange".concat(this.$route.params.propId),
          propertyExchangeStatus:"CONTRACT_SIGNED",
          user:"admin"
         });

      const response = await fetch(process.env.BACKEND_URL + '/api/propertyExchange/updateStatus', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      this.paydeposit();
      }
    },

    paydeposit: async function() {
      this.loading = true;
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "buyer": {
            "namespace": "org.hmlr.model",
            "type": "Buyer",
            "id": this.buyerid
          },
          "ammountInGBP": this.depositprice
        },
        "propertyExchangeId": "propertyExchange".concat(this.$route.params.propId),
        "user": this.buyerid
      })
      console.log(data);
      const response =fetch(process.env.BACKEND_URL + '/api/payment/deposit', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(
        function(data){
          console.log(data);
          console.log(data.status);
          if(data.status==200){
            this.isSuccess = true;
            this.isSigning = false;
            console.log("Enter");
            // this.callmortgage();
          }
      }.bind(this));
    }
  }
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
  height: 600px;
}

.success {
  background-color: limegreen;
  color: limegreen;
}

.headerText {
      background-color: #0C1D3B;
    position: absolute;
    width: 100%;
    left: 0;
    height: 80px;
    margin-top: -23px;
}
</style>
