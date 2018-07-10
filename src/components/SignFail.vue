<template>
  <div style="margin-top: 220px;">
    <div class="details">
      <div v-if="!isSigning && !isSuccess">
        <h4>Sign your contract</h4>
        <p>This contract has been signed by the seller.<br>
If you’re happy with the terms and conditions then you can sign your contract with your touch ID.<br>
Once you’ve signed the contract your deposit will be paid and you’ll be committed to the purchase of the property.</p>
      </div>

      <h4 v-else-if="isSigning">Signing your contract...</h4>
      <h4 v-else>You have successfully signed the contract and paid the deposit!</h4>

      <button v-on:click="sign" class="mdl-button mdl-js-button fingerprint" style="height: 300px;">
        <!-- <i class="material-icons md-200" v-bind:class="{ success: isSuccess }">fingerprint</i> -->
        <img v-if="isSuccess" src="../../static/touch id green cropped.png" width="300px">
        <img v-else src="../../static/touch id black.png" width="300px">
      </button>
      <p v-if="isSigning">
        <pulse-loader style="margin-top: 20px;" :color="color" :loading="isSigning"></pulse-loader>
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
      color: '#488aff',
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
      } else {
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
  font-size: 350px;
}

.mdl-button .material-icons {
  margin-top: -80px; 
}

.mdl-button--icon .material-icons {
  /* transform: translate(-100px, -35px); */
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
  text-align: center;
  position: relative;
  left: 0;
  height: 600px;
}

.success {
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

.fingerprint {
  /* width: 400px;
  height: 400px; */
  min-width: initial;
  background: 0;
  /* margin-top: -10px; */
}

</style>
