<template>
   <div ref="main" :style="{width: width + 'px', height: height + 'px', background: background}">
       <terminal></terminal>
   </div>
</template>

<script>
  import {ipcRenderer} from 'electron'
  export default {
    name: 'mainPage',
    data () {
      return {
        width: 100,
        height: 100,
        background: 'rgb(22,102,47)'
      }
    },
    methods: {
    },
    created () {
      window.addEventListener('resize', () => {
        this.width = document.documentElement.clientWidth
        this.height = document.documentElement.clientHeight
      })
    },
    mounted () {
      this.width = document.documentElement.clientWidth
      this.height = document.documentElement.clientHeight
      ipcRenderer.on('toggleColor', (event, data) => {
        this.background = data.background
      })
    },
    components: {
      terminal: require('./terminal').default
    }
  }
</script>

<style>
    body {
        margin: 0
    }
    html,body{height:100%;overflow: hidden}
</style>