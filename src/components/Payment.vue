<template>
  <div style="margin-top: 220px;">
    <div class="pageTitle">Payment</div>
    <div class="subTitle">STEP 4</div>
    <div class="details">
      <h4>Relax, we'll sort out all the money.</h4>

      <p>ipsum quia dolor sit amet, consectetur, adipisci velit</p>

      <i class="material-icons md-200 red">credit_card</i>

      <div class="demo-list-action mdl-list">
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Deposit</span>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="deposit" class="material-icons green">done</i>
              <i v-else class="material-icons red">clear</i>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Mortgage funds</span>
          </span>
          <a class="mdl-list__item-secondary-action" href="#">
            <i v-if="mortgage" class="material-icons green">done</i>
              <i v-else class="material-icons red">clear</i>
          </a>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Additional payment</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="additional" class="material-icons green">done</i>
              <i v-else class="material-icons red">clear</i>
            </a>
          </span>
        </div>
        <div class="mdl-list__item">
          <span class="mdl-list__item-primary-content">
            <span>Escrow funds released</span>
          </span>
          <span class="mdl-list__item-secondary-content">
            <a class="mdl-list__item-secondary-action" href="#">
              <i v-if="escrow" class="material-icons green">done</i>
              <i v-else class="material-icons red">clear</i>
            </a>
          </span>
        </div>
      </div>
      <p>The above funds have been paid or are waiting to be paid by others.</p>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      deposit: false,
      mortgage: false,
      additional: false,
      escrow: false
    }
  },
  computed: {

  },
  methods: {
    
  },
  created: function () {
    var data = JSON.stringify({
        "type": "PropertyExchange",
        "id": this.$route.params.exchangeid,
        "user": "hmlr"
    })

    fetch('http://192.168.2.127:3500/api/get/asset', {
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
        this.additional = result.hasOwnProperty("additionalFundsReceipt")
        this.escrow = result.hasOwnProperty("escrowPayoutReceipt")
      });
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
  position: absolute;
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
