<template>
  <div class="review">
    <h1 class="title">Review Expenses</h1>
    <div class="content">
        <div class="table">
            <div class="tableHeaders">
                <h2 class="headerText">Date</h2>
                <h2 class="headerText">Category</h2>
                <h2 class="headerText">Amount</h2>
                <h2 class="headerText">Vendor</h2>
                <div class="headerButtonSpace"></div>
                <div class="headerButtonSpace"></div>
            </div>
            <h2 class="noShow" v-if="noItems">No expenses to show</h2>
            <RecycleScroller
            class="scroller"
            :items="expenses"
            :item-size="60"
            key-field="expenseID"
            >
            <template v-slot="{ item }">
                <!-- TODO: Add edit functionality, show description somehow -->
                <div class = "expense">
                    <div class="dateText, expenseText">
                        {{ item.dateString }}
                    </div>

                    <div class="descriptionText, expenseText">
                        {{ item.categoryName }}
                    </div>

                    <div class="amountText, expenseText">
                        ${{ item.amount }}
                    </div>

                    <div class="descriptionText, expenseText">
                        {{ item.vendorName }}
                    </div>
                    
                    <div class="buttonSpace">
                        <button class="btn" @click="deleteExpense(item)">Delete</button>
                    </div>
                    <div class="buttonSpace">
                        <button class="btn" @click="editExpense(item)">Edit</button>
                    </div>

                    <!--
                    <div class="descriptionText, expenseText">
                        {{ item.description }}
                    </div>
                    -->
                    
                </div>
            </template>
            </RecycleScroller>
        </div>
        <month-picker :no-default="true" :clearable="true" @change="dateChanged" @clear="dateCleared" class="picker"></month-picker>
    </div>
    <div class="budget">
        <h2 class="budgetTitle">Budget</h2>
        <div class="budgetHeaders">
            <h2>Category</h2>
            <h2>Amount</h2>
        </div>
        <h2 class="noShowBudgets" v-if="noBudgets">No budgets to show</h2>
            <RecycleScroller
            class="scroller"
            :items="budgets"
            :item-size="40"
            key-field="categoryID"
            >
            <template v-slot="{ item }">
                <div class = "budgetItem">
                    <div class="budgetText">
                        {{ item.name }}
                    </div>
                    <div class="budgetText">
                        ${{ item.amount }}
                    </div>
                </div>
            </template>
            </RecycleScroller>
    </div>
  </div>
</template>

<script>
import axios from "../main";
import { MonthPicker } from 'vue-month-picker'

export default {
  name: "Review",
  components: {
      MonthPicker
  },

  data: () => ({
    expenses: [],
    budgets: [],
    date: {
				from: null,
				to: null,
				month: null,
				year: null
			}
  }),
  computed: {
      noItems: function () {
          return !this.expenses.length;
      },
      noBudgets: function () {
          return !this.budgets.length;
      }
  },
  methods: {
    dateChanged(date) {
      this.updateDate(date);
      this.updateExpensesByDate();
    },
    dateCleared() {
      this.date = null;
      this.updateExpenses();
    },
    updateExpenses() {
      axios.post("/expenses/read_all_names").then((response) => {
        var result = response.data.result;
        var newExpenses = [];
        result.forEach((expense) => {
            var date = new Date(parseInt(expense.Day));
            var dateString = new Date(date).toLocaleString();
          newExpenses.push({
            expenseID: expense.expenseID,
            date: date,
            dateString: dateString,
            amount: expense.Amount,
            description: expense.Description,
            vendorName: expense.vendorName,
            categoryName: expense.categoryName
          });
        });
        this.expenses = newExpenses;
        this.expenses = this.expenses.reverse();
      });
    },
    updateExpensesByDate() {
      axios.post("/expenses/read_all_names_by_date", {
          month: this.getMonthFromString(this.date.month),
          year: this.date.year
      }).then((response) => {
        var result = response.data.result;
        var newExpenses = [];
        result.forEach((expense) => {
            var date = new Date(parseInt(expense.Day));
            var dateString = new Date(date).toLocaleString();
          newExpenses.push({
            expenseID: expense.expenseID,
            date: date,
            dateString: dateString,
            amount: expense.Amount,
            description: expense.Description,
            vendorName: expense.vendorName,
            categoryName: expense.categoryName
          });
        });
        this.expenses = newExpenses;
        this.expenses = this.expenses.reverse();
      });
    },
    editExpense() {
        // TODO
    },
    deleteExpense(expense) {
      if (confirm("Are you sure you want to delete that expense?")) {
        axios.post('/expenses/delete', {
          expenseID: parseInt(expense.expenseID)
        }).then(() => {
          alert("Expense deleted");
          if (this.date.month === null) {
            this.updateExpenses();
          }
          else {
            this.updateExpensesByDate();
          }
        }).catch(() => {
          alert("Error deleting expense");
        });
      }
      
    },
    updateDate(date) {
        this.date = date;
    },
    getMonthFromString(mon){
        return new Date(Date.parse(mon +" 1, 2012")).getMonth()+1
    },
    sortByID(a,b) {
        return parseInt(a.expenseID, 10) - parseInt(b.expenseID, 10);
    },
    updateBudgets() {
      axios.get("/budget/read_all").then((response) => {
        var result = response.data.result;
        var newBudgets = [];
        result.forEach((budget) => {
          newBudgets.push({
            categoryID: budget.categoryID,
            name: budget.Name,
            amount: budget.Amount
          });
        });
        this.budgets = newBudgets;
        this.budgets = this.budgets.reverse();
      });
    },
  },
  beforeMount() {
    this.updateExpenses();
    this.updateBudgets();
  },
};
</script>

<style scoped>

.title {
    margin: 0px;
    margin-bottom: 1%;
    padding: 0px;
}

.expense {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1.25em;
  text-align: center;
  color: rgb(56, 56, 56);
  width: 100%;
  display:flex;
  justify-content: space-around;
}

.scroller {
  height: 100%;
}

.content{
    display:inline;
}

.table {
    width: 60%;
    margin-top: 1%;
    margin-left: 10%;
}

.picker {
    display:inline-block;
    position:absolute;
    top: 18%;
    right: 6%;
}

.expenseText {
    display:inline;
    width:100%;
}

.tableHeaders {
    display: flex;
    justify-content: space-around;
    
}

.headerText {
    display: inline;
    width: 100%;
    text-decoration: underline;
}

.headerButtonSpace {
    width: 45%;
}

.buttonSpace {
    width: 45%;
}

.btn {
    margin: 0px;
}

.noShow {
    width:85%;
    color: #565656;
}

.budget {
    position: absolute;
    top: 45%;
    right: 5.5%;
    width: 22%;
}

.budgetTitle {
    font-size: 1.6em;
    margin: 0px;
}

.budgetHeaders {
    display:flex;
    justify-content: space-around;
    text-decoration: underline;
    font-size: 1em;
}

.budgetItem {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 1.25em;
  text-align: center;
  color: rgb(56, 56, 56);
  width: 100%;
  display:flex;
  justify-content: space-around;
}

.budgetText {
    display:inline;
    width:100%;
}

</style>
