<template>
  <div style="margin-top: 240px;">
    <div class="headerText">
    <div class="pageTitle">HMRC / HMLR - Viewer</div>
    </div>
    <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" style="width: 100%;">
      <thead>
        <tr>
          <th class="mdl-data-table__cell--non-numeric">Property Address</th>
          <th>Status</th>
          <th>Property Lock</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody id="records">
        <tr v-for="item in items">
          <td class="mdl-data-table__cell--non-numeric">{{ item.address }}</td>
          <td>{{ soldStatus }}</td>
          <td><div v-html="lockStatus"></div></td>
          <td>
            <router-link :to="{ name: 'timeline', params: { propertyId: item.propertyId }}">Details</router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: []
    }
  },
  async created() {
    var data = JSON.stringify({
      'user': 'hmlr',
      'type': 'Property',
    });

    const response = await fetch('http://192.168.2.127:3500/api/get/asset/all', {
      method: 'POST',
      mode: 'cors',
      body: data,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    this.items = await response.json();
  },
  computed: {
    soldStatus: function(item) {
      console.log(item.status)
      if (item.status == 'UP_FOR_SALE') {
        return 'For Sale';
      } else if (item.status == 'IN_PROCESS_OF_EXCHANGE'){
        return 'In Process of Exchange';
      } else {
        return 'Sold';
      }
    },
    lockStatus: function(item) {
      if (item.status == 'IN_PROCESS_OF_EXCHANGE'){
        return '<i class="material-icons">lock</i>';
      } else {
        return '<i class="material-icons">lock_open</i>';
      }
    }
  },
  methods: {
    save: function(date) {
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
    margin-top: -75px;
    padding-bottom: 50px;
    margin-left: -80px;
  }

  .details {
  /* margin-top: 200px; */
  background-color: #0C1D3B;
  color: white;
  text-align: center;
  position: absolute;
  left: 0;
  /* padding-left: 25px; */
  height: 600px;
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