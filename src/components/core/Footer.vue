<template>
  <v-footer id="core-footer" height="40">
    <v-spacer />
    <span class="font-weight-light copyright">Power by hkers</span>
  </v-footer>
</template>

<script>
export default {
  data: () => ({
    links: [
      { name: "Home", Link: "/#" },
      { name: "Creative Tim", Link: "https://www.creative-tim.com" },
      { name: "About Us", Link: "https://creative-tim.com/presentation" },
      { name: "Blog", Link: "https://blog.creative-tim.com" }
    ]
  })
};
</script>

<style>
#core-footer {
  z-index: 0;
}
</style>
