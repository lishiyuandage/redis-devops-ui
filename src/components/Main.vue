<template>
  <v-main>
        <v-container
          fluid
        >
          <v-row
            justify="center"
          >
            <v-col>
             <span class="text-body-1">{{headerTitle}}</span>
            </v-col>
          </v-row>
          <slot></slot>
        </v-container>
      </v-main>
</template>

<script>
export default {
  props: {
    headerTitle: {
      type: String,
      default: ''
    }
  }
}
</script>

<style>

</style>
