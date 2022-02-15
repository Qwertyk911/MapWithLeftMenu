// TODO: 1) min-max широта и долгота для массива маркеров, // 2) Занести их в
bounds // 3) Проверить работоспособность и реакцию на изменение параметра
<template>
  <l-map
    style="width: 100%; height: 100vh"
    :zoom="store.zoom"
    :center="store.center"
    @click="mapClick"
    :options="{ zoomControl: false, attributionControl: false }"
    :bounds="bounds"
    @update:bounds="updateBounds($event)"
  >
    <l-control class="column" position="topleft">
      <transition name="fade">
        <DxToolbar :items="toolbarContent" v-if="!store.openState" />
      </transition>
    </l-control>
    <l-tile-layer :url="url"></l-tile-layer>
    <l-marker
      @click="information(marker), (store.openState = true)"
      v-for="(marker, key) in store.markers"
      :key="key"
      :lat-lng="marker"
    >
      ></l-marker
    >
    <l-control-zoom position="bottomright"></l-control-zoom>
  </l-map>
</template>

<script>
import { latLngBounds } from "leaflet";
import {
  LMap,
  LTileLayer,
  LMarker,
  LControlZoom,
  LControl,
} from "vue2-leaflet";
import store from "../store/index";
import DxToolbar from "devextreme-vue/toolbar";
export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
    LControl,
    DxToolbar,
  },
  data() {
    return {
      store,
      map: null,
      tileLayer: null,
      // url: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      url: "http://192.168.1.85/hot/{z}/{x}/{y}.png",
      toolbarContent: [
        {
          widget: "dxButton",
          location: "before",
          options: {
            icon: "menu",
            onClick: () => {
              store.openState = !store.openState;
            },
          },
        },
      ],
      bounds: latLngBounds([
        [-180, -180],
        [180, 180],
      ]),
      // maxBounds: latLngBounds([
      //   [40.70081290280357, -74.26963806152345],
      //   [40.82991732677597, -74.08716201782228],
      // ]),
    };
  },
  mounted() {
    this.jsonParser();
  },
  methods: {
    mapClick(event) {
      // Adding markers by clicking through nominatim-------------------------------------------------------------
      let koord = "Введите координаты";
      let zapros = `${event.latlng.lat} ${event.latlng.lng}`;
      store.postAPI(zapros, koord);
    },
    // Align the center of map
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

    // Display information about the Marker----------------------------------------------------
    information(index) {
      store.i = store.markers.indexOf(index);
      store.latitude = store.markers[store.i].lat;
      store.longitude = store.markers[store.i].lon;
      if (!store.longitude) {
        store.longitude = store.markers[store.i].lng;
      }
      store.name = store.markers[store.i].display_name;
    },
    //? Get on the input JSON file, immediately apply marks on the map-----------------
    jsonParser() {
      fetch(" http://localhost:3000/data")
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          //! Finish the code starting from here------------------------------------------

          // let dynamicX = 0;
          //let dynamicY = 0;
          for (let obj of data) {
            console.log(`${this.bounds._northEast.lat} first`);

            this.$set(
              this.bounds._northEast,
              "lat",

              this.bounds._northEast.lat > obj.lat
                ? obj.lat
                : this.bounds._northEast.lat
            );
            console.log(`${this.bounds._northEast.lat} second`);

            // this.bounds._northEast.lat =
            //   this.bounds._northEast.lat > obj.lat
            //     ? obj.lat
            //     : this.bounds._northEast.lat;
            this.$set(
              this.bounds._northEast,
              "lng",

              this.bounds._northEast.lng > obj.lon
                ? obj.lon
                : this.bounds._northEast.lng
            );
            // this.bounds._northEast.lng =
            //   this.bounds._northEast.lng > obj.lon
            //     ? obj.lon
            //     : this.bounds._northEast.lng;

            //
            this.$set(
              this.bounds._southWest,
              "lat",

              this.bounds._southWest.lat < obj.lat
                ? obj.lat
                : this.bounds._southWest.lat
            );

            // this.bounds._southWest.lat =
            //   this.bounds._southWest.lat < obj.lat
            //     ? obj.lat
            //     : this.bounds._southWest.lat;

            this.$set(
              this.bounds._southWest,
              "lng",

              this.bounds._southWest.lng < obj.lon
                ? obj.lon
                : this.bounds._southWest.lng
            );
            // this.bounds._southWest.lng =
            //   this.bounds._southWest.lng < obj.lon
            //     ? obj.lon
            //     : this.bounds._southWest.lng;
            // Middle arithmetic for map centering --------------------------------------
            // dynamicX += obj.lat;
            // dynamicY += obj.lon;
            //? If there is no name, we perform a search by coordinates---------------------
            if (!obj.display_name) {
              let formedRequest = `${obj.lat.toString()} ${obj.lon.toString()}`;
              //console.log(formedRequest);
              store.postAPI(formedRequest, "Введите координаты");
              //? If there are no coordinates, send the name to Nominatim-----------------
            } else if (!obj.lat || !obj.lon) {
              store.postAPI(obj.display_name, "Введите название");
            } else {
              store.markers.push(obj);
              //store.zoom = 8;
            }
          }
          //           LatLngBounds {_southWest: LatLng, _northEast: LatLng}
          // _northEast: LatLng {lat: 80.4157074446218, lng: 196.52343750000003}
          // _southWest: LatLng {lat: -73.8248203461393, lng: -148.71093750000003}
          console.log(this.bounds);
          // Install the center map--------------------------------------------------
          // dynamicX = dynamicX / data.length;
          // dynamicY = dynamicY / data.length;
          // store.center = [dynamicX, dynamicY];
        });
    },
    updateBounds(event) {
      console.log("worked");
      console.log(event);
      event._northEast.lat = 33;
      event._northEast.lng = -33;
      event._southWest.lat = 44;
      event._southWest.lng = -44;
      console.log(event);
      for (let marker of store.markers) {
        this.bounds._northEast.lat =
          this.bounds._northEast.lat > marker.lat
            ? marker.lat
            : this.bounds._northEast.lat;
      }
    },
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
  opacity: 0;
}
</style>
