<!-- Display map of property location -->
<!-- Parameters: uprn for property -->

<!-- NOTE: this view is NOT BEING USED and functionality replaced in the Property view -->

<template>
  <div>
    <div style="margin-top: 240px;">
      <div class="headerText">
      <div class="pageTitle">Your Property</div>
       <div class="subTitle">LOCATION</div>
      <div id="locationMap"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        geolocation: {},
        map: {},
      }
    },
    async created() {
      var uprn = this.$route.params.uprn; // property uprn identifier such as 79984

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
        zoomControl: true,
        attributionControl: false,
        maxZoom: 13,
        minZoom: 0,
        center: ([51.507222, -0.1275]),
        zoom: 4
      });

    },
    methods: {
      save: function (date) {
        this.$router.push('sign');
      },
      relocate: function (date) {
        // Pan & zoom map to this location
        const zoomLevel = 12;
        this.map.setView([this.geolocation.results[0].DPA.LAT, this.geolocation.results[0].DPA.LNG], zoomLevel);
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #locationMap {
    height: 400px;
    width: 100%;
    position: absolute;
    left: 0;
  }

  .pageTitle {
    color: white;
    font-size: 25px;
    margin-top: -75px;
    padding-bottom: 10px;
    margin-left: -180px;
  }

  .subTitle {
    color: white;
    font-size: 17px;
    padding-bottom: 20px;
    margin-left: -265px;
  }


</style>
