var vm = new Vue({
  el: '#editor_window',
  data: {
    mdRaw: '',
    mdRawRender: ''
  },
  watch: {
    mdRaw: function(){
      this.mdRender()
    }
  },
  created() {
    this.mdRaw = '';
  },
  methods: {
    mdRender: function() {
      this.mdRawRender = marked(this.mdRaw);
    }
  }
})