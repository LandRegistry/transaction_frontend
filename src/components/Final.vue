<template>
  <div style="margin-top: 220px;">
    <div class="pageTitle">Congratulations</div>
    <div class="subTitle">STEP 5</div>
    <div class="details">
      <h4>Congratulations, you've sold your house.</h4>

      <i class="material-icons md-200 red">flight_takeoff</i>
      <h4>Take a holiday - you've earned it!</h4>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {

  },
  methods: {
    
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
