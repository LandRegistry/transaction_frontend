<!-- Display confirmation of contact completion -->
<!-- Parameters: contractId - identifier for specific contract being confirmed -->
<!-- "asset Contract identified by contractId" -->


<template>
  <div style="margin-top: 240px;">
<div class="headerText">
    <!-- Header -->
    <div class="pageTitle">Confirmation Details View</div>
    <div class="subTitle">STEP 3</div>
</div>

    <!-- Property Details -->
    <div class="details">
      <h4>What is this?</h4>
      <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi accumsan, massa viverra fringilla pharetra, magna sapien faucibus dui, hendrerit molestie</p>
      <hr>
      <h4>Property Address</h4>
      <h5 v-if="contract.property">{{ extractPostcode(contract.property.address) }}</h5>
      <p>
        <div v-if="contract.property" style="float: right;margin-top: -50px;padding-right: 10px;">
          {{ extractAddressLine(0, contract.property.address) }}
          <br> {{ extractAddressLine(1, contract.property.address) }}
        </div>
        <p>
          <hr>
          <!-- Handover -->
          <h4>Handover Date</h4>
          <p style="width: 200px;">ipsum quia dolor sit amet, consectetur, adipisci velit</p>
          <h5>{{ formattedCompletionDate }}</h5>
          <hr>
          <!-- Contract -->
          <h4>Contract Details</h4>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit</p>
          <a href="#">Read Terms and Conditions</a>
          <br>
          <br>
          <p  style="width: 200px;">Morbi accumsan, massa viverra fringilla pharetra, magna sapien faucibus dui, hendrerit molestie massa nulla ac urna. </p>
          <div style="float: right;margin-top: -91px;padding-right: 10px;width: 122px;">
          <a href="#">Please read in order to approve</a>
          </div>
    </div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  data() {
    return {
      contract: {},
      property: {},
      buyer: {},    // the single buyer
      sellers: [],   // the sellers
    }
  },
  async created() {

    // Get contract
    const contractId = this.$route.params.contractId;
    this.contract = await this.loadContract(contractId);

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
      return moment(this.contract.completionDate).format('DD MMMM YYYY');
    },
  },
  methods: {
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
      this.$router.push('sign');
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
  color: black;
  text-align: left;
  position: absolute;
  left: 0;
  padding-left: 15px;
  padding-top: 50px;
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
