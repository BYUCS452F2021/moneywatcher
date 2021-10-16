<template>
  <div class="home">
    <h1>Add Expense</h1>
    <div class="column">
      <div class="row">
        <vue-autosuggest
            :suggestions="[{data:['Bob', 'Bill', 'Steven']}]"
            :input-props="{id:'autosuggest__input', placeholder:'Do you feel lucky, punk?'}"
            @input="onInputChange"
            @selected="selectHandler"
            @click="clickHandler"
        >  
          <template slot-scope="{suggestion}">
            <span class="my-suggestion-item">{{suggestion.item}}</span>
          </template>
        </vue-autosuggest>
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
    flex: 1;
    text-align: center; /* FIXME doesn't work */
  }

</style>
