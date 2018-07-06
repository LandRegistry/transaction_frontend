<template>
  <div style="margin-top: 180px;">
    <div class="details">
      <h3>Create a contract</h3>
      <h4>Seller contract details</h4>
      <hr>
      <h5>Address</h5>
      <address class="address">
        <h6>{{address.firstLine}} <br> {{address.city}} <br> {{address.postcode}}</h6>
      </address>
      <hr>
      <div class="findAddress"> 
        <h5>Price</h5>
        <span class="money-input">£  <input v-model.number="price" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="price"></span>
      </div>  
      <hr>
      <h5>Seller</h5>
      <h6 class="participant">{{seller.title}} {{seller.firstName}} {{seller.lastName}} </h6>
      <hr>
      <h5>Buyer</h5>
      <h6 class="participant">{{buyer.title}} {{buyer.firstName}} {{buyer.lastName}}</h6>
      <hr>
      <h5>Completion Date</h5>
      <datepicker v-model="dateOfCompletion" name="dateOfCompletion"></datepicker>
      <hr>
      <h5>Additional Terms</h5>
      <textarea v-model="terms"></textarea>
      <hr>
      <button v-on:click="save" class="mdl-button mdl-button--raised blue">Create contract</button>
      <pulse-loader :loading="loading" :color="color"></pulse-loader>
    </div>

  </div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'

export default {
  components: {
    Datepicker,
    PulseLoader
  },
  props: ['buyerId', 'sellerId', 'propId'],
  created() {
    var buyerRequest = JSON.stringify({
      type: "Buyer",
      id: this.$route.params.buyerId,
      user: "admin"
    });

    var sellerRequest = JSON.stringify({
      type: "Seller",
      id: this.$route.params.sellerId,
      user: "admin"
    });

    const getUser = (user) => fetch(process.env.BACKEND_URL + '/api/get/participant', {
      method: 'POST',
      mode: 'cors',
      body: user,
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json());

    Promise.all([getUser(sellerRequest), getUser(buyerRequest)]).then(result => {
      const seller = result[0];
      const buyer = result[1];

      this.seller = {
        id: seller.saleParticipantId,
        title: seller.title,
        firstName: seller.saleParticipantFirstName,
        lastName: seller.saleParticipantLastName
      }

      this.buyer = {
        id: buyer.saleParticipantId,
        title: buyer.title,
        firstName: buyer.saleParticipantFirstName,
        lastName: buyer.saleParticipantLastName
      }
    })
  },
  data() {
    return {
      buyer: {},
      seller: {},
      postcode: 'HM1 2LR',
      propertyId: this.$route.params.propId,
      dateOfCompletion: new Date(),
      price: 180000,
      terms: '',
      loading: false,
      color: '#488aff',
      address: {
        firstLine: '1 Digital Street',
        city: 'England',
        postcode: 'HM1 2LR'        
      }
      
    }
   
  },
  methods: {
    findProperty: function() {
      this.address = {
        firstLine: '1 Digital Street',
        city: 'England',
        postcode: 'HM1 2LR'
      }
      this.propertyId = this.$route.params.propId;
      console.log("propertyId",this.propId);
      this.price = 180000
    },
    save: function() {
      this.loading = true;
      const body = {
        contractID: 'contract'.concat(this.$route.params.propId),
        propertyExchangeID: 'propertyExchange'.concat(this.$route.params.propId),
        user: this.seller.id,
        contractAttributes: {
          completionDate: this.dateOfCompletion,
          status: "DRAFTED",
          agreedSalePriceInGBP: this.price,
          stampDuty: this.price * 0.1,
          representativeFees: 500,
          contractTerms: this.terms,
          property: {
            namespace: "org.hmlr.model",
            type: "Property",
            id: this.propertyId
          },
          buyer: [
            {
              namespace: "org.hmlr.model",
              type: "Buyer",
              id: this.buyer.id
            }
          ],
          seller: [
            {
              namespace: "org.hmlr.model",
              type: "Seller",
              id: this.seller.id
            }
          ]
        }
      }
      fetch(process.env.BACKEND_URL + '/api/create/propertyexchange', {
        method: 'POST',
        mode: 'cors',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => {
        if (res.status === 200) {
          this.loading = false;
          this.$router.push('/sign/'+this.$route.params.propId)
        }
      });
    }
  }
}

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

input {
  font-size: 16px;
}

textarea {
  width: 60%;
  height: 100px;
}

.text{
  width:100%;
  text-align:left;
  background-color: white;
}

.mdl-card {
  width: 100%;
  text-align: left;
}

.address-details {
  display: flex;
  justify-content: space-between;
}

.findAddress {
  width: 60%;
}

address {
  text-align: left;
}

.pageTitle {
  color: white;
  font-size: 25px;
  padding-bottom: 10px;
  margin-left: -150px;
}

.headerText {
  background-color: #0C1D3B;
  position: absolute;
  width: 100%;
  left: 0;
  height: 80px;
  margin-top: -23px;
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
  position: relative;
  left: 0;
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 25px;
  background-color: white;
  height:950px;
}

.money-input {
  font-size: 16px;
}

</style>

<style>
  .vdp-datepicker .vdp-datepicker__calendar {
    position: static;
  }

  .vdp-datepicker input {
    font-size: 16px;
  }
</style>
