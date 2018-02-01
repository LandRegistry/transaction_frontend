<template>
  <div style="margin-top: 240px;">
    <div class="headerText">
      <div class="pageTitle"></div>
      <div class="subTitle"></div>
    </div>
    <!-- <div class="mdl-card mdl-shadow--2dp" style="top:33px;">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">What is this?</h2>
      </div>
      <div class="address-details mdl-card__supporting-text">
         Seller Contract Details
      </div>
    </div> -->
    <div class="details">

<h3>Create a contract</h3>
<h4>Seller contract details</h4>
<hr>
<h5>Address</h5>
<address class="address">
          <h6>{{address.firstLine}} <br> {{address.city}} <br> {{address.postcode}}</h6>
        </address>
<div class="findAddress"> 
  <span>Price</span>
            <input v-model.number="price" class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="price"></div>
            
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
<h5>Automated Contract</h5>
<button v-on:click="save" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Create</button>
<pulse-loader :loading="loading"></pulse-loader>
</div>
    <!-- <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Address</h2> -->
        <!-- <i v-if="propertyId" class="material-icons">done</i> -->
      <!-- </div>
      <div class="address-details mdl-card__supporting-text">
        <div class="findAddress"> -->
<!-- 
          <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
            
            <input v-model="postcode" class="mdl-textfield__input" type="text" id="postcode">
            <label class="mdl-textfield__label" for="postcode">Postcode</label>
          </div> -->

          <!-- <button v-on:click="findProperty" class="findButton mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Find</button> -->

          <!-- <div class="mdl-textfield mdl-js-textfield">
            <span>Price</span>
            <input v-model.number="price" class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="price">
            <span class="mdl-textfield__error">Not a valid price!</span>
          </div>

        </div>
        <address class="address">
          {{address.firstLine}} <br> {{address.city}}
        </address>
      </div>
    </div> -->

    <!-- <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Seller</h2>
      </div>
      <div class="address-details mdl-card__supporting-text">
        <h5 class="participant">{{seller.title}} {{seller.firstName}} {{seller.lastName}} </h5>
      </div>
    </div>

    <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Buyer</h2>
      </div>
      <div class="address-details mdl-card__supporting-text">
        <h5 class="participant">{{buyer.title}} {{buyer.firstName}} {{buyer.lastName}}</h5>
      </div>
    </div>

    <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Completion Date</h2>
        <i class="material-icons">done</i>
      </div>
      <div class="mdl-card__supporting-text"> -->
        <!-- <p>DummyText Lorem ipsum dolor sit amet, consectetuer adipiscing elit.</p> -->
        <!-- <datepicker v-model="dateOfCompletion" name="dateOfCompletion"></datepicker>
      </div>
    </div>

    <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Additional Terms</h2>
        <i class="material-icons">done</i>
      </div>
      <div class="mdl-card__supporting-text">
        <textarea v-model="terms"></textarea>
      </div>
    </div>

    <div class="mdl-card mdl-shadow--2dp">
      <div class="mdl-card__title">
        <h2 class="mdl-card__title-text">Automated Contract</h2>
      </div>
      <div class="mdl-card__supporting-text"> -->
        <!-- <p>
          DummyText Lorem ipsum dolor sit amet, consectetuer adipiscing elit.
          <a href="#">Read Details of Contract</a> Aenean commodo ligula eget dolor. Aenean massa.
        </p>
        <p>
          DummyText Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. DummyText Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa.
        </p> -->
        <!-- <button v-on:click="save" class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--colored">Create</button>
      </div>
      <pulse-loader :loading="loading"></pulse-loader> -->
    <!-- </div> -->
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
textarea {
  width: 98%;
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
</style>
<style>
.vdp-datepicker .vdp-datepicker__calendar {
  position: static;
}
</style>
