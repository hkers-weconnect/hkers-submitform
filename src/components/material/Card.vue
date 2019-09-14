<template>
  <v-card :style="styles" v-bind="$attrs" v-on="$listeners">
    <helper-offset v-if="hasOffset" :inline="inline" :full-width="fullWidth" :offset="offset">
      <v-card
        v-if="!$slots.offset"
        :color="color"
        :elevation="elevation"
        class="v-card--material__header d-flex align-center"
        dark
        min-height="50"
      >
        <slot v-if="!title && !text" name="header" />
        <div v-else class="px-3 d-flex" style="width:100%" >
          <h4 class="title font-weight-light" v-text="title" />
          <v-spacer />
          <v-btn value="add" :to="create">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </v-card>

      <slot v-else name="offset" />
    </helper-offset>

    <v-card-text>
      <slot />
    </v-card-text>

    <v-divider v-if="$slots.actions" class="mx-3" />

    <v-card-actions v-if="$slots.actions">
      <slot name="actions" />
    </v-card-actions>
  </v-card>
</template>

<script>
export default {
  name: "MaterialCard",

  inheritAttrs: false,

  props: {
    color: {
      type: String,
      default: "yellow"
    },
    elevation: {
      type: [Number, String],
      default: 10
    },
    inline: {
      type: Boolean,
      default: false
    },
    fullWidth: {
      type: Boolean,
      default: false
    },
    offset: {
      type: [Number, String],
      default: 24
    },
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: ""
    },
    create: {
      type: String,
      default: ""
    }
  },

  computed: {
    hasOffset() {
      return (
        this.$slots.header || this.$slots.offset || this.title || this.text
      );
    },
    styles() {
      if (!this.hasOffset) return null;

      return {
        marginBottom: `${this.offset}px`,
        marginTop: `${this.offset * 2}px`
      };
    }
  }
};
</script>
