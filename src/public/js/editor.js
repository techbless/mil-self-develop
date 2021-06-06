const textArea = document.getElementById('editor');

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
    this.mdRaw = textArea.value;
  },
  methods: {
    mdRender: function() {
      this.mdRawRender = marked(this.mdRaw);
    }
  }
})