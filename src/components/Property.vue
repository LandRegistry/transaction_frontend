<!-- Display details of property & associated contract -->
<!-- Parameters: contractId the contract identifier -->
<!-- Note we need the contractId to find contract-related information -->

<template>
  <div style="margin-top: 240px;">
    <div class="headerText">
    <div class="pageTitle">Your Property</div>
    <div class="subTitle">DETAILS</div>

    </div>

    <div class="details">
      <div id="locationMap" v-on:click="displayMap"></div>
      <div style="margin-top: 250px;">
      <h4>Property Address</h4><h5>{{address}}</h5>
      <h4>Owner</h4><h5>{{owners}}</h5>
      <!-- <h5 v-if="contract.property">{{ extractPostcode(contract.property.address) }}</h5>
      <div v-if="contract.property">
        {{ extractAddressLine(0, contract.property.address) }}
        <br> {{ extractAddressLine(1, contract.property.address) }} -->
        <!-- <br> {{ extractAddressLine(3, contract.property.address) }} -->
      </div>
<hr>
      <h4>Handover Date</h4>

      <!-- <p>Ipsum quia dolor sit amet, consectetur, adipisci velit.</p> -->

      <h6>{{ formattedCompletionDate }}</h6>

<hr>
      <h4>Important Information</h4>
<hr>
      <!-- <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus justo diam, tristique at nibh et, porttitor placerat ligula. Pellentesque sagittis enim sed laoreet sagittis. Suspendisse ut auctor arcu. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut viverra mi ut imperdiet pellentesque. Sed tincidunt fringilla sapien, vitae sodales erat ultrices quis. Donec sit amet lacus at nisl placerat tempus a ut erat. Sed in gravida leo. Phasellus rutrum, nibh sit amet scelerisque tincidunt, dui nisl gravida mi, efficitur viverra nisi mauris et metus. Duis et eros vestibulum. -->
      </p>
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
        geolocation: {},
        map: {},
        owners:null,
        address:null
      }
    },
    async created() {
       var data = JSON.stringify({
          'type': 'Property',
          'id': this.$route.params.contractId.substring(8),   // supplied asset identifier
          'user': 'admin'
        });

        await fetch(process.env.BACKEND_URL + '/api/get/assetOwner', {
          method: 'POST',
          mode: 'cors',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => res.text())
        .then(function(data){
        this.owners=data;
      }.bind(this));

  var data = JSON.stringify({
          'type': 'Property',
          'id': this.$route.params.contractId.substring(8),   // supplied asset identifier
          'user': 'admin'
        });

        await fetch(process.env.BACKEND_URL + '/api/get/assetAddress', {
          method: 'POST',
          mode: 'cors',
          body: data,
          headers: {
            'Content-Type': 'application/json',
          }
        }).then(res => res.text())
        .then(function(data){
        this.address=data;
      }.bind(this));
      // Get contract
      const contractId = this.$route.params.contractId;
      this.contract = await this.loadContract(contractId);

      //var uprn = this.$route.params.uprn; // property uprn identifier such as 79984
      var uprn = this.contract.property.propertyId;

      // Use OS Places API to lookup geolocation for property with supplied UPRN
      const osApiKey = 'yVnhiP8vTfAK91SaUOS38psVzuzgZKVa';
      const osUrl = 'https://api.ordnancesurvey.co.uk/places/v1/addresses/uprn?uprn=' + uprn + '&key=' + osApiKey + '&output_srs=WGS84';

      const response = await fetch(osUrl, {
        method: 'GET',
        mode: 'cors'
      });

      this.geolocation = await response.json();
      this.relocate(); // pan & zoom map
    },
    mounted() {

      const osApiKey = 'yVnhiP8vTfAK91SaUOS38psVzuzgZKVa';

      var Road = new L.TileLayer('https://api2.ordnancesurvey.co.uk/mapping_api/v1/service/zxy/{tilematrixSet}/{layer}/{z}/{x}/{y}.{imgFormat}?key={key}', {
        key: osApiKey,
        tilematrixSet: 'EPSG:27700',
        layer: 'Road 27700',
        imgFormat: 'png',
        continuousWorld: true
      });

      var epsg27700 = "+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.999601 +x_0=400000 +y_0=-100000 +ellps=airy +towgs84=446.448,-125.157,542.060,0.1502,0.2470,0.8421,-20.4894 +datum=OSGB36 +units=m +no_defs";
      var crs = new L.Proj.CRS(
        'EPSG:27700',
        epsg27700, {
          transformation: new L.Transformation(1, 238375, -1, 1376256),
          resolutions: [896.0, 448.0, 224.0, 112.0, 56.0, 28.0, 14.0, 7.0, 3.5, 1.75, 0.875, 0.4375, 0.21875, 0.109375],
        });

      var el = document.getElementById('locationMap');
      this.map = L.map(el, {
        crs: crs,
        layers: Road,
        zoomControl: false,
        attributionControl: false,
        maxZoom: 13,
        minZoom: 0,
        center: ([51.507222, -0.1275]),
        zoom: 4
      });

      // Disable all interaction
      this.map.dragging.disable();
      this.map.doubleClickZoom.disable();
      this.map.scrollWheelZoom.disable();
      this.map.keyboard.disable();

    },
    computed: {
      formattedCompletionDate: function() {
        return moment(this.contract.completionDate).format('DD MMMM YYYY');
      },
   },
    methods: {
      loadContract: async function (contractId) {

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
      extractPostcode: function(concatenatedAddress) {
        const index = concatenatedAddress.lastIndexOf('(');
        return index == -1 ? "" : concatenatedAddress.substr(index+1, concatenatedAddress.length-index-2);
      },
      extractAddressLine: function (line, concatenatedAddress) {
        const lines = concatenatedAddress.split(',');
        return lines[line];
      },
      relocate: function (date) {
        // Pan & zoom map to property location
        const zoomLevel = 12;
        this.map.setView([this.geolocation.results[0].DPA.LAT, this.geolocation.results[0].DPA.LNG], zoomLevel);
      },
      displayMap: function() {
        // Navigate to map view for this property
        this.$router.push({ name: 'Map', params: { uprn: this.contract.property.propertyId }});
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #locationMap {
    height: 200px;
    width: 100%;
    position: absolute;
    left: 0;
    margin-top: 40px;
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

.details {
  /* margin-top: 200px; */
  background-color: #0C1D3B;
  color: white;
  text-align: left;
  position: relative;
  left: 0;
  padding-left: 25px;
  padding-top: 50px;
  height:700px;
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
