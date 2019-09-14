<template>
  <modal
    class="file-modal"
    name="file-selector"
    @before-open="beforeOpen"
    :clickToClose="false"
    width="80%"
    height="80%"
    :maxHeight="800"
    :maxWidth="1000"
  >
    <v-progress-circular
      class="loading"
      v-if="files.length === 0"
      indeterminate
      rotate
      :size="50"
      color="light-blue"
    ></v-progress-circular>

    <div class="list">
      <div
        v-for="(file,index) in files"
        :key="index"
        :style="{'background-image': 'url('+file+')'}"
        @click="onSelect(file);$modal.hide('file-selector');"
      />
    </div>
  </modal>
</template>

<script>
import _ from "lodash";

export default {
  data() {
    return {
      onSelect: () => {},
      files: []
    };
  },
  methods: {
    beforeOpen(event) {
      this.onSelect = event.params.onSelect;
      var files = [];
      _.forEach(event.params.files.items, async item => {
        var url = await item.getDownloadURL();
        files.push(url);
      });
      this.files = files;
    }
  }
};
</script>

<style lang="scss" scoped>
.file-modal {
  z-index: 1301;

  .loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .list {
    display: flex;
    flex-direction: row;

    div {
      position: relative;
      width: 120px;
      height: 120px;
      margin: 1rem;
      background-position: center center;
      background-repeat: no-repeat;
      background-size: cover;
      border: 3px solid transparent;

      &:hover {
        border-color: #fad735;
      }
    }
  }
}
</style>
