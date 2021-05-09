<template>
        <v-footer app>
        <span>&copy; {{ new Date().getFullYear() }}</span>
        <v-spacer></v-spacer>
        <v-switch
          v-model="theme"
          label="暗黑模式"
          @change="switchTheme"
          ></v-switch>
      </v-footer>
</template>

<script>
export default {
  data: function () {
    return {
      theme: true
    }
  },
  methods: {
    switchTheme () {
      this.$emit('change-theme', this.theme)
    }
  }
}
</script>

<style>

</style>
