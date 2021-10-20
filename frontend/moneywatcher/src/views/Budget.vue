<template>
  <div class="budget">
    <h1>Budget</h1>
    <div id="category_table">
      <div class="row">
        <h4 class="row_name">Category</h4>
        <h4>Amount</h4>
      </div>
      <div class="row" v-for="category in categories" :key="category.vendorID">
        <p class="row_name">{{category.Name}}</p>
        <p class="row_amount">${{category.Amount}}</p>
        <div id="remove_button" v-on:click="deleteCategory(category.categoryID)">
          X
        </div>
      </div>
      <div class="row">
        <h4 class="row_name">Total</h4>
        <h4>${{total_budget}}</h4>
      </div>
    </div>
    <div>
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
      new_amount: 0
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
    }
  },
  computed: {
    total_budget() {
      var total = 0;
      this.categories.forEach(getSum);
      function getSum(item, index, arr) {
        total += arr[index].Amount;
      }

      return total;
    }
  }
};

</script>

<style scoped>

#category_table {
  padding: 0px 20px;
}

.row {
  display: flex;
  text-align: left;
}

.row_name {
  width: 60%;
}

.row_amount {
  width: 30%;
}

#remove_button {
  width: 10%;
  text-align: center;
  margin: auto;
  border-style: solid;
}

#form_data {
  display: flex;
  padding: 0px 20px;
}


</style>
