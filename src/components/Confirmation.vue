<!-- Display confirmation of contact completion -->
<!-- Parameters: contractId - identifier for specific contract being confirmed -->
<!-- "asset Contract identified by contractId" -->


<template>
  <div style="margin-top: 240px;">
<div class="headerText">
    <!-- Header -->
    <div class="pageTitle"></div>
    <div class="subTitle"></div>
</div>

    <!-- Property Details -->
    <div class="details">
      <h3>Review the contract</h3>
      <h4>Buyer Contract Details</h4>
      <hr>
      <h5>Property Address</h5>
      <h6 v-if="contract.property">{{ extractPostcode(contract.property.address) }}</h6>
      <p>
        <div v-if="contract.property" >
          {{ extractAddressLine(0, contract.property.address) }}
          <br> {{ extractAddressLine(1, contract.property.address) }}
        </div>
        <p>
          <hr>
          <!-- Completion -->
          <h5>Completion Date</h5>
          <!-- <p style="width: 200px;">ipsum quia dolor sit amet, consectetur, adipisci velit</p> -->
          <h6>{{ formattedCompletionDate }}</h6>

          <hr>
          <!-- Price -->
          <h5> Price </h5>
          <!-- <p style="width: 200px;">ipsum quia dolor sit amet, consectetur, adipisci velit</p> -->
          <h6>{{ this.contract.agreedSalePriceInGBP }}</h6>
          <hr>

          <!-- Additional Terms -->
          <h5> Additional Terms </h5>
          <!-- <p style="width: 200px;">ipsum quia dolor sit amet, consectetur, adipisci velit</p> -->
          <h6>{{ this.contract.contractTerms }}</h6>
          <hr>
          <!-- Contract -->
          <!-- <h5>Contract Details</h5> -->
          <!-- <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p> -->
          <!-- <a href="#/sign">Read Details of Contract</a> -->
          <br>
          <br>
          <!-- <p  style="width: 200px;">Morbi accumsan, massa viverra fringilla pharetra, magna sapien faucibus dui, hendrerit molestie massa nulla ac urna. </p> -->
          <!-- <div style="float: right;margin-top: -91px;padding-right: 10px;width: 122px;"> -->
            <div>
          <button v-on:click="sign" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Agree to Contract</button>
          <br>
          </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  props: ['contractId'],
  data() {
    return {
      contract: {},
      property: {},
      buyer: {},    // the single buyer
      sellers: [],   // the sellers
      propId:this.$route.params.contractId.substring(8)
    }
  },
  async created() {

    // Get contract
    const contractId = this.$route.params.contractId;
    this.contract = await this.loadContract(contractId);
    this.propId=contractId.substring(8);
    // Extract property details
    this.property = this.contract.property;

    /*
          // Get buyer details
          const buyerId = this.extractId(this.contract.buyer[0]); // assume only 1 buyer
          this.buyer = await this.loadParticipant('Buyer', buyerId);

          // Get details for all the sellers
          for (var sellerRef of this.contract.seller) {
            const sellerId = this.extractId(sellerRef);
            this.sellers.push(await this.loadParticipant('Seller', sellerId));
          }
    */
  },
  computed: {
    formattedCompletionDate: function() {
      if (this.contract.completionDate) {
        return moment(this.contract.completionDate).format('DD MMMM YYYY');
      } else {
        return ''
      }
    },
  },
  methods: {
    sign: function() {
      this.$router.push('/signfail/'+this.propId);
    },
    extractId: function(blockchainId) {
      const id = blockchainId.lastIndexOf('#');
      return id == -1 ? blockchainId : blockchainId.substr(id + 1);
    },
    extractPostcode: function(concatenatedAddress) {
      const index = concatenatedAddress.lastIndexOf('(');
      return index == -1 ? "" : concatenatedAddress.substr(index + 1, concatenatedAddress.length - index - 2);
    },
    extractAddressLine: function(line, concatenatedAddress) {
      const lines = concatenatedAddress.split(',');
      return lines[line];
    },
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
    loadParticipant: async function(participantType, participantId) {
      console.log("loadParticipant: " + participantId);

      // Get specified contract
      var data = JSON.stringify({
        'type': participantType,
        'id': participantId,   // supplied participant identifier like 100000001
        'user': 'admin'
      });

      var response = await fetch(process.env.BACKEND_URL + '/api/get/participant', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      });
      return await response.json();
    },
    dismiss: function(date) {
      this.$router.push('sign/'+this.propId);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.pageTitle {
  color: white;
  font-size: 25px;
  padding-bottom: 10px;
  margin-left: -30px;
}

.subTitle {
  color: white;
  font-size: 17px;
  padding-bottom: 20px;
  margin-left: -265px;
}

.details {
  color: white;
  text-align: left;
  position: relative;
  left: 0;
  padding-left: 25px;
  padding-top: 25px;
  padding-right: 25px;
  background-color: #0C1D3B;
  height:600px;
}

.demo-ribbon{
  height: 20vh;
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
