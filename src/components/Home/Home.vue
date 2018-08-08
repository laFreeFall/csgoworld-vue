<template>
  <div class="container">
    <div class="row col-md-12">
      <h1 class="text-center">Home page</h1>
      <!--{{ user }}-->
      <el-popover
        placement="top-start"
        title="TITLE"
        trigger="hover"
      >
        <button slot="reference" class="btn btn-info bnt-lg">Show me a popover!</button>
        <div>test</div>
      </el-popover>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters([
        'user'
      ])
    }
  }
</script>