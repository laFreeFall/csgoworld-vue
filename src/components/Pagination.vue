<template>
  <div
    v-if="pagination.total_pages > 1"
    class="pagination"
  >
    <p>
      {{ pagination.current_page }} of {{ pagination.total_pages }} page ({{ pagination.total_items }} records)
    </p>
    <div class="btn-group btn-xs">
      <button
        :disabled="pagination.is_first"
        @click="changePage(1)"
        class="btn btn-default"
      >
        &laquo;
      </button>
      <button
        :disabled="pagination.is_first"
        @click="changePage(pagination.current_page - 1)"
        class="btn btn-default"
      >
        &lsaquo;
      </button>
      <button
        class="btn btn-default"
        disabled
      >
        &hellip;
      </button>
      <button
        class="btn btn-default"
        :disabled="pagination.is_last"
        @click="changePage(pagination.current_page + 1)"
      >
        &rsaquo;
      </button>
      <button
        class="btn btn-default"
        :disabled="pagination.is_last"
        @click="changePage(pagination.total_pages)"
      >
        &raquo;
      </button>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  export default {
    props: {
      serverData: {
        type: Object,
        required: true
      },

      dataLink: {
        type: String,
        required: true
      }
    },

    computed: {
      pagination () {
        let totalPages = Math.ceil(this.serverData.total_items / this.serverData.per_page)
        return {
          total_pages: totalPages,
          is_first: this.serverData.current_page === 1,
          is_last: this.serverData.current_page === totalPages,
          ...this.serverData
        }
      }
    },

    methods: {
      changePage (pageIndex) {
        if (pageIndex >= 1 && pageIndex <= this.pagination.total_pages) {
          this.$emit('pageClicked')
          axios.post(this.dataLink, { page_id: pageIndex })
          .then((response) => {
            this.serverData.current_page = pageIndex
            this.$emit('dataReceived', response.data.logs)
          })
          .catch((error) => {
            console.log(error)
          })
        }
      }
    }
  }
</script>

<style>

</style>