<template>
  <header>
      <!--抽屉菜单-->
      <v-navigation-drawer
        v-model="drawer"
        app
        clipped
      >
        <v-list dense>
            <v-list-item  v-for="(func,key) in funcs"  :key="key"  @click="switchFunc(func)">
            <v-list-item-action>
              <v-icon>{{func.icon}}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>{{func.title}}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    <!--头-->
      <v-app-bar
        app
        clipped-left
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Redis-devops </v-toolbar-title>
      </v-app-bar>

  </header>
</template>

<script>
import funcs from '../assets/func.json'

export default {
  data: () => ({
    funcs: funcs,
    drawer: true
  }),
  mounted () {
    this.$emit('change-func', funcs[0])
  },
  methods: {
    switchFunc (func) {
      this.$emit('change-func', func)
    }
  }
}
</script>

<style>

</style>
