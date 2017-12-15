<template>
    <div style="margin-top: 240px;">
        <div class="headerText">
            <div class="pageTitle">Your Property</div>
            <div class="subTitle">DETAILS</div>
        </div>
        <div style="padding-top: 26px;">


        <router-link class="mdl-grid" to="/contract">
            <div class="mdl-cell mdl-cell--12-col">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title card__title-inactive">
                        <h2 class="mdl-card__title-text">Step 1: Create a Contract</h2>
                    </div>

                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons" v-if="stage1status === 'complete'">done</i>
                            <i class="material-icons" v-if="stage1status === 'current'">mode_edit</i>
                        </button>
                    </div>

                    <!-- <div class="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
                    </div> -->

                </div>
            </div>
        </router-link>

        <router-link class="mdl-grid" to="/signfail">
            <div class="mdl-cell mdl-cell--12-col">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title card__title-inactive">
                        <h2 class="mdl-card__title-text">Step 2: Negotiate and Sign</h2>
                    </div>

                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons" v-if="stage2status === 'complete'">done</i>
                            <i class="material-icons" v-if="stage2status === 'current'">mode_edit</i>
                        </button>
                    </div>

                    <!-- <div class="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
                    </div> -->
                </div>
            </div>
        </router-link>

        <router-link class="mdl-grid" to="/payment/propertyExchange1">
            <div class="mdl-cell mdl-cell--12-col">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title card__title-inactive">
                        <h2 class="mdl-card__title-text">Step 3: Payment</h2>
                    </div>

                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons" v-if="stage3status === 'complete'">done</i>
                            <i class="material-icons" v-if="stage3status === 'current'">mode_edit</i>
                        </button>
                    </div>

                    <!-- <div class="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
                    </div> -->

                </div>
            </div>
        </router-link>


        <router-link class="mdl-grid" to="/property/contract1">
            <div class="mdl-cell mdl-cell--12-col">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title card__title-inactive">
                        <h2 class="mdl-card__title-text">Step 4: Property</h2>
                    </div>

                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons" v-if="stage4status === 'complete'">done</i>
                            <i class="material-icons" v-if="stage4status === 'current'">mode_edit</i>
                        </button>
                    </div>

                    <!-- <div class="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
                    </div> -->
                </div>
            </div>
        </router-link>

        <router-link class="mdl-grid" to="/final">
            <div class="mdl-cell mdl-cell--12-col">
                <div class="demo-card-wide mdl-card mdl-shadow--2dp">
                    <div class="mdl-card__title card__title-inactive">
                        <h2 class="mdl-card__title-text">Step 5: Completion</h2>
                    </div>

                    <div class="mdl-card__menu">
                        <button class="mdl-button mdl-button--icon mdl-js-button mdl-js-ripple-effect">
                            <i class="material-icons" v-if="stage4status === 'complete'">done</i>
                            <i class="material-icons" v-if="stage4status === 'current'">mode_edit</i>
                        </button>
                    </div>

                    <!-- <div class="mdl-card__supporting-text">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sagittis pellentesque lacus eleifend lacinia...
                    </div> -->
                </div>
            </div>
        </router-link>

    </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            firstName: 'John',
            lastName: 'Smith',
            stage1status: 'future',
            stage2status: 'future',
            stage3status: 'future',
            stage4status: 'future',
            propertyExchange: null
        }
    },
    async created() {
        let propertyExchangeRequest = JSON.stringify({
            type: "Buyer",
            id: this.$route.params.propertyExchangeId,
            user: "admin"
        });

        let sellerRequest = JSON.stringify({
            type: "Seller",
            id: this.$route.params.sellerId,
            user: "admin"
        });

        console.log('called with ' + this.$route.params.propertyExchangeId + ' unt ' + this.$route.params.sellerId);


        var payload = JSON.stringify({
            "type": "PropertyExchange",
            // "id": "propertyExchange1",
            // "user": "100000002"
            "id": this.$route.params.propertyExchangeId,
            "user": this.$route.params.sellerId
        });
        
        const response = await fetch(process.env.BACKEND_URL + '/api/get/asset', {
            method: 'POST',
            mode: 'cors',
            body: payload,
            headers: {
                'Content-Type': 'application/json',
            }
        });

        await response.json().then((pe) => {
            this.propertyExchange = pe;
            this.stage1status = this.checkStep1();
            this.stage2status = this.checkStep2();
            this.stage3status = this.checkStep3();
            this.stage4status = this.checkStep4();
        });
    },
    computed: {
        fullName: function() {
            return `${this.firstName} ${this.lastName}`;
        }
    },
    methods: {
        save: function(date) {
            this.$router.push('signfail');
        },

        /*
            Each box in the timeline calls a checkStepX function where it checks if it is complete, current or future

            Step 1: Create Contract
            Complete: Contract field in PropertyExchange is not null
            Current: n/a
            Future: n/a

            Step 2: Negotiate and Sign
            Complete: All entries in 'agreed' are the same as the ids in buyers and sellers and completion date is set
            Current: Step 1 is complete and there are no payment receipts
            Future: n/a

            Step 3: Payment
            Complete: all payment receipts are in the property exchange and have a value

            Step 4: Congrats
        */
        waffleOn: function() {
            console.log('cactus');
        },
        checkStep1: function() {
            console.log('checkStep1' + (JSON.stringify(this.propertyExchange)));
            if (this.propertyExchange == null) {
                return 'current';
            } else {
                return 'complete';
            }
        },
        checkStep2: function() {

            // Is this future?
            console.log('checkStep2' + (JSON.stringify(this.propertyExchange.contract)));

            console.log('checkStep2 buyer' + (JSON.stringify(this.propertyExchange.contract.buyer)));
            console.log('checkStep2 seller' + (JSON.stringify(this.propertyExchange.contract.seller)));

            if (this.propertyExchange == null) {
                return 'future';
            } else {
                let participants = [];

                console.log('buyer is ' + JSON.stringify(this.propertyExchange.contract.buyer));
                Object.keys(this.propertyExchange.contract.buyer).forEach((b) => {
                    participants.push(this.propertyExchange.contract.buyer[b].saleParticipantId);
                });


                Object.keys(this.propertyExchange.contract.seller).forEach((s) => {
                    participants.push(this.propertyExchange.contract.seller[s].saleParticipantId);
                });

                // console.log('participants is ' + JSON.stringify(participants.sort().join(',')) );
                // console.log('agreed is ' + JSON.stringify(this.propertyExchange.contract.agreed.sort().join(',')) );
                // console.log('equal is ' + (this.propertyExchange.contract.agreed.sort().join(',') == (this.propertyExchange.contract.agreed.sort().join(','))) );

                //console.log(participants.sort().join(',') + " as well as " + this.propertyExchange.contract.agreed.sort().join(','));

                if (participants.sort().join(',') == this.propertyExchange.contract.agreed.sort().join(',')) {
                    return 'complete';
                } else {
                    return 'current';
                }
            }
        },
        checkStep3: function() {

            if (this.stage2status == 'complete') {

                if (this.propertyExchange.depositReceipt != null &&
                    this.propertyExchange.mortgageReceipt != null &&
                    this.propertyExchange.additionalFundsReceipt != null &&
                    this.propertyExchange.escrowPayoutReceipt != null) {
                    return 'complete';
                } else {
                    return 'current';
                }
            } else {
                return 'future';
            }
        },
        checkStep4: function() {
            if (this.stage3status == 'complete') {
                return 'complete';
            } else {
                return 'future';
            }
        },
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo-card-wide.mdl-card {
    width: 100%;
}

.demo-card-wide>.mdl-card__title {
    height: 60px;
}

.card__title-active {
    background: green;
}

.card__title-inactive {
}

.demo-card-wide>.mdl-card__menu {
    color: #fff;
}

.mdl-data-table {
    width: 100%;
}

.demo-list-icon {
    width: 300px;
}

.left-mdl-content {
    text-align: left;
}

.mdl-card {
    min-height: 0px;
}

.mdl-card__bold-text {
    font-family: "Roboto", "Helvetica", "Arial", sans-serif;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
}

  .headerText {
    background-color: #0C1D3B;
    position: absolute;
    width: 100%;
    left: 0;
    height: 80px;
    margin-top: -23px;
}

  .pageTitle {
    color: white;
    font-size: 25px;
    padding-bottom: 10px;
    margin-left: -180px;
  }

  .subTitle {
    color: white;
    font-size: 17px;
    padding-bottom: 20px;
    margin-left: -265px;
  }

  a {
      text-decoration: none;
  }

.material-icons {
    color: #0c1d3b;
    font-weight: bolder;
}
</style>