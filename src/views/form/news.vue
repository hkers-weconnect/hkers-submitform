<template>
  <v-form>
    <!-- title  -->
    <v-text-field label="Title" v-model="value.title"></v-text-field>

    <!-- date -->
    <v-menu
      v-model="datePicker"
      :close-on-content-click="false"
      :nudge-right="40"
      transition="scale-transition"
      offset-y
      full-width
      min-width="290px"
    >
      <template v-slot:activator="{ on }">
        <v-text-field v-model="value.date" label="Post Datetime" readonly v-on="on"></v-text-field>
      </template>
      <v-date-picker v-model="value.date" @input="datePicker = false"></v-date-picker>
    </v-menu>

    <!-- image -->
    <v-file-input
      label="Image"
      accept="image/png, image/jpeg, image/bmp"
      prepend-icon="mdi-camera"
      @change="onFileChange"
    ></v-file-input>

    <!-- video -->
    <v-text-field label="Video" v-model="value.video"></v-text-field>

    <!-- source_link -->
    <v-text-field label="Source Name" v-model="value.source_name"></v-text-field>
    <v-text-field label="Source Link" v-model="value.source_link"></v-text-field>

    <tinymce-editor
      v-model="value.content"
      class="tinymce-editor"
      :api-key="tinymceKey"
      :init="tinymceConfig"
    ></tinymce-editor>
    <fileselector />

    <!-- delete button  -->
    <div class="d-flex mt-4">
      <v-btn class="ml-auto" color="error" @click.stop="deleteDialog = true">Delete</v-btn>
    </div>

    <!-- delete dialog  -->
    <v-dialog v-model="deleteDialog" max-width="350">
      <v-card>
        <v-card-title class="headline">Are You Sure to Delete?</v-card-title>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="deleteDialog = false">No</v-btn>
          <v-btn color="error darken-1" text @click="handleDelete">Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-form>
</template>

<script>
import { storage, functions } from "@/firebase";
import Editor from "@tinymce/tinymce-vue";
import fileselector from "./fileselector";
export default {
  props: {
    init: Object,
    uuid: [Number, String],
    index: Number,
    delete: {
      type: Function,
      default: () => {}
    }
  },
  data: function() {
    return {
      value: {
        uuid: this.init.uuid,
        title: this.init.title,
        date: this.$moment(this.init.date).format("Y-MM-DD"),
        image: this.init.image,
        video: this.init.video,
        content: this.init.content,
        source_name: this.init.source_name,
        source_link: this.init.source_link
      },
      deleteDialog: false,
      datePicker: false,
      file: null,
      tinymceKey: process.env.VUE_APP_TINYMCE_KEY,
      tinymceConfig: {
        plugins:
          "print preview fullpage powerpaste casechange importcss searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter permanentpen pageembed charmap  mentions quickbars linkchecker emoticons image",
        menubar: "file edit view insert format tools table tc help",
        toolbar:
          "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print |  image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
        height: 600,
        images_upload_url:
          "https://us-central1-hkers-6c94f.cloudfunctions.net/uploadImage",
        images_upload_handler: this.uploadImage,
        file_picker_callback: function(callback, value, meta) {
          // if (meta.filetype == "file") {
          //   callback("mypage.html", { text: "My text" });
          // }

          // Provide image and alt text for the image dialog
          if (meta.filetype == "image") {
            // Provide file and text for the link dialog
            var storageRef = storage.ref("images");

            // Now we get the references of these images
            storageRef
              .listAll()
              .then(function(result) {
                window.modal.show("file-selector", {
                  onSelect: callback,
                  files: result
                });
              })
              .catch(function(error) {
                // Handle any errors
              });
          }
          // // Provide alternative source and posted for the media dialog
          // if (meta.filetype == "media") {
          //   callback("movie.mp4", { source2: "alt.ogg", poster: "image.jpg" });
          // }
        }
      }
    };
  },
  watch: {
    value: {
      handler(val) {
        this.$emit("update", val);
      },
      deep: true
    }
  },
  components: {
    "tinymce-editor": Editor,
    fileselector
  },
  methods: {
    handleDelete() {
      this.delete(this.index);
      this.deleteDialog = false;
    },
    uploadImage(blobInfo, success, failure) {
      functions
        .httpsCallable("uploadImage")({
          name: blobInfo.filename(),
          image: blobInfo.base64()
        })
        .then(data => {
          success(data.data.photoURL);
        });
    },
    onFileChange(file) {
      this.value.image = "images/" + file.name;
      this.file = file;

      storage
        .ref()
        .child("images/" + file.name)
        .put(file)
        .then(function(snapshot) {
          console.log("Uploaded a blob or file!");
        });
    }
  },
  model: {
    prop: "value",
    event: "update"
  },
  mounted() {
    window.modal = this.$modal;
  }
};
</script>
<style lang="scss" scoped>
.tinymce-editor {
  width: 100%;
}
</style>
