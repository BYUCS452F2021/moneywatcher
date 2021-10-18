<template>
  <div class="home">
    <h1>Add Expense</h1>
    <div class="column">
      <div class="row">
        <vue-autosuggest
            :suggestions="filteredVendors"
            :input-props="{id:'autosuggest__input', placeholder:'Vendor'}"
            @input="onVendorChanged"
            @selected="onVendorSelected"
        >  
          <template slot-scope="{suggestion}">
            <span class="my-suggestion-item">{{suggestion.item.name}}</span>
          </template>
        </vue-autosuggest>
        <div class="horiz-spacer"/>
        <vue-autosuggest
            :suggestions="filteredCategories"
            :input-props="{id:'autosuggest__input', placeholder:'Category'}"
            @input="onCategoryChanged"
            @selected="onCategorySelected"
        >  
          <template slot-scope="{suggestion}">
            <span class="my-suggestion-item">{{suggestion.item.name}}</span>
          </template>
        </vue-autosuggest>
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
      expense_description: "",
      expense_vendor: "",
      selected_vendor: "",
      expense_category: "",
      selected_category: "",
      vendors: [
        {
          data: []
        }
      ],
      categories: [
        {
          data: []
        }
      ]
    };
  },
  computed: {
    filteredVendors() {
      return [
        { 
          data: this.vendors[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.expense_vendor.toLowerCase());
            return include;
          })
        }
      ];
    },
    filteredCategories() {
      return [
        {
          data: this.categories[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.expense_category.toLowerCase());
            return include;
          })
        }
      ]
    }
  },
  methods: {
    onVendorSelected(item) {
      this.selected_vendor = item.item;
    },
    onVendorChanged(text) {
      this.expense_vendor = text;
    },
    onCategorySelected(item) {
      this.selected_category = item.item;
    },
    onCategoryChanged(text) {
      this.expense_category = text;
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
    updateCategories() {
      axios.post('/budget/read_all').then((response) => {
        var result = response.data.result;
        var newCategories = [];
        result.forEach((category) => {
          newCategories.push({categoryID: category.categoryID, name: category.Name});
        });
        this.categories[0].data = newCategories;
      });
    },
    addExpense() {
      // TODO: Handle adding expense if it doesn't exist
      // TODO: If they didn't select a category notify them and don't sent it
      axios.post('/expenses/create', {
        day: "Today", // TODO: Timestamp to now
        categoryID: this.selected_category.categoryID,
        amount: 5.00, // TODO: Set (Need to add a field for amount)
        vendorID: this.selected_vendor.vendorID, // Handle if there isn't one (if they didn't select one)
        description: this.expense_description
      }).then((response) => {
        console.log("Adding vendor result: ", response.data.result);
      });
    }
  },
  beforeMount(){
    this.updateVendors();
    this.updateCategories();
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
    text-align: center;
  }

</style>
