<template>

  <!-- 
    TODO:
      Make autosuggest fill width
      Make autosuggest pretty
      
    Stretch goals:
      Graphs
      User specified date
   -->

  <div class="home">
    <Chart></Chart>
    <h1 class="mainHeader">Add Expense</h1>
    <div class="column">
      <div>
        <h3 class="header">Vendor:</h3>
      </div>
      <vue-autosuggest
          :suggestions="filteredVendors"
          :input-props="{ 
            id:'autosuggest__input', 
            style: 'display: flex; flex: 1; background: #EFEFEF; border-style: none; width: 100%'
          }"
          @input="onVendorChanged"
          @selected="onVendorSelected"
      >
        <template slot-scope="{suggestion}">
          <span class="my-suggestion-item">{{suggestion.item.name}}</span>
        </template> 
      </vue-autosuggest>
      <div>
        <h3 class="header">Amount:</h3>
      </div>
      <div class="row">
        <input type="number" class="inputField" v-model="entered_amount">
      </div>
      <div>
        <h3 class="header">Category:</h3>
      </div>
        <vue-autosuggest
            :suggestions="filteredCategories"
            :input-props="{id:'autosuggest__input', style: 'display: flex; flex: 1; background: #EFEFEF; border-style: none; width: 100%'}"
            @input="onCategoryChanged"
            @selected="onCategorySelected"
        >
          <template slot-scope="{suggestion}">
            <span class="my-suggestion-item">{{suggestion.item.name}}</span>
          </template>
        </vue-autosuggest>
      <div>
        <h3 class="header">Description:</h3>
      </div>
      <div class="row">
        <input class="inputField" v-model="entered_description">
      </div>
      <div class="leftAlignedRow">
        <div class="horiz-spacer2"/>
        <button class="addButton" v-on:click="onAdd">Add</button>
        <div class="horiz-spacer2"/>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import axios from "../main";
import Chart from '../components/Chart.vue';

export default {
  name: "Home",
  components: {
    Chart
  },
  data() {
    return {
      entered_vendor: "",
      selected_vendor: "",
      existing_vendor: false,
      entered_amount: "",
      entered_category: "",
      selected_category: "",
      valid_category: false,
      entered_description: "",
      vendors: [
        {
          data: []
        }
      ],
      categories: [
        {
          data: []
        }
      ],
    };
  },
  computed: {
    filteredVendors() {
      return [
        {
          data: this.vendors[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.entered_vendor.toLowerCase());
            return include;
          })
        }
      ];
    },
    filteredCategories() {
      return [
        {
          data: this.categories[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.entered_category.toLowerCase());
            return include;
          })
        }
      ]
    }
  },
  methods: {
    onVendorSelected(item) {
      this.selected_vendor = item.item;
      this.existing_vendor = true;
    },
    onVendorChanged(text) {
      this.entered_vendor = text;
      this.existing_vendor = false;
    },
    onCategorySelected(item) {
      this.selected_category = item.item;
      this.valid_category = true;
    },
    onCategoryChanged(text) {
      this.entered_category = text;
      this.valid_category = false;
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
    updateVendors() {
      axios.get('/vendor/read_all').then((response) => {
        var result = response.data.result;
        var newVendors = [];
        result.forEach((vendor) => {
          newVendors.push({vendorID: vendor.vendorID, name: vendor.Name});
        });
        this.vendors[0].data = newVendors;
      });
    },
    updateCategories() {
      axios.get('/budget/read_all').then((response) => {
        var result = response.data.result;
        var newCategories = [];
        result.forEach((category) => {
          newCategories.push({categoryID: category.categoryID, name: category.Name});
        });
        this.categories[0].data = newCategories;
      });
    },
    addExpense(day, categoryID, amount, vendorID, description) {
      axios.post('/expenses/create', {
        day: day,
        categoryID: categoryID,
        amount:amount,
        vendorID: vendorID,
        description: description
      }).then(() => {
        alert("Expense added");
      }).catch(() => {
        alert("Error adding expense");
      });
    },
    onAdd() {
      // Block if it doesn't have an amount
      if (isNaN(parseFloat(this.entered_amount))) {
        alert("Error, invalid amount.");
        return;
      }

      // Block if it isn't an existing category
      if (this.valid_category === false) {
        alert("Error, invalid category. Please select one from the list.");
        return;
      }

      // Handle nonexistent vendors
      if (!this.existing_vendor) {
        if (confirm("Vendor not found. Add " + this.entered_vendor + " as a vendor?")) {
          // Add the new vendor
          axios.post('/vendor/create', {
            name: this.entered_vendor,
            description: "",
          }).then((res) => {
            // Add the expense
            this.addExpense(
              Date.now().toString(),
              this.selected_category.categoryID,
              parseFloat(this.entered_amount),
              res.data.vendorID,
              this.entered_description
            );
          }).catch(() => {
            alert("Error adding vendor");
            return;
          });
        }
        else {
          return;
        }
      }

      else {
        // Just add the expense
        this.addExpense(
          Date.now().toString(),
          this.selected_category.categoryID,
          parseFloat(this.entered_amount),
          this.selected_vendor.vendorID,
          this.entered_description
        );
      }
    }
  },
  beforeMount(){
    this.updateVendors();
    this.updateCategories();
 },
};
</script>

<style scoped>

  .mainHeader {
    text-align: left;
    color: #000000;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 30px;
    line-height: 35px;
    margin: 0;
  }

  .header {
    text-align: left;
    margin: 0;
    color: #000000;
    font-family: Roboto;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 23px;
    margin: 0;
    padding: 10px 0px 10px 0px;
  }

  .column {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 0;
    padding: 0;
  }
  .row {
    display: flex;
    margin: 0;
    padding: 0;
  }

/* FIXME Can't get this to apply to autocomplete input */
  .inputField {
    display: flex;
    flex: 1;
    background: #EFEFEF;
    border-style: none;
  }

  .leftAlignedRow {
    display: flex;
    flex-direction: row;
    align-content: left;
  }
  .addButton {
    margin-top: 20px;
    text-align: center;
    background: #C4C4C4;
    border-style: none;
    font-size: 20px;
    font-family: Roboto;
    padding: 0px 15px 0px 15px;
  }

</style>
