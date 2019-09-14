<template>
  <v-container fluid>
    <v-card class="my-6">
      <v-card-text>
        <!-- title  -->
        <v-text-field label="Title" v-model="data.title"></v-text-field>

        <!-- description  -->
        <v-text-field label="Description" v-model="data.description"></v-text-field>

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
            <v-text-field v-model="data.datetime" label="Date" readonly v-on="on"></v-text-field>
          </template>
          <v-date-picker v-model="data.datetime" @input="datePicker = false"></v-date-picker>
        </v-menu>

        <!-- tags -->
        <v-combobox
          v-model="data.tags"
          :items="data.tags"
          :small-chips="true"
          label="Tags"
          multiple
          persistent-hint
        >
          <template v-if="noTags" v-slot:no-data>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>
                  No results matching "
                  <kbd>enter</kbd> to create a new one
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-combobox>
      </v-card-text>
    </v-card>

    <!-- media_news -->
    <v-card class="my-6">
      <v-card-title class>
        <h4>Media News</h4>
        <v-btn class="ml-auto" @click="addNews('media_news')">Add</v-btn>
      </v-card-title>
      <v-tabs v-model="media_news_tab" vertical>
        <v-tab v-for="(tabs, index)  in  data.media_news" :key="tabs.id">{{index+1}}</v-tab>
        <v-tabs-items v-model="media_news_tab">
          <v-tab-item class="px-4 py-4" v-for="(tabs, index) in data.media_news" :key="tabs.uuid">
            <NewsForm
              :uuid="tabs.uuid"
              v-model="data.media_news[index]"
              :delete="deleteMediaNews"
              :index="index"
              :init="tabs"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card>

    <!-- offical_news -->
    <v-card class="my-6">
      <v-card-title class>
        <h4>Offical News</h4>
        <v-btn class="ml-auto" @click="addNews('offical_news')">Add</v-btn>
      </v-card-title>
      <v-tabs v-model="offical_news_tab" vertical>
        <v-tabs-slider></v-tabs-slider>
        <v-tab v-for="(tabs, index)  in  data.offical_news" :key="tabs.id">{{index+1}}</v-tab>
        <v-tabs-items v-model="offical_news_tab">
          <v-tab-item class="px-4 py-4" v-for="(tabs, index) in data.offical_news" :key="tabs.uuid">
            <NewsForm
              :uuid="tabs.uuid"
              v-model="data.offical_news[index]"
              :delete="deleteOfficalNews"
              :index="index"
              :init="tabs"
            />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
    </v-card>

    <!-- submit button  -->
    <div class="d-flex mt-4">
      <v-btn class="ml-auto" @click="sumbit">Submit</v-btn>
    </div>

    <!-- msg -->
    <v-snackbar v-model="notification" :timeout="1500">
      提交成功！
      <v-btn color="pink" text @click="notification = false">Close</v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { db } from "@/firebase";
import Editor from "@tinymce/tinymce-vue";
import NewsForm from "@/views/form/news.vue";
import { functions } from "firebase";
import uuid from "uuid/v4";
import _ from "lodash";
export default {
  data: function() {
    return {
      notification: false,
      media_news_tab: 0,
      offical_news_tab: 0,
      datePicker: false,
      noTags: true,
      data: {
        uuid: uuid(),
        tags: [],
        datetime: this.$moment().format("Y-MM-DD"),
        title: "",
        description: null,
        media_news: [],
        offical_news: [],
        state: "draft"
      }
    };
  },
  components: {
    "tinymce-editor": Editor,
    NewsForm
  },
  methods: {
    addNews: function(type) {
      if (type === "media_news") {
        this.data.media_news.push({
          uuid: uuid(),
          title: "",
          date: this.$moment().format("Y-MM-DD"),
          image: null,
          video: null,
          content: null,
          source_name: null,
          source_link: null
        });
      }
      if (type === "offical_news") {
        this.data.offical_news.push({
          uuid: uuid(),
          title: "",
          date: this.$moment().format("Y-MM-DD"),
          image: null,
          video: null,
          content: null,
          source_name: null,
          source_link: null
        });
      }
    },
    deleteMediaNews: function(index) {
      this.data.media_news.splice(index, 1);
    },
    deleteOfficalNews: function(index) {
      this.data.offical_news.splice(index, 1);
    },
    sumbit: function() {
      db.collection("timeline")
        .add(this.data)
        .then(() => {
          this.$router.push("/timeline");
          this.notification = true;
        });
    }
  },
  firestore: {
    lists: db.collection("timeline")
  }
};
</script>
