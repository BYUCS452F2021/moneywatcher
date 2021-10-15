<template>
  <div class="home">
    <h1>Add Expense</h1>
    <div class="column">
      <div class="row">
        <input class="item1" v-model="expense_vendor" placeholder="Vendor">
        <div class="horiz-spacer"/>
        <input class="item2" v-model="expense_category" placeholder="Category">
      </div>
      <div class="row">
        <input class="item3" v-model="expense_description" placeholder="Description">
      </div>
      <div class="centered-row">
        <div class="horiz-spacer2"/>
        <button class="item4">Add</button>
        <div class="horiz-spacer2"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  components: {
  },
};
</script>

<style scoped>

  .column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
  }
  .row {
    display: flex;
    flex-direction: row;
  }

  .item1 {
    display: flex;
    flex: 7;
  }
  .horiz-spacer {
    display: flex;
    flex: 1;
  }
  .item2 {
    display: flex;
    flex: 2;
  }

  .item3 {
    display: flex;
    flex: 1;
  }

  .centered-row {
    display: flex;
    flex-direction: row;
    align-content: center;
  }
  .horiz-spacer2 {
    display: flex;
    flex: 4;
  }
  .item4 {
    display: flex;
    flex: 1;
  }

</style>
