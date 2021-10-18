<template>
  <div class="home">
    <h1>Add Expense</h1>
    <div class="column">
      <div class="row">
        <vue-autosuggest
            :suggestions="filteredOptions"
            :input-props="{id:'autosuggest__input', placeholder:'Vendor'}"
            @input="onInputChange"
            @selected="onSelected"
        >  
          <template slot-scope="{suggestion}">
            <span class="my-suggestion-item">{{suggestion.item.name}}</span>
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
        <button class="item4" v-on:click="addExpense">Add</button>
        <div class="horiz-spacer2"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "../main";

export default {
  name: "Home",
  components: {
  },
  data() {
    return {
      expense_category: "",
      expense_description: "",
      query: "",
      selected_vendor: "",
      vendors: [
        {
          data: []
        }
      ]
    };
  },
  computed: {
    filteredOptions() {
      return [
        { 
          data: this.vendors[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.query.toLowerCase());
            return include;
          })
        }
      ];
    }
  },
  methods: {
    onSelected(item) {
      this.selected_vendor = item.item;
    },
    onInputChange(text) {
      this.query = text;
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
    updateVendors() {
      axios.post('/vendor/read_all').then((response) => {
        var result = response.data.result;
        var newVendors = [];
        result.forEach((vendor) => {
          newVendors.push({vendorID: vendor.vendorID, name: vendor.Name});
        });
        this.vendors[0].data = newVendors;
      });
    },
    addExpense() {
      // TODO: Add expense here (and vendor)
      console.log("Clicked");
      console.log(this.selected_vendor.vendorID);
      console.log(this.expense_category);
      console.log(this.expense_description);
    }
  },
  beforeMount(){
    this.updateVendors();
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
