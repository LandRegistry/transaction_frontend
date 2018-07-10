<template>
  <div style="margin-top: 160px;">

    <div class="details">
      <h4 v-if="!isSigning && !isSuccess">Use your touch ID to sign your contract</h4>
      <h4 v-else-if="isSigning">Signing your contract...</h4>
      <h4 v-else>Contract signed</h4>
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
      isSigning: false
    }
  },
  created () {
    this.fetchData()
  },
  computed: {

  },
  methods: {
     fetchData () {
       this.isSuccess=false;
      var data = JSON.stringify({
        type:"PropertyExchange",
      id:"propertyExchange".concat(this.data2),
      user:"admin"	

  });
  const response = fetch(process.env.BACKEND_URL + '/api/get/asset', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(function(data){
        var status=data.status;
        console.log(status)
      }.bind(this));

     },
    // pay: function() {
    //   this.$router.push('/payment/propertyExchange'+this.$route.params.propId);
    // },
    sign: async function() {

      // Redirect if we are successful
      if (this.isSuccess) {
        window.location.href = process.env.LANDING_SCREEN_URL + '/#/Landing'
      } else {
        this.isSigning = true;
  
        // extract from passed info store?
        var userId = '100000002';
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
            propertyExchangeStatus:"CONTRACT_CREATED",
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
          if (response.ok) {
            this.isSuccess = true;
            this.isSigning = false;
          }
        }
      }
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
  /* color: white; */
  text-align: center;
  position: relative;
  left: 0;
  padding-top: 25px;
  height: 600px;
}

.success {
  color: limegreen;
}

.headerText {
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
  background: 0 !important;
  /* margin-bottom: -30px; */
}

</style>
