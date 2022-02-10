<template>
  <l-map
    style="width: 100%; height: 100vh"
    :zoom="13"
    :center="store.center"
    @click="mapClick"
    :options="{ zoomControl: false }"
  >
  <l-control class="column" position="topleft">
    <transition name="fade">
  <DxToolbar :items="toolbarContent" v-if="!store.openState"/>
    </transition>
  </l-control>
    <l-tile-layer :url="url"></l-tile-layer>
    <l-marker
      @click="information(marker), store.openState='true', log($event)"
      v-for="(marker, key) in store.markers"
      :key="key"
      :lat-lng="marker"
    >
    ></l-marker>

    <!-- <l-control :style="backgrRight" class="column" position="topright">
      <a v-if="show" @click="(show = !show), switchBackRignt(show)"
        ><img src="../assets/next.png" style="max-width: 25px; float: right;"
      /></a>
      <a v-else @click="(show = !show), switchBackRignt(show)"
        ><img src="../assets/menu.png" style="max-width: 25px"
      /></a>

      <DxButton
        class="controlButton"
        text="Выравнивание по центру"
        type="success"
        styling-mode="contained"
        v-if="show"
        @click="centerMark"
      />
      <DxButton
        class="controlButton"
        text="Удалить маркер"
        type="success"
        styling-mode="contained"
        v-if="show"
        @click="removeMark"
      />
    </l-control> -->
    <l-control-zoom position="bottomright"></l-control-zoom>
  </l-map>
</template>

<script>
import { LMap, LTileLayer, LMarker, LControlZoom, LControl } from "vue2-leaflet";
import store from "../store/index";
import DxToolbar from "devextreme-vue/toolbar";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
    LControl,
    DxToolbar
  },
  data() {
    return {
      store,
      map: null,
      tileLayer: null,
      url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      toolbarContent: [
        {
          widget: "dxButton",
          location: "before",
          options: {
            icon: "menu",
            onClick: () => {
              store.openState = !store.openState;
              console.log(store.openState)
            },
          },
        },
      ],
    };
  },
  methods: {
    mapClick(event) {
      //this.markers.push(event.latlng);
      // Добавление меток по клику через номинатим-------------------------------------------------------------
      let koord = "Введите координаты";
      let zapros = `${event.latlng.lat} ${event.latlng.lng}`;
      store.postAPI(zapros, koord);
    },
    // Удаление  последней добавленной метки
    removeMark() {
      if (store.markers.length > 0) {
        store.markers.pop();
      } else {
        alert("Markers not found");
      }
    },
    // Выровнять карту по центру
    centerMark() {
      try {
        this.center = [
          store.markers[this.markers.length - 1].lat,
          store.markers[this.markers.length - 1].lng,
        ];
        this.zoom = 13;
      } catch (err) {
        alert("Сначала установите маркер");
      }
    },
    logs() {
      console.log("oncl");
    },

    // Вывод информации о метке----------------------------------------------------
    information(index) {
      // console.log(index);
      store.i = store.markers.indexOf(index);
      store.latitude = store.markers[store.i].lat;
      store.longitude = store.markers[store.i].lon;
      if (!store.longitude) {
        store.longitude = store.markers[store.i].lng;
      }
      store.name = store.markers[store.i].display_name;
    },

   
    log(event){
        console.log(event);
    }
    // Формирование запроса в номинатим/парсим ответ/добавляем метку на карту
  },
};
</script>
<style scoped>
.column {
  display: flex;
  flex-direction: column;
  margin: 0 !important;
}
.columnNoBackgr {
  display: flex;
  flex-direction: column;
}
.controlButton {
  margin: 5px;
}

.kol-flex {
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
}
.column > a > img:hover {
  border: 1px solid black;
  max-width: 23px !important;
  cursor: pointer;
}
.searchInput {
  margin: 5px 5px 15px;
  color: rgb(224, 224, 224);
  background-color: rgba(10, 10, 10, 0.6);
}
input::placeholder {
  color: rgb(224, 224, 224);
}
.labelOtvet {
  height: 100px;
  border: 1px solid black;
  margin: 5px;
  max-width: 217.969px;
}
.dx-toolbar {
  background-color: rgba(191, 191, 191, 0.15);
  padding: 5px 10px;
}

.dx-list-item-icon-container,
.dx-toolbar-before {
  width: 36px;
  padding-right: 0 !important;
  text-align: center;
}

.dx-list-item-content {
  padding-left: 10px !important;
}

.dx-button {
  background-color: rgba(191, 191, 191, -0.15);
  border: none;
}

.panel-list {
  height: 400px;
}

.dx-drawer-expand.dx-drawer-right .panel-list {
  float: right;
}

.panel-list .dx-list-item {
  color: #fff;
  border-top: 1px solid rgba(221, 221, 221, 0.2);
}

.panel-list .dx-list-item .dx-icon {
  color: #fff !important;
}

.options {
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.options-container {
  display: flex;
  align-items: center;
}

.caption {
  font-size: 18px;
  font-weight: 500;
}

.option {
  margin-top: 10px;
  display: inline-block;
  margin-right: 50px;
}

label {
  font-weight: bold;
}

#content {
  height: 100%;
  padding: 10px 20px;
}

#content h2 {
  font-size: 26px;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
