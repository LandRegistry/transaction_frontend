<template>
  <div style="margin-top: 240px;">
<div class="headerText">
    <div class="pageTitle">Create your own Contract</div>
    <div class="subTitle">STEP 2</div>
</div>
    <div class="details">
      <h4>Use your touch ID to verify the contract</h4>
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
      <p>A copy of this contract has now been sent to the relevant party. Please await their approval.</p>
      <button v-on:click="pay" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Exchange Money</button>
    </div>

  </div>
</template>

<script>
export default {
  props: ['propId'],
  data() {
    return {
      isSuccess: false
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
    pay: function() {
      this.$router.push('/payment/propertyExchange'+this.$route.params.propId);
    },
    sign: async function() {

      // Redirect if we are successful
      if (this.isSuccess) {
        window.location.href = 'http://hmlr-ds-landingscreen.eu-gb.mybluemix.net/#/Landing'
      }

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
        this.isSuccess = true;
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
      }
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
   padding-top: 25px;
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
