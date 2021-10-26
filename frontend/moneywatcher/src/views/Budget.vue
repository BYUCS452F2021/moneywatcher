<template>
  <div class="budget">
    <h2>Monthly Budget</h2>
    <div id="category_table">
      <div class="row" id="titles">
        <h3 id="title_left">Category</h3>
        <h3 id="title_right">Amount</h3>
      </div>
      <div class="row" v-for="category in categories" :key="category.vendorID">
        <p class="row_name">{{category.Name}}</p>
        <p class="row_amount">${{category.Amount.toFixed(2)}}</p>
        <div id="edit_button" v-on:click="deleteCategory(category.categoryID)">
          <img src="/icons/edit.svg">
        </div>
        <div id="remove_button" v-on:click="deleteCategory(category.categoryID)">
          <img src="/icons/delete.svg">
        </div>
      </div>
      <div class="row">
        <div id="add_data" v-if="add_field">
          <input v-model="new_category" type="text" id="name" name="name">
          <input v-model="new_amount" type="number" id="amount" amount="amount">
          <div id="submit_button" v-on:click="addCategory()">
            <img src="/icons/check.svg">
          </div>
          <div id="cancel_button" v-on:click="deactivateAdd()">
            <img src="/icons/x.svg">
          </div>
        </div>
        <div id="add_category" v-else v-on:click="setAdd()">
          <img src="/icons/add.svg">
        </div>
      </div>
      <div class="row" id="footer">
        <h3 class="row_name">Total</h3>
        <h3 class="row_amount_total">${{total_budget}}</h3>
      </div>
    </div>
    <div class="deactivated">
      <p>Add Categories</p>
      <form>
        <div id="form_data">
          <div>
            <label for="name">Category:</label><br>
            <input v-model="new_category" type="text" id="name" name="name"><br>
          </div>
          <div>
            <label for="amount">Amount:</label><br>
            <input v-model="new_amount" type="number" id="amount" amount="amount"><br>
          </div>
        </div>
        <input type="submit" value="Submit" v-on:click="addCategory">
      </form>
    </div>
  </div>
</template>

<script>
import axios from '../main';

export default {
  name: "Budget",
  data () {
    return {
      categories: [],
      new_category: "",
      new_amount: 0,
      add_field: false
    }
  },
  created() {
    this.loadBudget();
  },
  methods: {
    async loadBudget() {
      try {
        let response = await axios.get('/budget/read_all');
        this.categories = response.data.result;
      }
      catch (error) {
        console.log(error)
      }
    },
    async addCategory() {
      try {
        let response = await axios.post('/budget/create', {
          name: this.new_category,
          amount: parseFloat(this.new_amount)
        });
        console.log(response);
        this.new_category = "";
        this.new_amount = 0;
        this.loadBudget();
        this.deactivateAdd();
      }
      catch (error) {
        console.log(error)
      }
    },
    async deleteCategory(catID) {
    try {
      let response = await axios.post('/budget/delete', {
        categoryID: catID
      });
      console.log(response);
      this.loadBudget();
    }
    catch (error) {
      console.log(error)
    }
    },
    setAdd() {
      this.add_field = true;
    },
    deactivateAdd() {
      this.add_field = false;
      this.new_category = "";
      this.new_amount = 0;
    }
  },
  computed: {
    total_budget() {
      var total = 0;
      this.categories.forEach(getSum);
      function getSum(item, index, arr) {
        total += arr[index].Amount;
      }

      return total.toFixed(2);
    }
  }
};

</script>

<style scoped>

.budget {
  text-align: left;
  padding: 0px 5px;
}

h2 {
  padding: 0px 10px;
  margin-bottom: 0px;
}

#category_table {
  padding: 0px 0px;
}

#titles, #footer {
  background-color: transparent;
}

#title_left {
  width: 55%;
  padding: 0 0 0 10px;
}

#title_right {
  width: 45%;
  padding: 0 10px 0 0;
}

.row {
  display: flex;
  background-color: #F8F8F8;
  margin: 10px 0;
  padding: 0;
  height: 45px;
}

.row_name, .row_amount, .row_amount_total {
  margin: 0px;
  padding: 10px;
}

.row_name {
  width: 55%;
}

.row_amount {
  width: 20%;
}

.row_amount_total {
  width: 45%;
}

#edit_button {
  width: 15%;
  align-self: center;
  padding-top: 6px;
  margin: auto;
}

#edit_button img {
  height: 35px;
}

#remove_button {
  width: 10%;
  self-align: center;
  padding-top: 6px;
  margin: auto;
}

#add_data {
  display: flex;
}

#add_category {
  margin: 5px 10px;
}

#add_category img {
  height: 30px;
  padding-top: 3px;
}

#name, #amount {
  margin: 10px 5px;
}

#amount {
  margin-right: 20px;
}

#name {
  width: 55%;
}

#amount {
  width: 21%;
}

#submit_button, #cancel_button {
  width: 12%;
  margin-horizontal: auto;
  margin-top: 6px;
}

#submit_button img {
  height: 25px;
}

#form_data {
  display: flex;
  padding: 0px 20px;
}

.deactivated {
  display: none;
}
</style>
