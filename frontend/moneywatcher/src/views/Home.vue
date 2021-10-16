<template>
  <div class="home">
    <h1>Add Expense</h1>
    <div class="column">
      <div class="row">
        <vue-autosuggest
            :suggestions="filteredOptions"
            :input-props="{id:'autosuggest__input', placeholder:'Do you feel lucky, punk?'}"
            @input="onInputChange"
            @selected="onSelected"
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
  data() {
    return {
      expense_category: "",
      expense_description: "",
      query: "",
      selected: "",
      suggestions: [
        {
          data: [
            { name: "Bill" },
            { name: "Bob" },
            { name: "Joe" }
          ]
        }
      ]
    };
  },
  computed: {
    filteredOptions() {
      return [
        { 
          data: this.suggestions[0].data.filter(option => {
            var include = option.name.toLowerCase().includes(this.query.toLowerCase());
            return include;
          })
        }
      ];
    }
  },
  methods: {
    onSelected(item) {
      this.selected = item.item.name;
      console.log(this.selected);
    },
    onInputChange(text) {
      // event fired when the input changes
      this.query = text;
    },
    /**
     * This is what the <input/> value is set to when you are selecting a suggestion.
     */
    getSuggestionValue(suggestion) {
      return suggestion.item.name;
    },
  }
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
