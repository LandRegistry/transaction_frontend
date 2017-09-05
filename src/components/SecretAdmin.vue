<template>
  <div style="margin-top: 320px;">
    <div class="pageTitle">Super-Secret Admin Page</div>
      <div class="details">
          <div class="mdl-grid">
              <select class="white" v-model="exchangeid" v-on:change="details">
                <option disabled value="">Choose a property Exchange ID</option>
                <option v-for="option in propertyexchanges" v-bind:value="option.propertyExchangeId">
                  {{ option.propertyExchangeId }}
                </option>
              </select>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="dobuyersign" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                (Buyer) Sign
              </button>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="deposit" v-model="deposit">
                <label class="mdl-textfield__label" for="deposit">Deposit amount</label>
                <span class="mdl-textfield__error">Input is not a number!</span>
              </div>
            </div>
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="dodeposit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                (Buyer) Pay deposit
              </button>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="mortgage" v-model="mortgage">
                <label class="mdl-textfield__label" for="mortgage">Mortgage amount</label>
                <span class="mdl-textfield__error">Input is not a number!</span>
              </div>
            </div>
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="domortgage" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                (Lender) Pay mortgage
              </button>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--4-col">
              <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input class="mdl-textfield__input" type="text" pattern="-?[0-9]*(\.[0-9]+)?" id="additional" v-model="additional">
                <label class="mdl-textfield__label" for="additional">Additional amount</label>
                <span class="mdl-textfield__error">Input is not a number!</span>
              </div>
            </div>
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="doadditional" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                (Buyer) Pay fees
              </button>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="domonies" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">
                (Escrow) Pay out
              </button>
            </div>
          </div>
          <div class="mdl-grid">
            <div class="mdl-cell mdl-cell--8-col">
              <button v-on:click.prevent="doowner" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">
                Change property owner
              </button>
            </div>
          </div>
    </div>
    <div id="demo-toast-example" class="mdl-js-snackbar mdl-snackbar">
      <div class="mdl-snackbar__text"></div>
      <button class="mdl-snackbar__action" type="button"></button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      propertyexchanges: [],
      exchangeid: '',
      saleprice: 0,
      mortgage: 0,
      deposit: 0,
      additional: 0,
      hmrc:0
    }
  },
  created: function () {
    var data = JSON.stringify({
        "type": "PropertyExchange",
        "user": "hmlr"
    })

    fetch('http://192.168.2.127:3500/api/get/asset/all', {
      method: 'POST',
      mode: 'cors',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      }
    }).then(res => res.json())
      .then(result => this.propertyexchanges = result);
  },
  methods: {
    details: function() {
      if (this.exchangeid === '') return
      var data = JSON.stringify({
        'user': 'hmlr',
        'type': 'PropertyExchange',
        'id': this.exchangeid,
      })

      this.saleprice = 0
      this.hmrc = 0
      this.deposit = 0
      this.mortgage = 0
      this.buyerid = ''
      this.additional = 0

      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Getting details, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/get/asset', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.json())
        .then(result => { this.saleprice = result.contract.agreedSalePriceInGBP
                          this.hmrc = result.contract.stampDuty
                          this.additional = result.contract.representativeFees
                          this.deposit = this.saleprice / 10
                          this.mortgage = this.saleprice - this.deposit
                          this.buyerid = result.contract.buyer[0].split("#")[1]
                          this.contractid = result.contract.contractId
                          messagedata.message = "Details retrieved"
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
        

    },
    dodeposit: function() {
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "buyer": {
            "namespace": "org.hmlr.model",
            "type": "Buyer",
            "id": this.buyerid
          },
          "ammountInGBP": this.deposit
        },
	      "propertyExchangeId": this.exchangeid,
        "user": this.buyerid
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Making payment, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/payment/deposit', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
    },
    doadditional: function() {
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "buyer": {
            "namespace": "org.hmlr.model",
            "type": "Buyer",
            "id": this.buyerid
          },
          "ammountInGBP": this.additional
        },
	      "propertyExchangeId": this.exchangeid,
        "user": this.buyerid
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Making payment, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/payment/additional', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
    },
    domortgage: function() {
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
          "lender": {
            "namespace": "org.hmlr.model",
            "type": "Lender",
            "id": "santander"
          },
          "ammountInGBP": this.mortgage
        },
	      "propertyExchangeId": this.exchangeid,
        "user": "santander"
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Making payment, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/payment/mortgage', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
    },
    domonies: function() {
      var data = JSON.stringify({
        "receiptId": Math.floor(Math.random() * 1000000).toString(),
	      "attributes": {
        "sellerAmmountInGBP": 1,
        "sellerLenderAmmountInGBP": 1,
        "sellerHMRCAmmountInGBP": this.hmrc
        },
        "propertyExchangeId": this.exchangeid,
        "user": "escrow"
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Making payout, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/payment/escrowpayout', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
    },
    doowner: function() {
      var data = JSON.stringify({
        "propertyExchangeId": this.exchangeid,
        "user": "hmlr"
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Completing, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/property/transfer', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
    },
    dobuyersign: function() {
      var data = JSON.stringify({
        "type": "ApproveContract",
	      "user": this.buyerId,
	      "attributes": {
		      "contractToUpdateId": this.contractid
	      }
      })
      var snackbarContainer = document.querySelector('#demo-toast-example')
      var messagedata = {message: "Signing, please wait...", timeout: 1500}
      snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)

      fetch('http://192.168.2.127:3500/api/transaction', {
        method: 'POST',
        mode: 'cors',
        body: data,
        headers: {
          'Content-Type': 'application/json',
        }
      }).then(res => res.text())
        .then(result => { messagedata.message = result
                          snackbarContainer.MaterialSnackbar.showSnackbar(messagedata)
        });
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

.white {
  color: white;
}
</style>
