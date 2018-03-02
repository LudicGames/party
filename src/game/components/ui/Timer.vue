<template lang="pug">
  #timer
    h1 {{time}}
</template>

<script>
import {LudicComponent} from 'ludic-vue'
export default LudicComponent.extend({
  name: 'Timer',
  data(){
    return {
      ready: false,
      time: 30,
    }
  },
  mounted(){
    if(this.componentArgs[0].time){
      this.time = this.componentArgs[0].time
    }
    setInterval(()=>{
      this.time--
      if(this.time == 0){
        this.$ludicEmit('onTimeUp')
      }
    }, 1000)
  }
})
</script>

<style lang="stylus">
#timer
  position absolute
  opacity .5
  top 10px
  right 10px
  h1
    color red
    font-size 4em
    margin 0px
    padding 0px
</style>
