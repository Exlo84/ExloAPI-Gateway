<template>
  <div>
    <button @click="loadModels">Load Models</button>
    <div v-for="model in models" :key="model.id">
      {{ model.name }}
      <button @click="deleteModel(model.id)">Delete</button>
      <!-- Add and Edit forms here -->
    </div>
    <!-- Form for adding a new model -->
  </div>
</template>

<script>
import apiService from '../services/apiService';

export default {
  data() {
    return {
      models: [],
    };
  },
  methods: {
    loadModels() {
      apiService.listLLMEntries().then(response => {
        console.log('LLM entries listed successfully.');
        this.models = response.data;
      }).catch(error => {
        console.error("Failed to load models:", error.message);
        console.error(error.stack);
      });
    },
    deleteModel(id) {
      apiService.deleteLLMEntry(id).then(() => {
        console.log('LLM entry deleted successfully.');
        this.loadModels(); // Refresh the list after deleting
      }).catch(error => {
        console.error("Failed to delete model:", error.message);
        console.error(error.stack);
      });
    },
    // Methods for addModel and editModel go here
  },
  mounted() {
    this.loadModels();
  }
};
</script>

<style>
/* Add CSS styling if needed */
</style>