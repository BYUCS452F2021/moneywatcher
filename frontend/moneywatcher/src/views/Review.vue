<template>
  <div class="review">
    <h1 class="header">Expenses</h1>
    <div class="headerSeparator"></div>
    <h2 v-if="noItems">No expenses to show</h2>
    <RecycleScroller
      class="scroller"
      :items="expenses"
      :item-size="120"
      key-field="expenseID"
    >
      <template v-slot="{ item }">
        <!-- TODO: Format each expense item and add the budget and vendor names
                              Add delete and edit functionality                -->
        <div class = "expense">
            <div class="expenseIDText">
                #{{ item.expenseID }}
            </div>

            <div class="dayText">
            {{ item.day }}
            </div>

            <div class="amountText">
            ${{ item.amount }}
            </div>

            <div class="descriptionText">
            {{ item.description }}
            </div>

            <div class="deleteButton">
            <b><strong>DELETE</strong></b>
            </div>


        </div>
        <div class="expenseSeparator"></div>
      </template>
    </RecycleScroller>
  </div>
</template>

<script>
import axios from "../main";

export default {
  name: "Review",
  components: {},

  data: () => ({
    expenses: [],
  }),
  computed: {
      noItems: function () {
          return !this.expenses.length;
      }
  },
  methods: {
    updateExpenses() {
        // TODO: Create an endpoint for reading expenses with budget and vendor names and use that instead
      axios.get("/expenses/read_all").then((response) => {
        var result = response.data.result;
        var newExpenses = [];
        result.forEach((expense) => {
          newExpenses.push({
            expenseID: expense.expenseID,
            day: expense.Day,
            amount: expense.Amount,
            description: expense.Description,
          });
        });
        this.expenses = newExpenses;
      });
    },
  },
  beforeMount() {
    this.updateExpenses();

  },
};
</script>

<style scoped>

.expense {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
}

.scroller {
  height: 100%;
}

.headerSeparator {
  border-top: 2px solid #555;
  width: 66%;
  margin: auto;
  padding-bottom: 10px;
}

.expenseSeparator {
    border-top: 1px dashed #999;
    width: 30%;
    margin: auto;
    margin-top: 14px;
}

.header {
    margin: 10px;
}

/* TODO: Create styles for each subitem in an expense */

</style>
