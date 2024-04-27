<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      Welcome to Exloapi, your interface for managing and proxying requests to external Large Language Models (LLMs).
    </p>
    <p>
      Use the navigation bar to access different sections of the application.
    </p>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    console.log("HelloWorld component has been mounted.");
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  color: #42b983;
}
p {
  color: #333;
}
</style>