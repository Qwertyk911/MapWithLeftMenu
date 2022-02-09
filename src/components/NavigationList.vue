<template>
  <div class="dx-theme-accent-as-background-color" style="max-width: 300px">
    <div class="form">
      <div class="dx-fieldset" style="margin: 0 10px 0 0">
        <div class="dx-field">
          <div class="dx-field-label">Искать:</div>
          <div class="dx-field-value">
            <DxRadioGroup
              :items="priorities"
              :value="priorities[0]"
              @valueChanged="changeSelection"
            />
          </div>
        </div>
        <div class="dx-field">
          <DxButton
            icon="search"
            type="success"
            styling-mode="contained"
            @click="store.postAPI(postCity, searchOf)"
          />
          <div
            class="dx-field-value"
            @keyup.enter="store.postAPI(postCity, searchOf)"
          >
            <!-- <DxTextBox
              v-model="postCity"
              :placeholder="searchOf"
              :show-clear-button="true"
            /> -->

            <DxAutocomplete
            :data-source="store.listData"
            v-model="postCity"
            :value="postCity"
            placeholder="Type state name..."
            item-template="stateTemplate"
            :show-clear-button="true"
            @value-changed="autocomplete(postCity)"
          >
            <template #stateTemplate="{ data }">
              <span>{{ data }}</span>
            </template>
          </DxAutocomplete>
          </div>
        </div>
      </div>
    </div>
    <div v-if="store.name">
      <h4>{{ store.name }}</h4>
      <p>
        Широта: {{ store.latitude }}<br />
        Долгота: {{ store.longitude }}
      </p>
      <hr />
      <DxButton
        icon="trash"
        type="success"
        styling-mode="contained"
        @click="removeMarkByIndex()"
      />
    </div>
  </div>
</template>
<script>
import { DxAutocomplete } from "devextreme-vue/autocomplete";
import DxButton from "devextreme-vue/button";
import DxRadioGroup from "devextreme-vue/radio-group";
import store from "../store/index";

export default {
  components: {
    // DxList,
    DxButton,
    DxRadioGroup,
    DxAutocomplete
  },
  data() {
    return {
      store,
      priorities: ["По названию", "По координатам"],
      searchOf: "Введите название",
      postCity: "",
    };
  },
  methods: {
    changeSelection(e) {
      console.log(e);
      if (e.value === "По координатам") {
        this.searchOf = "Введите координаты";
      } else {
        this.searchOf = "Введите название";
      }
    },
    // Удаление метки по клику на нее
    removeMarkByIndex() {
      store.markers.splice(store.i, 1);
      store.name = "";
    },
    autocomplete(postCity) {
      postCity = "http://192.168.1.85/nominatim/search.php?q=" + postCity;
      fetch(postCity)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          store.listData = []
          for(let element of data){
            store.listData.push(element.display_name)
          }
            console.log(store.listData)
          
        });
    },
  },
};
</script>
<style scoped>
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
</style>
