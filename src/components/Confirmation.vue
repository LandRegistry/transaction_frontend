<!-- Display confirmation of contact completion -->
<!-- Parameters: contractId - identifier for specific contract being confirmed -->
<!-- "asset Contract identified by contractId" -->


<template>
  <div style="margin-top: 180px;">

    <!-- Property Details -->
    <div class="details">
      <h3>Review the contract</h3>
      <h4>Buyer contract details</h4>
      <hr>
      <h5>Property address</h5>
      <p>
        <div v-if="contract.property" >
          <h6>{{ extractAddressLine(0, contract.property.address) }}
          <br>{{ extractAddressLine(1, contract.property.address) }}
          <br>{{ extractAddressLine(2, contract.property.address) }} </h6>
        </div>
        <p>
          <hr>
          <!-- Completion -->
          <h5>Completion Date</h5>
          <h6>{{ formattedCompletionDate }}</h6>

          <hr>
          <!-- Price -->
          <h5>Price </h5>
          <h6>£{{ formatPriceWithCommas(this.contract.agreedSalePriceInGBP) }}</h6>
          <hr>

          <!-- Additional Terms -->
          <h5>Additional Terms </h5>
          <h6>{{ this.contract.contractTerms }}</h6>
          <hr>
          <br>
          <div>
            <button v-on:click="sign" class="mdl-button mdl-js-button mdl-button--raised blue">Agree to contract</button>
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
    // this.property = this.contract.property;

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
        return moment(this.contract.completionDate).format('Do MMMM YYYY');
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
    formatPriceWithCommas: function(price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
  font-size: 25px;
  padding-bottom: 10px;
  margin-left: -30px;
}

.subTitle {
  font-size: 17px;
  padding-bottom: 20px;
  margin-left: -265px;
}

.details {
  text-align: left;
  position: relative;
  left: 0;
  padding-left: 25px;
  padding-top: 25px;
  padding-right: 25px;
  height:600px;
}

.demo-ribbon{
  height: 20vh;
}

.headerText {
    position: absolute;
    width: 100%;
    left: 0;
    height: 80px;
    margin-top: -23px;
}
</style>
