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
        <input type="number" class="amount" v-model="entered_amount" placeholder="Amount">
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
        <input class="item3" v-model="entered_description" placeholder="Description">
      </div>
      <div class="centered-row">
        <div class="horiz-spacer2"/>
        <button class="item4" v-on:click="onAdd">Add</button>
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
      ]
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
    flex: 1;
  }
  .amount {
    display: flex;
    flex: 2;
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
