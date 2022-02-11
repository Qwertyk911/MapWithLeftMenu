<template>
  <div style="height: 100%">
    <DxDrawer
      opened-state-mode="overlap"
      position="left"
      reveal-mode="slide"
      v-model="this.$store.openState"
      :opened="this.$store.openState"
      template="listMenu"
    >
      <template #listMenu>
        <NavigationList />
      </template>
      <div>
        <MapComponent />
      </div>
    </DxDrawer>
  </div>
</template>
<script>
import DxDrawer from "devextreme-vue/drawer";
import NavigationList from "./NavigationList.vue";
import MapComponent from "./MapComponent.vue";

export default {
  components: {
    DxDrawer,
    NavigationList,
    MapComponent,
  },
  data() {
    return {};
  },
};
</script>
<style scoped></style>
