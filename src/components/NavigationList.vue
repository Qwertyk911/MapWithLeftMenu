<template>
  <!-- Недочеты/ошибки
1. Серая полоса сверху
2. Полоса прокрутки справа 
3. Размеры левого меню-->

  <div class="left-menu-background">
    <DxToolbar :items="toolbarContent" style="background: transparent" />
    <div class="form">
      <div class="dx-fieldset">
        <div class="dx-field">
          <div class="dx-field-label">Искать:</div>
          <div class="dx-field-value">
            <div class="normal">
              <DxRadioGroup
                :items="priorities"
                :value="priorities[0]"
                @valueChanged="changeSelection"
              />
            </div>
          </div>
        </div>
        <div class="dx-field" style="margin-top: 10px">
          <div @keyup.enter="store.postAPI(postCity, searchOf)">
            <DxAutocomplete
              :data-source="store.listData"
              v-model="postCity"
              :value="postCity"
              :placeholder="searchOf"
              item-template="stateTemplate"
              :show-clear-button="true"
              @value-changed="autocomplete(postCity, searchOf)"
            >
              <template #stateTemplate="{ data }">
                <span @click="store.postAPI(data, searchOf)">{{ data }}</span>
              </template>
            </DxAutocomplete>
          </div>
          <DxButton
            icon="search"
            text="Поиск"
            type="success"
            styling-mode="contained"
            @click="store.postAPI(postCity, searchOf)"
            style="margin: 5px"
          />
        </div>
      </div>
    </div>
    <div v-if="store.name" class="informBlock">
      <h4>{{ store.name }}</h4>
      <p>
        Широта: {{ store.latitude }}<br />
        Долгота: {{ store.longitude }}
      </p>
      <hr />
      <DxButton
        icon="trash"
        text="Удалить"
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
import DxToolbar from "devextreme-vue/toolbar";

export default {
  components: {
    DxButton,
    DxRadioGroup,
    DxAutocomplete,
    DxToolbar,
  },
  data() {
    return {
      store,
      priorities: ["По названию", "По координатам"],
      searchOf: "Введите название",
      postCity: "",
      toolbarContent: [
        {
          widget: "dxButton",
          location: "before",
          options: {
            icon: "menu",
            onClick: () => {
              store.openState = !store.openState;
              console.log(store.openState);
            },
          },
        },
      ],
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
    autocomplete(postCity, searchOf) {
      if (searchOf == "Введите название") {
        postCity = "http://192.168.1.85/nominatim/search.php?q=" + postCity;
        fetch(postCity)
          .then((response) => {
            return response.json();
          })
          .then((data) => {
            store.listData = [];
            for (let element of data) {
              store.listData.push(element.display_name);
            }
            console.log(store.listData);
          });
      }
    },
  },
};
</script>
<style scoped>
.left-menu-background {
  background-color: rgba(51, 122, 183, 0.8) !important;
  fill: #337ab7 !important;
}
.dx-field-label {
  color: white;
  font-size: 1.2em;
}
.informBlock {
  color: white;
  margin: 5px;
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
.normal .dx-radiobutton-checked .dx-radiobutton-icon .dx-radiobutton-icon-dot {
  background: green !important;
}
.dx-item-content {
  color: white !important;
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
<style>
.dx-item-content {
  color: #fff;
}
</style>
